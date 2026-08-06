using LocalMindAI.Api.Data;
using LocalMindAI.Api.DTOs.Agents;
using LocalMindAI.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using LocalMindAI.Api.Hubs;

namespace LocalMindAI.Api.Services;

public class AgentService : IAgentService
{
    private readonly ApplicationDbContext _context;
    private readonly AIService _aiService;
    private readonly IHubContext<WorkflowMonitoringHub> _hub;

    public AgentService(ApplicationDbContext context, AIService aiService, IHubContext<WorkflowMonitoringHub> hub) { _context = context; _aiService = aiService; _hub = hub; }

    public async Task<IEnumerable<AgentDto>> GetAllAsync() => await _context.Agents
        .AsNoTracking().OrderByDescending(agent => agent.UpdatedAt).Select(agent => Map(agent)).ToListAsync();

    public async Task<AgentDto?> GetByIdAsync(int id)
    {
        var agent = await _context.Agents.AsNoTracking().FirstOrDefaultAsync(agent => agent.Id == id);
        return agent == null ? null : Map(agent);
    }

    public async Task<AgentDto> CreateAsync(CreateAgentDto dto)
    {
        var now = DateTime.UtcNow;
        var agent = new Agent
        {
            Name = dto.Name.Trim(), Initials = BuildInitials(dto.Name), Department = dto.Department.Trim(),
            CurrentTask = "Ready to begin work", Models = dto.Models.Trim(), Description = dto.Description.Trim(),
            Temperature = dto.Temperature, MaxTokens = dto.MaxTokens, Performance = 100, LastActiveAt = now,
            CreatedAt = now, UpdatedAt = now
        };
        _context.Agents.Add(agent);
        await _context.SaveChangesAsync();
        await PublishStatusAsync(agent);
        return Map(agent);
    }

    public async Task<AgentDto?> UpdateAsync(int id, UpdateAgentDto dto)
    {
        var agent = await _context.Agents.FindAsync(id);
        if (agent == null) return null;
        agent.Name = dto.Name.Trim(); agent.Initials = BuildInitials(dto.Name); agent.Department = dto.Department.Trim();
        agent.Status = dto.Status.Trim(); agent.CurrentTask = dto.CurrentTask.Trim(); agent.Models = dto.Models.Trim();
        agent.Description = dto.Description.Trim(); agent.Temperature = dto.Temperature; agent.MaxTokens = dto.MaxTokens;
        agent.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        await PublishStatusAsync(agent);
        return Map(agent);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var agent = await _context.Agents.FindAsync(id);
        if (agent == null) return false;
        _context.Agents.Remove(agent);
        await _context.SaveChangesAsync();
        return true;
    }

    public Task<AgentDto?> PauseAsync(int id) => SetStatusAsync(id, "Paused");
    public Task<AgentDto?> ResumeAsync(int id) => SetStatusAsync(id, "Running");

    public async Task<AgentDto?> RestartAsync(int id)
    {
        var agent = await _context.Agents.FindAsync(id);
        if (agent == null) return null;
        agent.Status = "Running"; agent.LastActiveAt = DateTime.UtcNow; agent.UpdatedAt = agent.LastActiveAt;
        await _context.SaveChangesAsync();
        await PublishStatusAsync(agent);
        return Map(agent);
    }

    public async Task<AgentExecutionResult> ExecuteAsync(string agentReference, string input, CancellationToken cancellationToken = default)
    {
        var reference = agentReference.Replace(" AI", string.Empty, StringComparison.OrdinalIgnoreCase).Trim();
        var agent = await _context.Agents.FirstOrDefaultAsync(item => item.Name == agentReference || item.Department == reference, cancellationToken);
        if (agent == null) throw new InvalidOperationException($"No deployed agent matches '{agentReference}'.");
        if (agent.Status == "Paused") throw new InvalidOperationException($"Agent '{agent.Name}' is paused.");

        agent.Status = "Running";
        agent.CurrentTask = "Processing workflow node";
        agent.LastActiveAt = DateTime.UtcNow;
        agent.UpdatedAt = agent.LastActiveAt;
        await _context.SaveChangesAsync(cancellationToken);
        await PublishStatusAsync(agent);

        var prompt = $"You are {agent.Name}, working in the {agent.Department} department. {agent.Description}\n\nWorkflow input:\n{input}";
        var output = await _aiService.AskAI(prompt);

        agent.CurrentTask = "Workflow node completed";
        agent.LastActiveAt = DateTime.UtcNow;
        agent.UpdatedAt = agent.LastActiveAt;
        await _context.SaveChangesAsync(cancellationToken);
        await PublishStatusAsync(agent);
        return new AgentExecutionResult(agent.Id, agent.Name, output);
    }

    private async Task<AgentDto?> SetStatusAsync(int id, string status)
    {
        var agent = await _context.Agents.FindAsync(id);
        if (agent == null) return null;
        agent.Status = status; agent.LastActiveAt = DateTime.UtcNow; agent.UpdatedAt = agent.LastActiveAt;
        await _context.SaveChangesAsync();
        await PublishStatusAsync(agent);
        return Map(agent);
    }

    private Task PublishStatusAsync(Agent agent) => Task.WhenAll(
        _hub.Clients.All.SendAsync("AgentStatusChanged", new { agentId = agent.Id, name = agent.Name, status = agent.Status, currentTask = agent.CurrentTask, lastActiveAt = agent.LastActiveAt }),
        _hub.Clients.All.SendAsync("DashboardUpdated", new { module = "agents", entityId = agent.Id, status = agent.Status, occurredAt = DateTime.UtcNow }),
        _hub.Clients.All.SendAsync("Notification", new { title = $"{agent.Name} {agent.Status}", message = agent.CurrentTask, level = "Information", occurredAt = DateTime.UtcNow }));

    private static string BuildInitials(string name) => string.Concat(name.Split(' ', StringSplitOptions.RemoveEmptyEntries)
        .Take(2).Select(word => char.ToUpperInvariant(word[0])));

    private static AgentDto Map(Agent agent) => new()
    {
        Id = agent.Id, Name = agent.Name, Initials = agent.Initials, Department = agent.Department, Status = agent.Status,
        CurrentTask = agent.CurrentTask, Performance = agent.Performance, Description = agent.Description,
        LastActiveAt = agent.LastActiveAt, Models = agent.Models, Tone = agent.Tone, Temperature = agent.Temperature,
        MaxTokens = agent.MaxTokens, CreatedAt = agent.CreatedAt, UpdatedAt = agent.UpdatedAt
    };
}
