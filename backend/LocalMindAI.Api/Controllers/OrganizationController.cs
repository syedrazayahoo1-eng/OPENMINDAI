using LocalMindAI.Api.DTOs;
using LocalMindAI.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LocalMindAI.Api.Controllers;

[ApiController, Authorize, Route("api/organization")]
public sealed class OrganizationController(IOrganizationService service) : ControllerBase
{
    [HttpGet] public async Task<IActionResult> Get(CancellationToken cancellationToken) => Ok(await service.GetAsync(cancellationToken));
    [HttpPost] public async Task<IActionResult> Create(OrganizationDto input, CancellationToken cancellationToken) => Ok(await service.CreateAsync(input, cancellationToken));
    [HttpPut] public async Task<IActionResult> Update(OrganizationDto input, CancellationToken cancellationToken) => Ok(await service.UpdateAsync(input, cancellationToken));
    [HttpDelete("{id:int}")] public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken) => await service.DeleteAsync(id, cancellationToken) ? NoContent() : NotFound();
}
