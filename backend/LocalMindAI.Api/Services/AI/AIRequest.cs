namespace LocalMindAI.Api.Services.AI;

/// <summary>
/// Represents a single message in a conversation history, following the
/// standard chat-completion role model ("system", "user", "assistant").
/// </summary>
public sealed class AIChatMessage
{
    /// <summary>
    /// The role of the message author. Expected values: "system", "user", "assistant".
    /// </summary>
    public required string Role { get; init; }

    /// <summary>
    /// The textual content of the message.
    /// </summary>
    public required string Content { get; init; }
}

/// <summary>
/// Provider-agnostic request contract for the AI gateway. Any <see cref="IAIProvider"/>
/// implementation must be able to fulfil a request expressed purely in these terms,
/// without the caller knowing which underlying provider (Azure OpenAI, Ollama, etc.)
/// will service it.
/// </summary>
public sealed class AIRequest
{
    /// <summary>
    /// The primary user prompt. Required for every request.
    /// </summary>
    public required string Prompt { get; init; }

    /// <summary>
    /// Optional system-level instruction that sets the behavior/persona of the model.
    /// </summary>
    public string? SystemPrompt { get; init; }

    /// <summary>
    /// Optional prior conversation turns to give the model context. Providers append
    /// <see cref="Prompt"/> as the final "user" turn after this history.
    /// </summary>
    public IReadOnlyList<AIChatMessage>? History { get; init; }

    /// <summary>
    /// Optional model/deployment override. When null, the provider falls back to the
    /// default model configured in appsettings for that provider.
    /// </summary>
    public string? Model { get; init; }

    /// <summary>
    /// Sampling temperature. Higher values produce more varied output.
    /// </summary>
    public double Temperature { get; init; } = 0.7;

    /// <summary>
    /// Maximum number of tokens the model may generate in its response.
    /// </summary>
    public int MaxTokens { get; init; } = 1024;

    /// <summary>
    /// Optional nucleus sampling parameter (top-p). When null, provider defaults apply.
    /// </summary>
    public double? TopP { get; init; }

    /// <summary>
    /// Arbitrary correlation identifier supplied by the caller (e.g. a request or
    /// conversation id) that providers should include in logs for traceability.
    /// </summary>
    public string? CorrelationId { get; init; }
}
