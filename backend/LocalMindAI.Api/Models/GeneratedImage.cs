namespace LocalMindAI.Api.Models;

public class GeneratedImage
{
    public int Id { get; set; }
    public int BusinessId { get; set; }
    public string Prompt { get; set; } = string.Empty;
    public string Style { get; set; } = string.Empty;
    public string AspectRatio { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;
    public string Status { get; set; } = "Generated";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
