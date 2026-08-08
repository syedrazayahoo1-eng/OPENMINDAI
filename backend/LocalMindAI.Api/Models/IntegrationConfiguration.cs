namespace LocalMindAI.Api.Models;

public sealed class IntegrationConfiguration
{
    public int Id { get; set; }
    public string Provider { get; set; } = string.Empty;
    public string EncryptedConfiguration { get; set; } = string.Empty;
    public string PublicConfiguration { get; set; } = "{}";
    public string Status { get; set; } = "Disconnected";
    public string? LastTestMessage { get; set; }
    public DateTime? LastTestedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
