namespace LocalMindAI.Api.Models;

public class Agent
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Initials { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Status { get; set; } = "Running";
    public string CurrentTask { get; set; } = string.Empty;
    public int Performance { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime LastActiveAt { get; set; } = DateTime.UtcNow;
    public string Models { get; set; } = string.Empty;
    public string Tone { get; set; } = "blue";
    public decimal Temperature { get; set; } = 0.7m;
    public int MaxTokens { get; set; } = 2048;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
