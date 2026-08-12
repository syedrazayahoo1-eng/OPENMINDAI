using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using LocalMindAI.Api.DTOs;
using LocalMindAI.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LocalMindAI.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/security")]
public sealed class SecurityController(ISecurityService service) : ControllerBase
{
    [HttpGet("profile")]
    public async Task<ActionResult<SecurityProfileDto>> GetProfile(CancellationToken cancellationToken)
    {
        var profile = await service.GetProfileAsync(CurrentUserId, cancellationToken);
        return profile is null ? NotFound() : Ok(profile);
    }

    [HttpPut("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto input, CancellationToken cancellationToken)
    {
        var changed = await service.ChangePasswordAsync(CurrentUserId, input, ClientIp, cancellationToken);
        return changed ? NoContent() : BadRequest(new { message = "The current password is incorrect." });
    }

    [HttpGet("sessions")]
    public async Task<ActionResult<IReadOnlyList<SecuritySessionDto>>> GetSessions(CancellationToken cancellationToken) => Ok(await service.GetSessionsAsync(CurrentUserId, CurrentRefreshToken, cancellationToken));

    [HttpDelete("sessions/{id:int}")]
    public async Task<IActionResult> RevokeSession(int id, CancellationToken cancellationToken) => await service.RevokeSessionAsync(CurrentUserId, id, ClientIp, cancellationToken) ? NoContent() : NotFound();

    [HttpDelete("sessions")]
    public async Task<IActionResult> RevokeOtherSessions(CancellationToken cancellationToken)
    {
        var count = await service.RevokeAllSessionsAsync(CurrentUserId, CurrentRefreshToken, ClientIp, cancellationToken);
        return Ok(new { revoked = count });
    }

    [HttpGet("login-history")]
    public async Task<ActionResult<IReadOnlyList<LoginHistoryDto>>> GetLoginHistory(CancellationToken cancellationToken) => Ok(await service.GetLoginHistoryAsync(CurrentUserId, cancellationToken));

    [HttpGet("api-keys")]
    public async Task<ActionResult<IReadOnlyList<ApiKeyDto>>> GetApiKeys(CancellationToken cancellationToken) => Ok(await service.GetApiKeysAsync(CurrentUserId, cancellationToken));

    [HttpPost("api-keys")]
    public async Task<ActionResult<CreatedApiKeyDto>> CreateApiKey([FromBody] CreateApiKeyDto input, CancellationToken cancellationToken)
    {
        try { return Ok(await service.CreateApiKeyAsync(CurrentUserId, input, ClientIp, cancellationToken)); }
        catch (InvalidOperationException exception) { return BadRequest(new { message = exception.Message }); }
    }

    [HttpDelete("api-keys/{id:int}")]
    public async Task<IActionResult> RevokeApiKey(int id, CancellationToken cancellationToken) => await service.RevokeApiKeyAsync(CurrentUserId, id, ClientIp, cancellationToken) ? NoContent() : NotFound();

    [HttpGet("mfa")]
    public async Task<ActionResult<MfaStatusDto>> GetMfa(CancellationToken cancellationToken) => Ok(await service.GetMfaAsync(CurrentUserId, cancellationToken));

    [HttpPost("mfa/enable")]
    public async Task<ActionResult<EnabledMfaDto>> EnableMfa(CancellationToken cancellationToken)
    {
        var profile = await service.GetProfileAsync(CurrentUserId, cancellationToken);
        return profile is null ? NotFound() : Ok(await service.EnableMfaAsync(CurrentUserId, profile.Email, ClientIp, cancellationToken));
    }

    [HttpPost("mfa/disable")]
    public async Task<IActionResult> DisableMfa(CancellationToken cancellationToken) { await service.DisableMfaAsync(CurrentUserId, ClientIp, cancellationToken); return NoContent(); }

    [HttpGet("audit-logs")]
    public async Task<ActionResult<PagedResultDto<AuditLogDto>>> GetAuditLogs([FromQuery] AuditLogQueryDto query, CancellationToken cancellationToken) => Ok(await service.GetAuditLogsAsync(CurrentUserId, query, cancellationToken));

    private int CurrentUserId => int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub), out var userId) ? userId : throw new UnauthorizedAccessException();
    private string? CurrentRefreshToken => Request.Cookies["digitech_refresh"];
    private string? ClientIp => HttpContext.Connection.RemoteIpAddress?.ToString();
}
