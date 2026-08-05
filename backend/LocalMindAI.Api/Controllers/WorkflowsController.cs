using LocalMindAI.Api.Models;
using LocalMindAI.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LocalMindAI.Api.Controllers;

[ApiController]
[Route("api/workflows")]
[Authorize]
public class WorkflowsController(IWorkflowService service, IWorkflowRuntimeService runtime) : ControllerBase
{
    [HttpGet] public async Task<IActionResult> GetAll() => Ok(await service.GetAllAsync());
    [HttpGet("{id:int}")] public async Task<IActionResult> GetById(int id) { var workflow = await service.GetByIdAsync(id); return workflow == null ? NotFound() : Ok(workflow); }
    [HttpPost] public async Task<IActionResult> Create(Workflow workflow) { var created = await service.CreateAsync(workflow); return CreatedAtAction(nameof(GetById), new { id = created.Id }, created); }
    [HttpPut("{id:int}")] public async Task<IActionResult> Update(int id, Workflow workflow) { var updated = await service.UpdateAsync(id, workflow); return updated == null ? NotFound() : Ok(updated); }
    [HttpDelete("{id:int}")] public async Task<IActionResult> Delete(int id) => await service.DeleteAsync(id) ? NoContent() : NotFound();
    [HttpPost("{id:int}/run")] public async Task<IActionResult> Run(int id, CancellationToken cancellationToken) { var execution = await runtime.QueueAsync(id, cancellationToken); return execution == null ? Conflict(new { message = "Workflow is unavailable for execution." }) : Accepted(new { executionId = execution.Id, status = execution.Status }); }
    [HttpPost("{id:int}/pause")] public async Task<IActionResult> Pause(int id) => await runtime.PauseAsync(id) ? Ok() : Conflict(new { message = "Workflow is not running." });
    [HttpPost("{id:int}/resume")] public async Task<IActionResult> Resume(int id, CancellationToken cancellationToken) => await runtime.ResumeAsync(id, cancellationToken) ? Accepted() : Conflict(new { message = "Workflow is not paused." });
    [HttpGet("{id:int}/runtime")] public async Task<IActionResult> Runtime(int id) { var snapshot = await runtime.GetSnapshotAsync(id); return snapshot == null ? NotFound() : Ok(snapshot); }
}
