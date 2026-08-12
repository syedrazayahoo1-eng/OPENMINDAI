using System.ComponentModel.DataAnnotations;

namespace LocalMindAI.Api.DTOs;

public sealed class SecurityProfileDto { public string FullName { get; init; } = string.Empty; public string Email { get; init; } = string.Empty; public string CompanyName { get; init; } = string.Empty; public bool MfaEnabled { get; init; } }
public sealed class ChangePasswordDto { [Required, StringLength(128)] public string CurrentPassword { get; init; } = string.Empty; [Required, StringLength(128, MinimumLength = 12)] public string NewPassword { get; init; } = string.Empty; }
public sealed class SecuritySessionDto { public int Id { get; init; } public string Browser { get; init; } = string.Empty; public string? IpAddress { get; init; } public DateTime CreatedAt { get; init; } public DateTime ExpiresAt { get; init; } public bool IsCurrent { get; init; } }
public sealed class LoginHistoryDto { public int Id { get; init; } public string Browser { get; init; } = string.Empty; public string? IpAddress { get; init; } public bool Succeeded { get; init; } public string? FailureReason { get; init; } public DateTime CreatedAt { get; init; } }
public sealed class ApiKeyDto { public int Id { get; init; } public string Name { get; init; } = string.Empty; public string Prefix { get; init; } = string.Empty; public DateTime CreatedAt { get; init; } public DateTime? ExpiresAt { get; init; } public DateTime? RevokedAt { get; init; } }
public sealed class CreateApiKeyDto { [Required, StringLength(100, MinimumLength = 2)] public string Name { get; init; } = string.Empty; public DateTime? ExpiresAt { get; init; } }
public sealed class CreatedApiKeyDto { public required ApiKeyDto ApiKey { get; init; } public string Secret { get; init; } = string.Empty; }
public class MfaStatusDto { public bool IsEnabled { get; init; } public DateTime? EnabledAt { get; init; } }
public sealed class EnabledMfaDto : MfaStatusDto { public string Secret { get; init; } = string.Empty; public string ProvisioningUri { get; init; } = string.Empty; }
public sealed class AuditLogQueryDto { [StringLength(100)] public string? Search { get; init; } [StringLength(100)] public string? Action { get; init; } [Range(1, int.MaxValue)] public int Page { get; init; } = 1; [Range(1, 100)] public int PageSize { get; init; } = 25; }
public sealed class AuditLogDto { public int Id { get; init; } public string Action { get; init; } = string.Empty; public string? EntityType { get; init; } public string? EntityId { get; init; } public string? IpAddress { get; init; } public DateTime CreatedAt { get; init; } }
