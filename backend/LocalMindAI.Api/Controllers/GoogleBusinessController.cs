using LocalMindAI.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace LocalMindAI.Api.Controllers;
[ApiController, Route("api/google"), Authorize]
public class GoogleBusinessController(IGoogleBusinessProfileService service, IConfiguration config) : ControllerBase
{
 [HttpGet("auth")] public IActionResult Auth([FromQuery] string redirectUri) => Redirect(service.AuthorizationUrl(redirectUri));
 [AllowAnonymous, HttpGet("callback")] public async Task<IActionResult> Callback([FromQuery] string code, [FromQuery] string redirectUri) { await service.CompleteOAuthAsync(code, redirectUri); return Redirect(config["GoogleBusiness:FrontendCallbackUrl"] ?? "/reviews"); }
 [HttpGet("accounts")] public async Task<IActionResult> Accounts() => Ok(await service.AccountsAsync());
 [HttpGet("locations")] public async Task<IActionResult> Locations() => Ok(await service.LocationsAsync());
 [HttpPost("sync")] public async Task<IActionResult> Sync() => Ok(await service.SyncAsync());
 [HttpDelete("accounts/{accountId:int}")] public async Task<IActionResult> Disconnect(int accountId) { await service.DisconnectAsync(accountId); return NoContent(); }
 [HttpGet("/api/google-business/overview")] public async Task<IActionResult> Overview() => Ok(await service.OverviewAsync());
}
