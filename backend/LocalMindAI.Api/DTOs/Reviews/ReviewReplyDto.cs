namespace LocalMindAI.Api.DTOs.Reviews;

public sealed class GenerateReviewReplyRequest
{
    public string Mode { get; init; } = "Professional";
    public string? CustomPrompt { get; init; }
}

public sealed class SaveReviewReplyDraftRequest
{
    public string EditedReply { get; init; } = string.Empty;
}

public sealed class ReviewReplyDto
{
    public int Id { get; init; }
    public int ReviewId { get; init; }
    public string Mode { get; init; } = string.Empty;
    public string Prompt { get; init; } = string.Empty;
    public string GeneratedReply { get; init; } = string.Empty;
    public string EditedReply { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
}
