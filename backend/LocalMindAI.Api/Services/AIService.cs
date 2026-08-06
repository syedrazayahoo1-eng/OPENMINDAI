using System.Runtime.CompilerServices;
using LocalMindAI.Api.Services.AI;
using Microsoft.Extensions.Logging;
using LocalMindAI.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace LocalMindAI.Api.Services;

/// <summary>
/// Application-facing AI service used by existing callers (e.g. <c>ChatController</c>).
/// The public surface (<see cref="AskAI"/>) is unchanged from the original Ollama-only
/// implementation, but internally it now delegates to the Enterprise AI Gateway via
/// <see cref="IAIProviderFactory"/>, so the actual backend (Azure OpenAI or Ollama) is
/// resolved from configuration rather than hard-coded.
/// </summary>
public class AIService
{
    private readonly IAIProviderFactory _providerFactory;
    private readonly ILogger<AIService> _logger;
    private readonly ApplicationDbContext _context;

    public AIService(IAIProviderFactory providerFactory, ILogger<AIService> logger, ApplicationDbContext context)
    {
        _providerFactory = providerFactory;
        _logger = logger;
        _context = context;
    }

    /// <summary>
    /// Sends a single prompt to the AI Gateway and returns the generated text.
    /// Signature and behavior (return type, exception-on-failure) are unchanged from
    /// the previous implementation, so existing callers require no changes.
    /// </summary>
    /// <param name="prompt">The user prompt to send to the model.</param>
    /// <returns>The model's generated response text.</returns>
    /// <exception cref="Exception">
    /// Thrown when the configured provider cannot produce a successful response.
    /// </exception>
    public async Task<string> AskAI(string prompt)
    {
        _logger.LogInformation("AskAI invoked, prompt length {Length}", prompt?.Length ?? 0);

        var request = new AIRequest
        {
            Prompt = prompt ?? string.Empty,
            SystemPrompt = await BrandVoicePromptAsync()
        };

        var provider = _providerFactory.GetDefaultProvider();

        _logger.LogInformation("Using configured AI provider '{ProviderName}'.", provider.ProviderName);

        var response = await provider.GenerateAsync(request).ConfigureAwait(false);

        if (!response.IsSuccess)
        {
            _logger.LogError("AI Gateway request failed: {Error}", response.ErrorMessage);
            throw new Exception($"AI Error: {response.ErrorMessage}");
        }

        _logger.LogInformation(
            "AskAI completed via '{ProviderName}' in {DurationMs}ms.",
            response.ProviderName,
            response.DurationMs);

        return response.Content;
    }

    /// <summary>
    /// Streams a response to the given prompt from the AI Gateway, yielding
    /// incremental text chunks as they are generated instead of waiting for the
    /// full completion. Provider selection mirrors <see cref="AskAI"/>: the
    /// configured default provider is always used.
    /// </summary>
    /// <param name="prompt">The user prompt to send to the model.</param>
    /// <param name="cancellationToken">
    /// Token used to stop streaming early (e.g. when the client disconnects).
    /// </param>
    /// <returns>An asynchronous sequence of text chunks as they are generated.</returns>
    /// <remarks>
    /// A failure once streaming has started is left to the caller because output may
    /// already have been forwarded to the HTTP response.
    /// </remarks>
    public async IAsyncEnumerable<string> StreamAIResponse(
        string prompt,
        [EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("StreamAIResponse invoked, prompt length {Length}", prompt?.Length ?? 0);

        var request = new AIRequest
        {
            Prompt = prompt ?? string.Empty,
            SystemPrompt = await BrandVoicePromptAsync()
        };

        var provider = _providerFactory.GetDefaultProvider();

        _logger.LogInformation("Streaming via configured AI provider '{ProviderName}'.", provider.ProviderName);

        await foreach (var chunk in provider.StreamAsync(request, cancellationToken).ConfigureAwait(false))
        {
            yield return chunk;
        }
    }
    private async Task<string> BrandVoicePromptAsync() { var voice = await _context.BrandVoices.AsNoTracking().OrderBy(item => item.Id).FirstOrDefaultAsync(); return voice is null ? "" : $"Apply this Brand Voice to every response: Business={voice.BusinessName}; Industry={voice.Industry}; Writing style={voice.WritingStyle}; Tone={voice.Tone}; Audience={voice.Audience}; Language={voice.Language}; Keywords={voice.Keywords}; Emoji enabled={voice.EmojiEnabled}; CTA enabled={voice.CallToActionEnabled}; Reply length={voice.ReplyLength}."; }
}
