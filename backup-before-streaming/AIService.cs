using LocalMindAI.Api.Services.AI;
using Microsoft.Extensions.Logging;

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

    public AIService(IAIProviderFactory providerFactory, ILogger<AIService> logger)
    {
        _providerFactory = providerFactory;
        _logger = logger;
    }

    /// <summary>
    /// Sends a single prompt to the AI Gateway and returns the generated text.
    /// Signature and behavior (return type, exception-on-failure) are unchanged from
    /// the previous implementation, so existing callers require no changes.
    /// </summary>
    /// <param name="prompt">The user prompt to send to the model.</param>
    /// <returns>The model's generated response text.</returns>
    /// <exception cref="Exception">
    /// Thrown when neither the configured default provider nor the Ollama fallback
    /// can produce a successful response, preserving the original failure contract.
    /// </exception>
    public async Task<string> AskAI(string prompt)
    {
        _logger.LogInformation("AskAI invoked, prompt length {Length}", prompt?.Length ?? 0);

        var request = new AIRequest
        {
            Prompt = prompt ?? string.Empty
        };

        var provider = _providerFactory.GetDefaultProvider();

        // If the configured default is Azure OpenAI but it isn't actually configured
        // (missing endpoint/key/deployment) or is unreachable, fall back to Ollama.
        if (provider.ProviderType == AIProviderType.AzureOpenAI && !await provider.IsAvailableAsync().ConfigureAwait(false))
        {
            _logger.LogWarning("Azure OpenAI is not configured or unavailable. Falling back to Ollama.");
            provider = _providerFactory.GetProvider(AIProviderType.Ollama);
        }
        else
        {
            _logger.LogInformation("Using AI provider '{ProviderName}'.", provider.ProviderName);
        }

        var response = await provider.GenerateAsync(request).ConfigureAwait(false);

        // If the primary attempt was Azure OpenAI and it failed at request time
        // (e.g. transient error), automatically retry once against Ollama.
        if (!response.IsSuccess && provider.ProviderType == AIProviderType.AzureOpenAI)
        {
            _logger.LogWarning(
                "Azure OpenAI request failed ({Error}). Falling back to Ollama.",
                response.ErrorMessage);

            var fallbackProvider = _providerFactory.GetProvider(AIProviderType.Ollama);
            response = await fallbackProvider.GenerateAsync(request).ConfigureAwait(false);
        }

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
}
