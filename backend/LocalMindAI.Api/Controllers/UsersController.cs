using System.Security.Claims;
using LocalMindAI.Api.DTOs;
using LocalMindAI.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LocalMindAI.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/users")]
public sealed class UsersController(IUserService service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PagedResultDto<UserDto>>> Get([FromQuery] UserQueryDto query, CancellationToken cancellationToken) => Ok(await service.GetUsersAsync(query, cancellationToken));

    [HttpGet("{id:int}")]
    public async Task<ActionResult<UserDto>> GetById(int id, CancellationToken cancellationToken)
    {
        var user = await service.GetUserAsync(id, cancellationToken);
        return user is null ? NotFound() : Ok(user);
    }

    [HttpPost("invite")]
    public async Task<ActionResult<UserDto>> Invite([FromBody] InviteUserDto input, CancellationToken cancellationToken)
    {
        try
        {
            var user = await service.InviteAsync(input, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
        }
        catch (InvalidOperationException exception)
        {
            return Conflict(new { message = exception.Message });
        }
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<UserDto>> Update(int id, [FromBody] UpdateUserDto input, CancellationToken cancellationToken)
    {
        try
        {
            var user = await service.UpdateAsync(id, input, cancellationToken);
            return user is null ? NotFound() : Ok(user);
        }
        catch (InvalidOperationException exception)
        {
            return Conflict(new { message = exception.Message });
        }
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        if (IsCurrentUser(id)) return BadRequest(new { message = "You cannot delete your own account." });
        return await service.DeleteAsync(id, cancellationToken) ? NoContent() : NotFound();
    }

    [HttpPatch("{id:int}/activate")]
    public async Task<ActionResult<UserDto>> Activate(int id, CancellationToken cancellationToken) => await SetActive(id, true, cancellationToken);

    [HttpPatch("{id:int}/deactivate")]
    public async Task<ActionResult<UserDto>> Deactivate(int id, CancellationToken cancellationToken)
    {
        if (IsCurrentUser(id)) return BadRequest(new { message = "You cannot deactivate your own account." });
        return await SetActive(id, false, cancellationToken);
    }

    [HttpPatch("{id:int}/roles")]
    public async Task<ActionResult<UserDto>> AssignRoles(int id, [FromBody] AssignUserRolesDto input, CancellationToken cancellationToken)
    {
        try
        {
            var user = await service.AssignRolesAsync(id, input, cancellationToken);
            return user is null ? NotFound() : Ok(user);
        }
        catch (InvalidOperationException exception)
        {
            return BadRequest(new { message = exception.Message });
        }
    }

    private async Task<ActionResult<UserDto>> SetActive(int id, bool isActive, CancellationToken cancellationToken)
    {
        var user = await service.SetActiveAsync(id, isActive, cancellationToken);
        return user is null ? NotFound() : Ok(user);
    }

    private bool IsCurrentUser(int id) => int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var currentUserId) && currentUserId == id;
}
