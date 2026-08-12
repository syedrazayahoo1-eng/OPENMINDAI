namespace LocalMindAI.Api.Models;

public sealed class LoginHistory
{
    public int Id { get; set; }
    public int? UserId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public bool Succeeded { get; set; }
    public string? FailureReason { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public User? User { get; set; }
}
