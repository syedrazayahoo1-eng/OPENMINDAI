using LocalMindAI.Api.Data;
using LocalMindAI.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LocalMindAI.Api.Services;

public class WorkflowService(ApplicationDbContext context) : IWorkflowService
{
    public async Task<IEnumerable<Workflow>> GetAllAsync() => await context.Workflows.AsNoTracking().Include(workflow => workflow.Steps).OrderByDescending(workflow => workflow.UpdatedAt).ToListAsync();
    public async Task<Workflow?> GetByIdAsync(int id) => await context.Workflows.AsNoTracking().Include(workflow => workflow.Steps).FirstOrDefaultAsync(workflow => workflow.Id == id);
    public async Task<Workflow> CreateAsync(Workflow workflow) { workflow.Id = 0; workflow.CreatedAt = DateTime.UtcNow; workflow.UpdatedAt = workflow.CreatedAt; context.Workflows.Add(workflow); await context.SaveChangesAsync(); return workflow; }
    public async Task<Workflow?> UpdateAsync(int id, Workflow input) { var workflow = await context.Workflows.FindAsync(id); if (workflow == null) return null; workflow.Name = input.Name; workflow.Description = input.Description; workflow.IsActive = input.IsActive; workflow.UpdatedAt = DateTime.UtcNow; await context.SaveChangesAsync(); return workflow; }
    public async Task<bool> DeleteAsync(int id) { var workflow = await context.Workflows.FindAsync(id); if (workflow == null) return false; context.Workflows.Remove(workflow); await context.SaveChangesAsync(); return true; }
}
