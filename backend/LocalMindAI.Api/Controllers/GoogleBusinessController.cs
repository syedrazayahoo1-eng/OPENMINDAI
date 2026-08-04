using LocalMindAI.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace LocalMindAI.Api.Controllers;
[ApiController, Route("api/google-business"), Authorize]
public class GoogleBusinessController(IGoogleBusinessProfileService service) : ControllerBase
{
 [HttpGet("oauth/connect")] public IActionResult Connect([FromQuery] string redirectUri) => Redirect(service.AuthorizationUrl(redirectUri));
 [HttpGet("overview")] public async Task<IActionResult> Overview() => Ok(await service.OverviewAsync());
 [HttpPost("sync")] public async Task<IActionResult> Sync() => Ok(await service.SyncAsync());
}
