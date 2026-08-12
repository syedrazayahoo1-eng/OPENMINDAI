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
    private readonly ISecurityService _securityService;
    private readonly IWebHostEnvironment _environment;

    public AuthController(ApplicationDbContext context, IAuthTokenService tokenService, ISecurityService securityService, IWebHostEnvironment environment)
    {
        _context = context;
        _tokenService = tokenService;
        _securityService = securityService;
        _environment = environment;
    }

    [AllowAnonymous]
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

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request, CancellationToken cancellationToken)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var user = await _context.Users.SingleOrDefaultAsync(item => item.Email == email, cancellationToken);
        if (user is null || !user.IsActive || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            await _securityService.RecordLoginAsync(user?.Id, email, false, "Invalid email, password, or inactive account.", GetClientIpAddress(), Request.Headers.UserAgent.ToString(), cancellationToken);
            return Unauthorized(new { message = "Invalid email or password." });
        }

        await _securityService.RecordLoginAsync(user.Id, user.Email, true, null, GetClientIpAddress(), Request.Headers.UserAgent.ToString(), cancellationToken);
        var tokens = await _tokenService.IssueAsync(user, request.RememberMe, GetClientIpAddress(), Request.Headers.UserAgent.ToString(), cancellationToken);
        SetRefreshCookie(tokens.RefreshToken, tokens.RefreshTokenExpiresAt);
        return Ok(new
        {
            message = "Login successful!",
            accessToken = tokens.AccessToken,
            token = tokens.Token,
            accessTokenExpiresAt = tokens.AccessTokenExpiresAt,
            refreshTokenExpiresAt = tokens.RefreshTokenExpiresAt,
            user = new { fullName = user.FullName, email = user.Email, companyName = user.CompanyName }
        });
    }

    [AllowAnonymous]
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh(CancellationToken cancellationToken)
    {
        var tokens = await _tokenService.RotateAsync(Request.Cookies["digitech_refresh"] ?? string.Empty, GetClientIpAddress(), cancellationToken);
        if (tokens is null)
            return Unauthorized(new { message = "The refresh token is invalid, expired, or has been revoked." });

        SetRefreshCookie(tokens.RefreshToken, tokens.RefreshTokenExpiresAt);
        return Ok(new
        {
            accessToken = tokens.AccessToken,
            token = tokens.Token,
            accessTokenExpiresAt = tokens.AccessTokenExpiresAt,
            refreshTokenExpiresAt = tokens.RefreshTokenExpiresAt
        });
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout(CancellationToken cancellationToken)
    {
        await _tokenService.RevokeAsync(Request.Cookies["digitech_refresh"] ?? string.Empty, GetClientIpAddress(), cancellationToken);
        DeleteRefreshCookies();
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
    private void SetRefreshCookie(string value, DateTime expiresAt)
    {
        // Remove the previous auth-path cookie so migrations from older builds cannot shadow the API-wide cookie.
        Response.Cookies.Delete("digitech_refresh", CookieOptionsFor("/api/auth"));
        Response.Cookies.Append("digitech_refresh", value, new CookieOptions
        {
            HttpOnly = true,
            Secure = !_environment.IsDevelopment(),
            SameSite = SameSiteMode.Strict,
            Expires = new DateTimeOffset(expiresAt),
            Path = "/api"
        });
    }

    private void DeleteRefreshCookies()
    {
        Response.Cookies.Delete("digitech_refresh", CookieOptionsFor("/api"));
        Response.Cookies.Delete("digitech_refresh", CookieOptionsFor("/api/auth"));
    }

    private CookieOptions CookieOptionsFor(string path) => new()
    {
        Secure = !_environment.IsDevelopment(),
        HttpOnly = true,
        SameSite = SameSiteMode.Strict,
        Path = path
    };
}
