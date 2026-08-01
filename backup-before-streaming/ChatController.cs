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
}