namespace LocalMindAI.Api.Services.AI;

/// <summary>
/// Enumerates the AI providers supported by the gateway. Used by configuration and
/// by <see cref="IAIProviderFactory"/> to select an implementation at runtime.
/// </summary>
public enum AIProviderType
{
    AzureOpenAI,
    Ollama
}

/// <summary>
/// Common contract implemented by every AI backend the gateway can talk to
/// (Azure OpenAI, Ollama, and any future provider). Callers depend only on this
/// interface so the underlying provider can be swapped via configuration without
/// any change to consuming code.
/// </summary>
public interface IAIProvider
{
    /// <summary>
    /// The provider type this implementation serves.
    /// </summary>
    AIProviderType ProviderType { get; }

    /// <summary>
    /// A short, human-readable name for logging/telemetry (e.g. "AzureOpenAI").
    /// </summary>
    string ProviderName { get; }

    /// <summary>
    /// Generates a completion for the given request.
    /// </summary>
    /// <param name="request">The provider-agnostic request payload.</param>
    /// <param name="cancellationToken">Token used to cancel the outbound call.</param>
    /// <returns>
    /// An <see cref="AIResponse"/> describing the outcome. Implementations should
    /// never throw for expected failure modes (network errors, non-success HTTP
    /// status codes, malformed provider payloads) — those are surfaced via
    /// <see cref="AIResponse.IsSuccess"/> and <see cref="AIResponse.ErrorMessage"/> instead.
    /// </returns>
    Task<AIResponse> GenerateAsync(AIRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Performs a lightweight health/reachability check against the provider
    /// (e.g. verifying configuration is present and the endpoint responds),
    /// without consuming a full completion request.
    /// </summary>
    Task<bool> IsAvailableAsync(CancellationToken cancellationToken = default);
}
