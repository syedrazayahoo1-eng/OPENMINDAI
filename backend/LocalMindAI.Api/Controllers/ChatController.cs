using System.Text;
using LocalMindAI.Api.Data;
using LocalMindAI.Api.DTOs;
using LocalMindAI.Api.Models;
using LocalMindAI.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace LocalMindAI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ChatController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly AIService _aiService;

    public ChatController(ApplicationDbContext context, AIService aiService)
    {
        _context = context;
        _aiService = aiService;
    }

    [HttpPost("send")]
    public async Task<IActionResult> Send(ChatRequest request)
    {
        var email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value
            ?? User.FindFirst(JwtRegisteredClaimNames.Email)?.Value
            ?? User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

        if (string.IsNullOrEmpty(email))
            return Unauthorized();

        var aiResponse = await _aiService.AskAI(request.Message);

        var chat = new ChatMessage
        {
            UserEmail = email,
            UserMessage = request.Message,
            AiResponse = aiResponse,
            CreatedAt = DateTime.UtcNow
        };

        _context.ChatMessages.Add(chat);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            User = request.Message,
            AI = aiResponse
        });
    }

    /// <summary>
    /// Streams the AI response to <paramref name="request"/> directly to the HTTP
    /// response body as it is generated, instead of waiting for the full completion
    /// as <see cref="Send"/> does. Uses the same authentication and persistence
    /// contract as <see cref="Send"/>: the caller must be authenticated (enforced by
    /// the controller-level <see cref="AuthorizeAttribute"/>), and the full exchange
    /// is saved to the database once streaming finishes.
    /// </summary>
    /// <remarks>
    /// Tokens are written as plain UTF-8 text chunks, flushed as they arrive, so a
    /// client reading the response body as a stream (e.g. via <c>fetch</c> with a
    /// <c>ReadableStream</c> reader) sees output incrementally rather than all at
    /// once at the end.
    /// </remarks>
    [HttpPost("stream")]
    public async Task Stream(ChatRequest request, CancellationToken cancellationToken)
    {
        var email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value
            ?? User.FindFirst(JwtRegisteredClaimNames.Email)?.Value
            ?? User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

        if (string.IsNullOrEmpty(email))
        {
            Response.StatusCode = StatusCodes.Status401Unauthorized;
            return;
        }

        Response.ContentType = "text/plain; charset=utf-8";
        Response.Headers["Cache-Control"] = "no-cache";
        // Hint to reverse proxies (e.g. Nginx) not to buffer the streamed response.
        Response.Headers["X-Accel-Buffering"] = "no";

        var responseBuilder = new StringBuilder();

        try
        {
            await foreach (var chunk in _aiService.StreamAIResponse(request.Message, cancellationToken))
            {
                responseBuilder.Append(chunk);
                await Response.WriteAsync(chunk, Encoding.UTF8, cancellationToken);
                await Response.Body.FlushAsync(cancellationToken);
            }
        }
        catch (OperationCanceledException)
        {
            // Client disconnected or the request was cancelled mid-stream.
            // Nothing further can be written to the response; skip persistence
            // of a partial exchange and return quietly.
            return;
        }

        // Persist the full exchange once streaming has completed successfully,
        // mirroring the persistence behavior of Send.
        var chat = new ChatMessage
        {
            UserEmail = email,
            UserMessage = request.Message,
            AiResponse = responseBuilder.ToString(),
            CreatedAt = DateTime.UtcNow
        };

        _context.ChatMessages.Add(chat);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
