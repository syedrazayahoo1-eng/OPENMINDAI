using System.ComponentModel.DataAnnotations;

namespace LocalMindAI.Api.DTOs;

public sealed class IntegrationDto { public string Provider { get; init; } = string.Empty; public Dictionary<string, string> Settings { get; init; } = []; public string Status { get; init; } = "Disconnected"; public string? LastTestMessage { get; init; } public DateTime? LastTestedAt { get; init; } }
public sealed class SaveIntegrationDto { [Required] public Dictionary<string, string> Settings { get; init; } = []; }
public sealed class IntegrationTestDto { public bool Succeeded { get; init; } public string Message { get; init; } = string.Empty; public DateTime TestedAt { get; init; } }
