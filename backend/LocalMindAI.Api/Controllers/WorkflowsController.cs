using LocalMindAI.Api.Models;
using LocalMindAI.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LocalMindAI.Api.Controllers;

[ApiController]
[Route("api/workflows")]
[Authorize]
public class WorkflowsController(IWorkflowService service) : ControllerBase
{
    [HttpGet] public async Task<IActionResult> GetAll() => Ok(await service.GetAllAsync());
    [HttpGet("{id:int}")] public async Task<IActionResult> GetById(int id) { var workflow = await service.GetByIdAsync(id); return workflow == null ? NotFound() : Ok(workflow); }
    [HttpPost] public async Task<IActionResult> Create(Workflow workflow) { var created = await service.CreateAsync(workflow); return CreatedAtAction(nameof(GetById), new { id = created.Id }, created); }
    [HttpPut("{id:int}")] public async Task<IActionResult> Update(int id, Workflow workflow) { var updated = await service.UpdateAsync(id, workflow); return updated == null ? NotFound() : Ok(updated); }
    [HttpDelete("{id:int}")] public async Task<IActionResult> Delete(int id) => await service.DeleteAsync(id) ? NoContent() : NotFound();
}
