namespace LocalMindAI.Api.Models;

public class ScheduledPost
{
    public int Id { get; set; }
    public int BusinessId { get; set; }
    public int GoogleBusinessPostId { get; set; }
    public DateTime ScheduledTime { get; set; }
    public string Status { get; set; } = "Scheduled";
    public int RetryCount { get; set; }
    public DateTime? LastAttempt { get; set; }
    public DateTime? PublishedTime { get; set; }
    public string ErrorMessage { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public GoogleBusinessPost? GoogleBusinessPost { get; set; }
}
