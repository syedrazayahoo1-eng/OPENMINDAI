using System.ComponentModel.DataAnnotations;

namespace LocalMindAI.Api.Models;

public class ChatMessage
{
    public int Id { get; set; }

    [Required]
    public string UserEmail { get; set; } = string.Empty;

    [Required]
    public string UserMessage { get; set; } = string.Empty;

    [Required]
    public string AiResponse { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}