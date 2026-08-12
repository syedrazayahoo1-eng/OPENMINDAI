using System.Text.Json;
using LocalMindAI.Api.Data;
using LocalMindAI.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LocalMindAI.Api.Services;

public class WorkflowService(ApplicationDbContext context) : IWorkflowService
{
    private sealed record StoredWorkflow(string Description, string Definition);

    public async Task<IEnumerable<Workflow>> GetAllAsync()
    {
        var workflows = await context.Workflows.AsNoTracking().Include(workflow => workflow.Steps).OrderByDescending(workflow => workflow.UpdatedAt).ToListAsync();
        workflows.ForEach(RestoreDefinition);
        return workflows;
    }

    public async Task<Workflow?> GetByIdAsync(int id)
    {
        var workflow = await context.Workflows.AsNoTracking().Include(workflow => workflow.Steps).FirstOrDefaultAsync(workflow => workflow.Id == id);
        if (workflow != null) RestoreDefinition(workflow);
        return workflow;
    }

    public async Task<Workflow> CreateAsync(Workflow workflow)
    {
        workflow.Id = 0;
        workflow.CreatedAt = DateTime.UtcNow;
        workflow.UpdatedAt = workflow.CreatedAt;
        StoreDefinition(workflow);
        context.Workflows.Add(workflow);
        await context.SaveChangesAsync();
        RestoreDefinition(workflow);
        return workflow;
    }

    public async Task<Workflow?> UpdateAsync(int id, Workflow input)
    {
        var workflow = await context.Workflows.FindAsync(id);
        if (workflow == null) return null;
        workflow.Name = input.Name;
        workflow.Description = input.Description;
        workflow.Definition = input.Definition;
        workflow.IsActive = input.IsActive;
        workflow.UpdatedAt = DateTime.UtcNow;
        StoreDefinition(workflow);
        await context.SaveChangesAsync();
        RestoreDefinition(workflow);
        return workflow;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var workflow = await context.Workflows.FindAsync(id);
        if (workflow == null) return false;
        context.Workflows.Remove(workflow);
        await context.SaveChangesAsync();
        return true;
    }

    private static void StoreDefinition(Workflow workflow)
    {
        if (string.IsNullOrWhiteSpace(workflow.Definition)) return;
        workflow.Description = JsonSerializer.Serialize(new StoredWorkflow(workflow.Description, workflow.Definition));
    }

    private static void RestoreDefinition(Workflow workflow)
    {
        try
        {
            var stored = JsonSerializer.Deserialize<StoredWorkflow>(workflow.Description);
            if (stored == null || string.IsNullOrWhiteSpace(stored.Definition)) return;
            workflow.Description = stored.Description;
            workflow.Definition = stored.Definition;
        }
        catch (JsonException) { }
    }
}
