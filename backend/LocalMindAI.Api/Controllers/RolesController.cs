using LocalMindAI.Api.DTOs;
using LocalMindAI.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LocalMindAI.Api.Controllers;

[ApiController]
[Authorize(Policy = "Permission:Settings.Manage")]
[Route("api/roles")]
public sealed class RolesController(IRoleService service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<RoleDto>>> Get(CancellationToken cancellationToken) => Ok(await service.GetRolesAsync(cancellationToken));

    [HttpPost]
    public async Task<ActionResult<RoleDto>> Create([FromBody] SaveRoleDto input, CancellationToken cancellationToken)
    {
        try
        {
            var role = await service.CreateAsync(input, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = role.Id }, role);
        }
        catch (InvalidOperationException exception)
        {
            return Conflict(new { message = exception.Message });
        }
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<RoleDto>> GetById(int id, CancellationToken cancellationToken)
    {
        var role = await service.GetRoleAsync(id, cancellationToken);
        return role is null ? NotFound() : Ok(role);
    }

    [HttpGet("{id:int}/permissions")]
    public async Task<ActionResult<RolePermissionsDto>> GetPermissions(int id, CancellationToken cancellationToken)
    {
        var permissions = await service.GetRolePermissionsAsync(id, cancellationToken);
        return permissions is null ? NotFound() : Ok(permissions);
    }

    [HttpPut("{id:int}/permissions")]
    public async Task<ActionResult<RolePermissionsDto>> UpdatePermissions(int id, [FromBody] SaveRolePermissionsDto input, CancellationToken cancellationToken)
    {
        try
        {
            var permissions = await service.UpdateRolePermissionsAsync(id, input, cancellationToken);
            return permissions is null ? NotFound() : Ok(permissions);
        }
        catch (InvalidOperationException exception)
        {
            return BadRequest(new { message = exception.Message });
        }
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<RoleDto>> Update(int id, [FromBody] SaveRoleDto input, CancellationToken cancellationToken)
    {
        try
        {
            var role = await service.UpdateAsync(id, input, cancellationToken);
            return role is null ? NotFound() : Ok(role);
        }
        catch (InvalidOperationException exception)
        {
            return Conflict(new { message = exception.Message });
        }
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken) =>
        await service.DeleteAsync(id, cancellationToken) ? NoContent() : NotFound();
}
