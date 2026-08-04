using LocalMindAI.Api.DTOs.Agents;
using LocalMindAI.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LocalMindAI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AgentsController : ControllerBase
{
    private readonly IAgentService _agentService;
    public AgentsController(IAgentService agentService) => _agentService = agentService;

    [HttpGet] public async Task<ActionResult<IEnumerable<AgentDto>>> GetAll() => Ok(await _agentService.GetAllAsync());
    [HttpGet("{id:int}")] public async Task<ActionResult<AgentDto>> GetById(int id) => await FindAsync(_agentService.GetByIdAsync(id), id);
    [HttpPost] public async Task<ActionResult<AgentDto>> Create(CreateAgentDto dto)
    {
        var agent = await _agentService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = agent.Id }, agent);
    }
    [HttpPut("{id:int}")] public async Task<ActionResult<AgentDto>> Update(int id, UpdateAgentDto dto) => await FindAsync(_agentService.UpdateAsync(id, dto), id);
    [HttpDelete("{id:int}")] public async Task<IActionResult> Delete(int id) => await _agentService.DeleteAsync(id) ? NoContent() : NotFound(new { Message = $"Agent with ID {id} was not found." });
    [HttpPost("{id:int}/pause")] public async Task<ActionResult<AgentDto>> Pause(int id) => await FindAsync(_agentService.PauseAsync(id), id);
    [HttpPost("{id:int}/resume")] public async Task<ActionResult<AgentDto>> Resume(int id) => await FindAsync(_agentService.ResumeAsync(id), id);
    [HttpPost("{id:int}/restart")] public async Task<ActionResult<AgentDto>> Restart(int id) => await FindAsync(_agentService.RestartAsync(id), id);

    private async Task<ActionResult<AgentDto>> FindAsync(Task<AgentDto?> operation, int id)
    {
        var agent = await operation;
        return agent == null ? NotFound(new { Message = $"Agent with ID {id} was not found." }) : Ok(agent);
    }
}
