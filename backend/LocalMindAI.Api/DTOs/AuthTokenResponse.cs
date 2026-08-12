namespace LocalMindAI.Api.DTOs;

public class AuthTokenResponse
{
    public string AccessToken { get; init; } = string.Empty;
    public string Token => AccessToken;
    public string RefreshToken { get; init; } = string.Empty;
    public DateTime AccessTokenExpiresAt { get; init; }
    public DateTime RefreshTokenExpiresAt { get; init; }
}
