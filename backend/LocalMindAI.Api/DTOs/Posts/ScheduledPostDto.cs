namespace LocalMindAI.Api.DTOs.Posts;

public sealed class ScheduledPostDto
{
    public int Id { get; init; }
    public int BusinessId { get; init; }
    public int GoogleBusinessPostId { get; init; }
    public string PostTitle { get; init; } = string.Empty;
    public DateTime ScheduledTime { get; init; }
    public string Status { get; init; } = string.Empty;
    public int RetryCount { get; init; }
    public DateTime? LastAttempt { get; init; }
    public DateTime? PublishedTime { get; init; }
    public string ErrorMessage { get; init; } = string.Empty;
    public string PublishedBy { get; init; } = "DIGITECH Publisher";
    public DateTime CreatedAt { get; init; }
}
