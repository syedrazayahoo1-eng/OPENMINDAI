using LocalMindAI.Api.DTOs;
using LocalMindAI.Api.Models;

namespace LocalMindAI.Api.Services;

public interface IAuthTokenService
{
    Task<AuthTokenResponse> IssueAsync(User user, bool rememberMe, string? ipAddress, string? userAgent, CancellationToken cancellationToken = default);
    Task<AuthTokenResponse?> RotateAsync(string refreshToken, string? ipAddress, CancellationToken cancellationToken = default);
    Task RevokeAsync(string refreshToken, string? ipAddress, CancellationToken cancellationToken = default);
    Task<int> RevokeAllAsync(int userId, string? ipAddress, CancellationToken cancellationToken = default);
}
