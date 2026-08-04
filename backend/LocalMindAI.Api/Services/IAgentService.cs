using LocalMindAI.Api.DTOs.Agents;

namespace LocalMindAI.Api.Services;

public interface IAgentService
{
    Task<IEnumerable<AgentDto>> GetAllAsync();
    Task<AgentDto?> GetByIdAsync(int id);
    Task<AgentDto> CreateAsync(CreateAgentDto createAgentDto);
    Task<AgentDto?> UpdateAsync(int id, UpdateAgentDto updateAgentDto);
    Task<bool> DeleteAsync(int id);
    Task<AgentDto?> PauseAsync(int id);
    Task<AgentDto?> ResumeAsync(int id);
    Task<AgentDto?> RestartAsync(int id);
}
