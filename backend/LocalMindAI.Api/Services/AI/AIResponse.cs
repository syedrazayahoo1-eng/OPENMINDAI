namespace LocalMindAI.Api.Services.AI;

/// <summary>
/// Provider-agnostic response contract returned by every <see cref="IAIProvider"/>.
/// Encapsulates both the successful result and failure information so that callers
/// never need to catch provider-specific exceptions in normal control flow.
/// </summary>
public sealed class AIResponse
{
    /// <summary>
    /// True when the underlying provider returned a usable completion.
    /// </summary>
    public required bool IsSuccess { get; init; }

    /// <summary>
    /// The generated text. Empty when <see cref="IsSuccess"/> is false.
    /// </summary>
    public string Content { get; init; } = string.Empty;

    /// <summary>
    /// The logical provider name that produced this response (e.g. "AzureOpenAI", "Ollama").
    /// </summary>
    public required string ProviderName { get; init; }

    /// <summary>
    /// The concrete model or deployment name that served the request, when known.
    /// </summary>
    public string? Model { get; init; }

    /// <summary>
    /// Number of tokens consumed by the prompt, when the provider reports usage.
    /// </summary>
    public int? PromptTokens { get; init; }

    /// <summary>
    /// Number of tokens generated in the completion, when the provider reports usage.
    /// </summary>
    public int? CompletionTokens { get; init; }

    /// <summary>
    /// Total tokens (prompt + completion), when the provider reports usage.
    /// </summary>
    public int? TotalTokens { get; init; }

    /// <summary>
    /// Wall-clock time, in milliseconds, spent waiting on the provider call.
    /// </summary>
    public long DurationMs { get; init; }

    /// <summary>
    /// Human-readable error detail. Populated only when <see cref="IsSuccess"/> is false.
    /// </summary>
    public string? ErrorMessage { get; init; }

    /// <summary>
    /// Builds a successful response.
    /// </summary>
    public static AIResponse Success(
        string providerName,
        string content,
        string? model = null,
        int? promptTokens = null,
        int? completionTokens = null,
        int? totalTokens = null,
        long durationMs = 0)
    {
        return new AIResponse
        {
            IsSuccess = true,
            ProviderName = providerName,
            Content = content,
            Model = model,
            PromptTokens = promptTokens,
            CompletionTokens = completionTokens,
            TotalTokens = totalTokens,
            DurationMs = durationMs
        };
    }

    /// <summary>
    /// Builds a failed response.
    /// </summary>
    public static AIResponse Failure(
        string providerName,
        string errorMessage,
        long durationMs = 0)
    {
        return new AIResponse
        {
            IsSuccess = false,
            ProviderName = providerName,
            ErrorMessage = errorMessage,
            DurationMs = durationMs
        };
    }
}
