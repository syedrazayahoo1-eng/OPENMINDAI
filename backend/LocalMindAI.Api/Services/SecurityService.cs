using System.Security.Cryptography;
using System.Text;
using LocalMindAI.Api.Data;
using LocalMindAI.Api.DTOs;
using LocalMindAI.Api.Models;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;

namespace LocalMindAI.Api.Services;

public sealed class SecurityService(ApplicationDbContext context, IDataProtectionProvider dataProtectionProvider) : ISecurityService
{
    private readonly IDataProtector _mfaProtector = dataProtectionProvider.CreateProtector("DIGITECH.Security.Mfa.v1");

    public async Task<SecurityProfileDto?> GetProfileAsync(int userId, CancellationToken cancellationToken = default)
    {
        var user = await context.Users.AsNoTracking().SingleOrDefaultAsync(item => item.Id == userId, cancellationToken);
        if (user is null) return null;
        var mfaEnabled = await context.MfaCredentials.AsNoTracking().AnyAsync(item => item.UserId == userId && item.IsEnabled, cancellationToken);
        return new SecurityProfileDto { FullName = user.FullName, Email = user.Email, CompanyName = user.CompanyName, MfaEnabled = mfaEnabled };
    }

    public async Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto input, string? ipAddress, CancellationToken cancellationToken = default)
    {
        var user = await context.Users.SingleOrDefaultAsync(item => item.Id == userId, cancellationToken);
        if (user is null || !BCrypt.Net.BCrypt.Verify(input.CurrentPassword, user.PasswordHash)) return false;
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(input.NewPassword);
        await RevokeTokensAsync(userId, null, ipAddress, cancellationToken);
        await AddAuditAsync(userId, "Security.PasswordChanged", "User", userId.ToString(), ipAddress, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<IReadOnlyList<SecuritySessionDto>> GetSessionsAsync(int userId, string? currentToken, CancellationToken cancellationToken = default)
    {
        var currentHash = string.IsNullOrWhiteSpace(currentToken) ? null : Hash(currentToken);
        return await context.RefreshTokens.AsNoTracking().Where(token => token.UserId == userId && token.RevokedAt == null && token.ExpiresAt > DateTime.UtcNow).OrderByDescending(token => token.CreatedAt)
            .Select(token => new SecuritySessionDto { Id = token.Id, Browser = string.IsNullOrWhiteSpace(token.UserAgent) ? "Browser session" : token.UserAgent, IpAddress = token.CreatedByIp, CreatedAt = token.CreatedAt, ExpiresAt = token.ExpiresAt, IsCurrent = currentHash != null && token.TokenHash == currentHash }).ToListAsync(cancellationToken);
    }

    public async Task<bool> RevokeSessionAsync(int userId, int sessionId, string? ipAddress, CancellationToken cancellationToken = default)
    {
        var session = await context.RefreshTokens.SingleOrDefaultAsync(token => token.Id == sessionId && token.UserId == userId, cancellationToken);
        if (session is null || session.RevokedAt is not null) return false;
        session.RevokedAt = DateTime.UtcNow;
        session.RevokedByIp = ipAddress;
        await AddAuditAsync(userId, "Security.SessionRevoked", "RefreshToken", sessionId.ToString(), ipAddress, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<int> RevokeAllSessionsAsync(int userId, string? currentToken, string? ipAddress, CancellationToken cancellationToken = default)
    {
        var count = await RevokeTokensAsync(userId, currentToken, ipAddress, cancellationToken);
        await AddAuditAsync(userId, "Security.OtherSessionsRevoked", "RefreshToken", null, ipAddress, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        return count;
    }

    public async Task<IReadOnlyList<LoginHistoryDto>> GetLoginHistoryAsync(int userId, CancellationToken cancellationToken = default) =>
        await context.LoginHistories.AsNoTracking().Where(item => item.UserId == userId).OrderByDescending(item => item.CreatedAt).Take(100)
            .Select(item => new LoginHistoryDto { Id = item.Id, Browser = string.IsNullOrWhiteSpace(item.UserAgent) ? "Unknown browser" : item.UserAgent, IpAddress = item.IpAddress, Succeeded = item.Succeeded, FailureReason = item.FailureReason, CreatedAt = item.CreatedAt }).ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<ApiKeyDto>> GetApiKeysAsync(int userId, CancellationToken cancellationToken = default)
    {
        var keys = await context.ApiKeys.AsNoTracking().Where(item => item.UserId == userId).OrderByDescending(item => item.CreatedAt).ToListAsync(cancellationToken);
        return keys.Select(MapKey).ToList();
    }

    public async Task<CreatedApiKeyDto> CreateApiKeyAsync(int userId, CreateApiKeyDto input, string? ipAddress, CancellationToken cancellationToken = default)
    {
        if (input.ExpiresAt.HasValue && input.ExpiresAt <= DateTime.UtcNow) throw new InvalidOperationException("The API key expiry must be in the future.");
        var secret = $"dgt_{Convert.ToHexString(RandomNumberGenerator.GetBytes(32)).ToLowerInvariant()}";
        var key = new ApiKey { UserId = userId, Name = input.Name.Trim(), KeyHash = Hash(secret), KeyPrefix = secret[..12], ExpiresAt = input.ExpiresAt };
        context.ApiKeys.Add(key);
        await AddAuditAsync(userId, "Security.ApiKeyCreated", "ApiKey", key.Id.ToString(), ipAddress, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        return new CreatedApiKeyDto { ApiKey = MapKey(key), Secret = secret };
    }

    public async Task<bool> RevokeApiKeyAsync(int userId, int keyId, string? ipAddress, CancellationToken cancellationToken = default)
    {
        var key = await context.ApiKeys.SingleOrDefaultAsync(item => item.Id == keyId && item.UserId == userId, cancellationToken);
        if (key is null || key.RevokedAt is not null) return false;
        key.RevokedAt = DateTime.UtcNow;
        await AddAuditAsync(userId, "Security.ApiKeyRevoked", "ApiKey", keyId.ToString(), ipAddress, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<MfaStatusDto> GetMfaAsync(int userId, CancellationToken cancellationToken = default)
    {
        var credential = await context.MfaCredentials.AsNoTracking().SingleOrDefaultAsync(item => item.UserId == userId, cancellationToken);
        return new MfaStatusDto { IsEnabled = credential?.IsEnabled == true, EnabledAt = credential?.IsEnabled == true ? credential.CreatedAt : null };
    }

    public async Task<EnabledMfaDto> EnableMfaAsync(int userId, string email, string? ipAddress, CancellationToken cancellationToken = default)
    {
        var secret = Base32(RandomNumberGenerator.GetBytes(20));
        var credential = await context.MfaCredentials.SingleOrDefaultAsync(item => item.UserId == userId, cancellationToken);
        if (credential is null) { credential = new MfaCredential { UserId = userId }; context.MfaCredentials.Add(credential); }
        credential.EncryptedSecret = _mfaProtector.Protect(secret);
        credential.IsEnabled = true;
        credential.DisabledAt = null;
        credential.CreatedAt = DateTime.UtcNow;
        await AddAuditAsync(userId, "Security.MfaEnabled", "MfaCredential", credential.Id.ToString(), ipAddress, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        return new EnabledMfaDto { IsEnabled = true, EnabledAt = credential.CreatedAt, Secret = secret, ProvisioningUri = $"otpauth://totp/DIGITECH:{Uri.EscapeDataString(email)}?secret={secret}&issuer=DIGITECH" };
    }

    public async Task DisableMfaAsync(int userId, string? ipAddress, CancellationToken cancellationToken = default)
    {
        var credential = await context.MfaCredentials.SingleOrDefaultAsync(item => item.UserId == userId, cancellationToken);
        if (credential is null) return;
        credential.IsEnabled = false;
        credential.EncryptedSecret = string.Empty;
        credential.DisabledAt = DateTime.UtcNow;
        await AddAuditAsync(userId, "Security.MfaDisabled", "MfaCredential", credential.Id.ToString(), ipAddress, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task<PagedResultDto<AuditLogDto>> GetAuditLogsAsync(int userId, AuditLogQueryDto query, CancellationToken cancellationToken = default)
    {
        var logs = context.AuditLogs.AsNoTracking().Where(item => item.UserId == userId);
        if (!string.IsNullOrWhiteSpace(query.Search)) { var search = query.Search.Trim(); logs = logs.Where(item => item.Action.Contains(search) || (item.EntityType != null && item.EntityType.Contains(search))); }
        if (!string.IsNullOrWhiteSpace(query.Action)) logs = logs.Where(item => item.Action == query.Action);
        var total = await logs.CountAsync(cancellationToken);
        var items = await logs.OrderByDescending(item => item.CreatedAt).Skip((query.Page - 1) * query.PageSize).Take(query.PageSize).Select(item => new AuditLogDto { Id = item.Id, Action = item.Action, EntityType = item.EntityType, EntityId = item.EntityId, IpAddress = item.IpAddress, CreatedAt = item.CreatedAt }).ToListAsync(cancellationToken);
        return new PagedResultDto<AuditLogDto> { Items = items, Page = query.Page, PageSize = query.PageSize, TotalCount = total };
    }

    public async Task RecordLoginAsync(int? userId, string email, bool succeeded, string? failureReason, string? ipAddress, string? userAgent, CancellationToken cancellationToken = default)
    {
        context.LoginHistories.Add(new LoginHistory { UserId = userId, Email = email, Succeeded = succeeded, FailureReason = failureReason, IpAddress = ipAddress, UserAgent = userAgent });
        if (userId.HasValue) await AddAuditAsync(userId.Value, succeeded ? "Security.LoginSucceeded" : "Security.LoginFailed", "User", userId.Value.ToString(), ipAddress, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
    }

    private async Task<int> RevokeTokensAsync(int userId, string? exceptRawToken, string? ipAddress, CancellationToken cancellationToken)
    {
        var exceptHash = string.IsNullOrWhiteSpace(exceptRawToken) ? null : Hash(exceptRawToken);
        var tokens = await context.RefreshTokens.Where(token => token.UserId == userId && token.RevokedAt == null && token.TokenHash != exceptHash).ToListAsync(cancellationToken);
        foreach (var token in tokens) { token.RevokedAt = DateTime.UtcNow; token.RevokedByIp = ipAddress; }
        return tokens.Count;
    }
    private Task AddAuditAsync(int userId, string action, string? entityType, string? entityId, string? ipAddress, CancellationToken cancellationToken) { context.AuditLogs.Add(new AuditLog { UserId = userId, Action = action, EntityType = entityType, EntityId = entityId, IpAddress = ipAddress }); return Task.CompletedTask; }
    private static ApiKeyDto MapKey(ApiKey item) => new() { Id = item.Id, Name = item.Name, Prefix = item.KeyPrefix, CreatedAt = item.CreatedAt, ExpiresAt = item.ExpiresAt, RevokedAt = item.RevokedAt };
    private static string Hash(string value) => Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(value)));
    private static string Base32(byte[] bytes) { const string alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"; var builder = new StringBuilder(); var buffer = 0; var bits = 0; foreach (var item in bytes) { buffer = (buffer << 8) | item; bits += 8; while (bits >= 5) { builder.Append(alphabet[(buffer >> (bits - 5)) & 31]); bits -= 5; } } if (bits > 0) builder.Append(alphabet[(buffer << (5 - bits)) & 31]); return builder.ToString(); }
}
