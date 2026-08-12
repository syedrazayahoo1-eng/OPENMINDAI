using LocalMindAI.Api.DTOs;
using LocalMindAI.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LocalMindAI.Api.Controllers;

[ApiController]
[Authorize(Policy = "Permission:Settings.Manage")]
[Route("api/permissions")]
public sealed class PermissionsController(IRoleService service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<PermissionGroupDto>>> Get(CancellationToken cancellationToken) => Ok(await service.GetPermissionGroupsAsync(cancellationToken));
}
