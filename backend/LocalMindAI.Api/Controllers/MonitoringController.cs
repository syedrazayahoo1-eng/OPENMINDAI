using LocalMindAI.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LocalMindAI.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/monitoring")]
public sealed class MonitoringController(IMonitoringService monitoring) : ControllerBase
{
    [HttpGet("system")] public async Task<IActionResult> System(CancellationToken cancellationToken) => Ok(await monitoring.SystemAsync(cancellationToken));
    [HttpGet("services")] public async Task<IActionResult> Services(CancellationToken cancellationToken) => Ok(await monitoring.ServicesAsync(cancellationToken));
    [HttpGet("workflows")] public async Task<IActionResult> Workflows(CancellationToken cancellationToken) => Ok(await monitoring.WorkflowsAsync(cancellationToken));
    [HttpGet("ai")] public IActionResult Ai() => Ok(monitoring.Ai());
    [HttpGet("report")] public async Task<IActionResult> Report(CancellationToken cancellationToken) => Ok(await monitoring.ReportAsync(cancellationToken));
}
