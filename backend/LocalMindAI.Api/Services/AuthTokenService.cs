using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using LocalMindAI.Api.Data;
using LocalMindAI.Api.DTOs;
using LocalMindAI.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace LocalMindAI.Api.Services;

public class AuthTokenService : IAuthTokenService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthTokenService> _logger;

    public AuthTokenService(ApplicationDbContext context, IConfiguration configuration, ILogger<AuthTokenService> logger)
    {
        _context = context;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<AuthTokenResponse> IssueAsync(User user, bool rememberMe, string? ipAddress, CancellationToken cancellationToken = default)
    {
        var rawRefreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
        var refreshToken = new RefreshToken
        {
            UserId = user.Id,
            TokenHash = Hash(rawRefreshToken),
            CreatedByIp = ipAddress,
            RememberMe = rememberMe,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddDays(GetRefreshTokenLifetimeDays(rememberMe))
        };

        _context.RefreshTokens.Add(refreshToken);
        await _context.SaveChangesAsync(cancellationToken);

        return CreateResponse(user, rawRefreshToken, refreshToken.ExpiresAt);
    }

    public async Task<AuthTokenResponse?> RotateAsync(string rawRefreshToken, string? ipAddress, CancellationToken cancellationToken = default)
    {
        var tokenHash = Hash(rawRefreshToken);
        var storedToken = await _context.RefreshTokens
            .Include(token => token.User)
            .SingleOrDefaultAsync(token => token.TokenHash == tokenHash, cancellationToken);

        if (storedToken is null)
            return null;

        if (!storedToken.IsActive)
        {
            if (storedToken.ReplacedByTokenHash is not null)
            {
                await RevokeAllAsync(storedToken.UserId, ipAddress, cancellationToken);
                _logger.LogWarning("Refresh token reuse was detected for user {UserId}; all sessions were revoked.", storedToken.UserId);
            }

            return null;
        }

        var nextRawRefreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
        var nextHash = Hash(nextRawRefreshToken);
        var now = DateTime.UtcNow;
        var nextToken = new RefreshToken
        {
            UserId = storedToken.UserId,
            TokenHash = nextHash,
            CreatedByIp = ipAddress,
            RememberMe = storedToken.RememberMe,
            CreatedAt = now,
            ExpiresAt = now.AddDays(GetRefreshTokenLifetimeDays(storedToken.RememberMe))
        };

        storedToken.RevokedAt = now;
        storedToken.RevokedByIp = ipAddress;
        storedToken.ReplacedByTokenHash = nextHash;
        _context.RefreshTokens.Add(nextToken);
        await _context.SaveChangesAsync(cancellationToken);

        return CreateResponse(storedToken.User, nextRawRefreshToken, nextToken.ExpiresAt);
    }

    public async Task RevokeAsync(string rawRefreshToken, string? ipAddress, CancellationToken cancellationToken = default)
    {
        var tokenHash = Hash(rawRefreshToken);
        var storedToken = await _context.RefreshTokens
            .SingleOrDefaultAsync(token => token.TokenHash == tokenHash, cancellationToken);

        if (storedToken is null || storedToken.RevokedAt is not null)
            return;

        storedToken.RevokedAt = DateTime.UtcNow;
        storedToken.RevokedByIp = ipAddress;
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<int> RevokeAllAsync(int userId, string? ipAddress, CancellationToken cancellationToken = default)
    {
        var activeTokens = await _context.RefreshTokens
            .Where(token => token.UserId == userId && token.RevokedAt == null && token.ExpiresAt > DateTime.UtcNow)
            .ToListAsync(cancellationToken);

        foreach (var token in activeTokens)
        {
            token.RevokedAt = DateTime.UtcNow;
            token.RevokedByIp = ipAddress;
        }

        if (activeTokens.Count > 0)
            await _context.SaveChangesAsync(cancellationToken);

        return activeTokens.Count;
    }

    private AuthTokenResponse CreateResponse(User user, string rawRefreshToken, DateTime refreshTokenExpiresAt)
    {
        var now = DateTime.UtcNow;
        var accessTokenExpiresAt = now.AddMinutes(GetAccessTokenLifetimeMinutes());
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim("FullName", user.FullName)
        };
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            notBefore: now,
            expires: accessTokenExpiresAt,
            signingCredentials: credentials);

        return new AuthTokenResponse
        {
            AccessToken = new JwtSecurityTokenHandler().WriteToken(token),
            RefreshToken = rawRefreshToken,
            AccessTokenExpiresAt = accessTokenExpiresAt,
            RefreshTokenExpiresAt = refreshTokenExpiresAt
        };
    }

    private int GetAccessTokenLifetimeMinutes() => Math.Clamp(_configuration.GetValue("Jwt:ExpiryInMinutes", 15), 1, 60);

    private int GetRefreshTokenLifetimeDays(bool rememberMe) => Math.Clamp(
        _configuration.GetValue(rememberMe ? "Jwt:RememberMeRefreshTokenExpiryDays" : "Jwt:RefreshTokenExpiryDays", rememberMe ? 30 : 1),
        1,
        90);

    private static string Hash(string value) => Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(value)));
}
