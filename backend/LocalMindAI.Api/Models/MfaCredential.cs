namespace LocalMindAI.Api.Models;

public sealed class MfaCredential
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string EncryptedSecret { get; set; } = string.Empty;
    public bool IsEnabled { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? DisabledAt { get; set; }
    public User User { get; set; } = null!;
}
