using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using LocalMindAI.Api.Data;
using LocalMindAI.Api.DTOs;
using LocalMindAI.Api.Models;
using LocalMindAI.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LocalMindAI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IAuthTokenService _tokenService;

    public AuthController(ApplicationDbContext context, IAuthTokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request, CancellationToken cancellationToken)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        if (await _context.Users.AnyAsync(user => user.Email == email, cancellationToken))
            return Conflict(new { message = "An account with this email already exists." });

        var user = new User
        {
            FullName = request.FullName.Trim(),
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            CompanyName = request.CompanyName.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);
        return Ok(new { message = "User registered successfully!" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request, CancellationToken cancellationToken)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var user = await _context.Users.SingleOrDefaultAsync(item => item.Email == email, cancellationToken);
        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return Unauthorized(new { message = "Invalid email or password." });

        var tokens = await _tokenService.IssueAsync(user, request.RememberMe, GetClientIpAddress(), cancellationToken);
        return Ok(new
        {
            message = "Login successful!",
            accessToken = tokens.AccessToken,
            token = tokens.Token,
            refreshToken = tokens.RefreshToken,
            accessTokenExpiresAt = tokens.AccessTokenExpiresAt,
            refreshTokenExpiresAt = tokens.RefreshTokenExpiresAt,
            user = new { fullName = user.FullName, email = user.Email, companyName = user.CompanyName }
        });
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh(RefreshTokenRequest request, CancellationToken cancellationToken)
    {
        var tokens = await _tokenService.RotateAsync(request.RefreshToken, GetClientIpAddress(), cancellationToken);
        if (tokens is null)
            return Unauthorized(new { message = "The refresh token is invalid, expired, or has been revoked." });

        return Ok(new
        {
            accessToken = tokens.AccessToken,
            token = tokens.Token,
            refreshToken = tokens.RefreshToken,
            accessTokenExpiresAt = tokens.AccessTokenExpiresAt,
            refreshTokenExpiresAt = tokens.RefreshTokenExpiresAt
        });
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout(RefreshTokenRequest request, CancellationToken cancellationToken)
    {
        await _tokenService.RevokeAsync(request.RefreshToken, GetClientIpAddress(), cancellationToken);
        return NoContent();
    }

    [Authorize]
    [HttpPost("revoke")]
    public async Task<IActionResult> RevokeAllDevices(CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        if (!int.TryParse(userIdValue, out var userId))
            return Unauthorized();

        var revoked = await _tokenService.RevokeAllAsync(userId, GetClientIpAddress(), cancellationToken);
        return Ok(new { message = "All signed-in devices have been revoked.", revoked });
    }

    [Authorize]
    [HttpGet("profile")]
    public IActionResult Profile()
    {
        return Ok(new
        {
            message = "You are authenticated!",
            email = User.FindFirstValue(JwtRegisteredClaimNames.Email),
            fullName = User.FindFirstValue("FullName")
        });
    }

    private string? GetClientIpAddress() => HttpContext.Connection.RemoteIpAddress?.ToString();
}
