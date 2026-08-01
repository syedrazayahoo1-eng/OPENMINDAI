namespace LocalMindAI.Api.DTOs.Reviews;

/// <summary>
/// Result of AI-assisted review analysis and reply generation.
/// <see cref="GeneratedReply"/> is preserved from the original contract so existing
/// callers that only read that field keep working unchanged. The additional fields
/// are purely additive.
/// </summary>
public class GenerateReplyResponse
{
    /// <summary>The AI-generated, ready-to-send reply text. (Existing field — unchanged.)</summary>
    public string GeneratedReply { get; set; } = string.Empty;

    /// <summary>One of: Positive, Neutral, Negative, Very Negative.</summary>
    public string Sentiment { get; set; } = string.Empty;

    /// <summary>One of: Low, Medium, High, Critical.</summary>
    public string Priority { get; set; } = string.Empty;

    /// <summary>One of: Professional, Friendly, Apologetic, Marketing, Support.</summary>
    public string SuggestedTone { get; set; } = string.Empty;

    /// <summary>Short, human-readable explanation of why the review was scored this way.</summary>
    public string Explanation { get; set; } = string.Empty;
}
