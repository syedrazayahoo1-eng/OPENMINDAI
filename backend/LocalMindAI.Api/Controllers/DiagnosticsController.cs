using LocalMindAI.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LocalMindAI.Api.Controllers;

[ApiController]
[Route("api/diagnostics")]
[Authorize]
public sealed class DiagnosticsController(IExternalServicesDiagnostics diagnostics) : ControllerBase
{
    [HttpGet("external-services")]
    public IActionResult ExternalServices() => Ok(diagnostics.GetReport());
}
