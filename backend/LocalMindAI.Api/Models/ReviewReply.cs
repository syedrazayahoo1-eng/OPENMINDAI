namespace LocalMindAI.Api.Models;

public class ReviewReply
{
    public int Id { get; set; }
    public int ReviewId { get; set; }
    public string Mode { get; set; } = string.Empty;
    public string Prompt { get; set; } = string.Empty;
    public string GeneratedReply { get; set; } = string.Empty;
    public string EditedReply { get; set; } = string.Empty;
    public string Status { get; set; } = "Generated";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public Review? Review { get; set; }
}
