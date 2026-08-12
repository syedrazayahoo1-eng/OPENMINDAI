using LocalMindAI.Api.DTOs;
using LocalMindAI.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LocalMindAI.Api.Controllers;

[ApiController]
[Authorize(Policy = "Permission:Settings.Manage")]
[Route("api/integrations")]
public sealed class IntegrationsController(IIntegrationService service) : ControllerBase
{
    [HttpGet("{provider}")]
    public Task<IntegrationDto> Get(string provider, CancellationToken cancellationToken) => service.GetAsync(provider, cancellationToken);
    [HttpPut("{provider}")]
    public Task<IntegrationDto> Save(string provider, [FromBody] SaveIntegrationDto input, CancellationToken cancellationToken) => service.SaveAsync(provider, input, cancellationToken);
    [HttpPost("{provider}/test")]
    public async Task<ActionResult<IntegrationTestDto>> Test(string provider, CancellationToken cancellationToken)
    {
        try { return Ok(await service.TestAsync(provider, cancellationToken)); } catch (InvalidOperationException exception) { return BadRequest(new { message = exception.Message }); }
    }
    [HttpGet("google-business")]
    public Task<IntegrationDto> GetGoogleBusiness(CancellationToken cancellationToken) => service.GetGoogleBusinessAsync(cancellationToken);
    [HttpPost("google-business/reconnect")]
    public Task<IntegrationTestDto> ReconnectGoogleBusiness(CancellationToken cancellationToken) => service.ReconnectGoogleBusinessAsync(cancellationToken);
    [HttpPost("google-business/test")]
    public Task<IntegrationTestDto> TestGoogleBusiness(CancellationToken cancellationToken) => service.ReconnectGoogleBusinessAsync(cancellationToken);
}
