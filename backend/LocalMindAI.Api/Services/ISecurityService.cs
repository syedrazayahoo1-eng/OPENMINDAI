using LocalMindAI.Api.DTOs;

namespace LocalMindAI.Api.Services;

public interface ISecurityService
{
    Task<SecurityProfileDto?> GetProfileAsync(int userId, CancellationToken cancellationToken = default);
    Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto input, string? ipAddress, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<SecuritySessionDto>> GetSessionsAsync(int userId, string? currentToken, CancellationToken cancellationToken = default);
    Task<bool> RevokeSessionAsync(int userId, int sessionId, string? ipAddress, CancellationToken cancellationToken = default);
    Task<int> RevokeAllSessionsAsync(int userId, string? currentToken, string? ipAddress, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<LoginHistoryDto>> GetLoginHistoryAsync(int userId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<ApiKeyDto>> GetApiKeysAsync(int userId, CancellationToken cancellationToken = default);
    Task<CreatedApiKeyDto> CreateApiKeyAsync(int userId, CreateApiKeyDto input, string? ipAddress, CancellationToken cancellationToken = default);
    Task<bool> RevokeApiKeyAsync(int userId, int keyId, string? ipAddress, CancellationToken cancellationToken = default);
    Task<MfaStatusDto> GetMfaAsync(int userId, CancellationToken cancellationToken = default);
    Task<EnabledMfaDto> EnableMfaAsync(int userId, string email, string? ipAddress, CancellationToken cancellationToken = default);
    Task DisableMfaAsync(int userId, string? ipAddress, CancellationToken cancellationToken = default);
    Task<PagedResultDto<AuditLogDto>> GetAuditLogsAsync(int userId, AuditLogQueryDto query, CancellationToken cancellationToken = default);
    Task RecordLoginAsync(int? userId, string email, bool succeeded, string? failureReason, string? ipAddress, string? userAgent, CancellationToken cancellationToken = default);
}
