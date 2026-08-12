namespace LocalMindAI.Api.Models;

public class GoogleBusinessPost
{
    public int Id { get; set; }
    public int BusinessId { get; set; }
    public string PostType { get; set; } = string.Empty;
    public string Prompt { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Caption { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string CTA { get; set; } = string.Empty;
    public string Hashtags { get; set; } = string.Empty;
    public string Status { get; set; } = "Draft";
    public DateTime? ScheduledTime { get; set; }
    public DateTime? PublishedTime { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
