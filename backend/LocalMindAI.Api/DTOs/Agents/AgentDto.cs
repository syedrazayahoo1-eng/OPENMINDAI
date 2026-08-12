namespace LocalMindAI.Api.DTOs.Agents;

public class AgentDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Initials { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string CurrentTask { get; set; } = string.Empty;
    public int Performance { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime LastActiveAt { get; set; }
    public string Models { get; set; } = string.Empty;
    public string Tone { get; set; } = string.Empty;
    public decimal Temperature { get; set; }
    public int MaxTokens { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
