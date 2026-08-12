using System.ComponentModel.DataAnnotations;

namespace LocalMindAI.Api.DTOs.Agents;

public class CreateAgentDto
{
    [Required, StringLength(120)] public string Name { get; set; } = string.Empty;
    [Required, StringLength(80)] public string Department { get; set; } = string.Empty;
    [Required, StringLength(250)] public string Models { get; set; } = string.Empty;
    [Required, StringLength(2000)] public string Description { get; set; } = string.Empty;
    [Range(0, 1)] public decimal Temperature { get; set; } = 0.3m;
    [Range(1, 128000)] public int MaxTokens { get; set; } = 2048;
}
