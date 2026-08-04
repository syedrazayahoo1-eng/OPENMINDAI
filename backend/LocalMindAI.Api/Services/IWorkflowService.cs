using LocalMindAI.Api.Models;

namespace LocalMindAI.Api.Services;

public interface IWorkflowService
{
    Task<IEnumerable<Workflow>> GetAllAsync();
    Task<Workflow?> GetByIdAsync(int id);
    Task<Workflow> CreateAsync(Workflow workflow);
    Task<Workflow?> UpdateAsync(int id, Workflow workflow);
    Task<bool> DeleteAsync(int id);
}
