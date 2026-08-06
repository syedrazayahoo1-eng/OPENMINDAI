using System.Text.Json;
using LocalMindAI.Api.Data;
using LocalMindAI.Api.Models;
using LocalMindAI.Api.Hubs;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;

namespace LocalMindAI.Api.Services;

public class WorkflowRuntimeService(ApplicationDbContext context, WorkflowExecutionQueue queue, IAgentService agentService, IWorkflowNodeExecutor nodeExecutor, IHubContext<WorkflowMonitoringHub> hub, ILogger<WorkflowRuntimeService> logger) : IWorkflowRuntimeService
{
    public async Task<WorkflowExecution?> QueueAsync(int workflowId, CancellationToken cancellationToken = default)
    {
        var workflow = await context.Workflows.FindAsync([workflowId], cancellationToken);
        if (workflow == null || workflow.Status is "Running" or "Paused") return null;
        workflow.Status = "Running";
        workflow.UpdatedAt = DateTime.UtcNow;
        var execution = new WorkflowExecution { WorkflowId = workflowId, Status = "Queued", CreatedAt = DateTime.UtcNow };
        context.WorkflowExecutions.Add(execution);
        await context.SaveChangesAsync(cancellationToken);
        await PublishStatusAsync(workflow, execution, cancellationToken);
        await queue.EnqueueAsync(new WorkflowExecutionJob(workflowId, execution.Id), cancellationToken);
        return execution;
    }

    public async Task<WorkflowRuntimeSnapshot?> GetSnapshotAsync(int workflowId)
    {
        var workflow = await context.Workflows.AsNoTracking().FirstOrDefaultAsync(item => item.Id == workflowId);
        if (workflow == null) return null;
        var execution = await context.WorkflowExecutions.AsNoTracking().Where(item => item.WorkflowId == workflowId).OrderByDescending(item => item.CreatedAt).FirstOrDefaultAsync();
        var logs = execution == null ? [] : await context.WorkflowExecutionLogs.AsNoTracking().Where(item => item.WorkflowExecutionId == execution.Id).OrderBy(item => item.CreatedAt).ToListAsync();
        return new WorkflowRuntimeSnapshot(workflow.Status, execution, logs);
    }

    public async Task<bool> PauseAsync(int workflowId)
    {
        var workflow = await context.Workflows.FindAsync(workflowId);
        if (workflow == null || workflow.Status != "Running") return false;
        workflow.Status = "Paused";
        workflow.UpdatedAt = DateTime.UtcNow;
        await context.SaveChangesAsync();
        await hub.Clients.All.SendAsync("WorkflowStatusChanged", new { workflowId, status = workflow.Status }, CancellationToken.None);
        return true;
    }

    public async Task<bool> ResumeAsync(int workflowId, CancellationToken cancellationToken = default)
    {
        var workflow = await context.Workflows.FindAsync([workflowId], cancellationToken);
        if (workflow == null || workflow.Status != "Paused") return false;
        workflow.Status = "Draft";
        await context.SaveChangesAsync(cancellationToken);
        return await QueueAsync(workflowId, cancellationToken) != null;
    }

    public async Task ProcessAsync(WorkflowExecutionJob job, CancellationToken cancellationToken)
    {
        var execution = await context.WorkflowExecutions.FindAsync([job.ExecutionId], cancellationToken);
        var workflow = await context.Workflows.FindAsync([job.WorkflowId], cancellationToken);
        if (execution == null || workflow == null) return;

        try
        {
            execution.Status = "Running";
            execution.StartedAt = DateTime.UtcNow;
            await AddLogAsync(execution, "Runtime", "Workflow execution started.", cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
            await PublishStatusAsync(workflow, execution, cancellationToken);
            var definition = GetDefinition(workflow);
            using var document = string.IsNullOrWhiteSpace(definition) ? null : JsonDocument.Parse(definition);
            var nodes = document?.RootElement.TryGetProperty("nodes", out var elements) == true ? elements.EnumerateArray().ToArray() : [];
            string triggerContext = "No trigger payload was supplied.";
            for (var index = 0; index < nodes.Length; index++)
            {
                await context.Entry(workflow).ReloadAsync(cancellationToken);
                if (workflow.Status == "Paused")
                {
                    execution.Status = "Paused";
                    execution.CurrentStep = string.Empty;
                    await AddLogAsync(execution, "Runtime", "Workflow execution paused.", cancellationToken);
                    await context.SaveChangesAsync(cancellationToken);
                    await PublishStatusAsync(workflow, execution, cancellationToken);
                    return;
                }
                var node = nodes[index];
                var stepName = node.TryGetProperty("properties", out var properties) && properties.TryGetProperty("name", out var name) ? name.GetString() ?? "Workflow step" : "Workflow step";
                var nodeType = node.TryGetProperty("type", out var type) ? type.GetString() ?? string.Empty : string.Empty;
                execution.CurrentStep = stepName;
                execution.Progress = (int)Math.Round((index + 1d) / Math.Max(nodes.Length, 1) * 100);
                if (nodeType == "Triggers" && (stepName == "Google Review" || stepName == "New Google Review"))
                {
                    var review = await ResolveReviewAsync(properties, cancellationToken);
                    if (review == null) throw new InvalidOperationException("Google Review trigger requires an available review.");
                    triggerContext = $"Google Review from {review.ReviewerName}; rating {review.Rating}/5; content: {review.ReviewText}";
                    await AddLogAsync(execution, stepName, $"Google Review trigger received review #{review.Id} from {review.ReviewerName}.", cancellationToken);
                }
                else if (nodeType == "AI" || (nodeType == "Actions" && stepName == "Run AI Agent"))
                {
                    await AddLogAsync(execution, stepName, "AI agent execution started.", cancellationToken);
                    if (stepName == "Azure AI")
                    {
                        var result = await nodeExecutor.ExecuteAsync(nodeType, stepName, properties, triggerContext, cancellationToken);
                        await AddLogAsync(execution, stepName, result.Summary, cancellationToken);
                        triggerContext = result.Output ?? triggerContext;
                    }
                    else
                    {
                        var result = await agentService.ExecuteAsync(stepName, triggerContext, cancellationToken);
                        await AddLogAsync(execution, stepName, $"AI agent '{result.AgentName}' completed with {result.Output.Length} response characters.", cancellationToken);
                        triggerContext = result.Output;
                    }
                }
                else if (nodeType == "Actions" && IsExecutableAction(stepName))
                {
                    await AddLogAsync(execution, stepName, "Step execution started.", cancellationToken);
                    var result = await nodeExecutor.ExecuteAsync(nodeType, stepName, properties, triggerContext, cancellationToken);
                    await AddLogAsync(execution, stepName, result.Summary, cancellationToken);
                    triggerContext = result.Output ?? triggerContext;
                }
                else await AddLogAsync(execution, stepName, "Step processed in test-safe runtime mode.", cancellationToken);
                await context.SaveChangesAsync(cancellationToken);
                await PublishProgressAsync(workflow, execution, cancellationToken);
                await Task.Delay(150, cancellationToken);
            }
            execution.Status = "Completed";
            execution.Progress = 100;
            execution.CurrentStep = string.Empty;
            execution.CompletedAt = DateTime.UtcNow;
            workflow.Status = "Completed";
            workflow.UpdatedAt = DateTime.UtcNow;
            await AddLogAsync(execution, "Runtime", "Workflow execution completed.", cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
            await PublishStatusAsync(workflow, execution, cancellationToken);
        }
        catch (Exception exception)
        {
            logger.LogError(exception, "Workflow execution {ExecutionId} failed.", job.ExecutionId);
            execution.Status = "Failed";
            execution.Error = exception.Message;
            execution.CompletedAt = DateTime.UtcNow;
            workflow.Status = "Failed";
            await AddLogAsync(execution, "Runtime", exception.Message, cancellationToken, "Error");
            await context.SaveChangesAsync(cancellationToken);
            await PublishStatusAsync(workflow, execution, cancellationToken);
        }
    }

    private async Task AddLogAsync(WorkflowExecution execution, string stepName, string message, CancellationToken cancellationToken, string level = "Information")
    {
        var log = new WorkflowExecutionLog { WorkflowExecutionId = execution.Id, WorkflowId = execution.WorkflowId, StepName = stepName, Message = message, Level = level, CreatedAt = DateTime.UtcNow };
        await context.WorkflowExecutionLogs.AddAsync(log, cancellationToken);
        await hub.Clients.All.SendAsync("WorkflowExecutionLog", new { executionId = execution.Id, workflowId = execution.WorkflowId, stepName, message, level, createdAt = log.CreatedAt }, CancellationToken.None);
    }

    private Task PublishStatusAsync(Workflow workflow, WorkflowExecution execution, CancellationToken cancellationToken) => Task.WhenAll(
        hub.Clients.All.SendAsync("WorkflowStatusChanged", new { workflowId = workflow.Id, status = workflow.Status, executionId = execution.Id, executionStatus = execution.Status, progress = execution.Progress, currentStep = execution.CurrentStep, startedAt = execution.StartedAt, completedAt = execution.CompletedAt, error = execution.Error }, cancellationToken),
        hub.Clients.All.SendAsync("DashboardUpdated", new { module = "workflows", entityId = workflow.Id, status = workflow.Status, occurredAt = DateTime.UtcNow }, cancellationToken),
        hub.Clients.All.SendAsync("Notification", new { title = $"Workflow {workflow.Status}", message = string.IsNullOrWhiteSpace(execution.CurrentStep) ? workflow.Name : execution.CurrentStep, level = execution.Status == "Failed" ? "Error" : "Information", occurredAt = DateTime.UtcNow }, cancellationToken));
    private Task PublishProgressAsync(Workflow workflow, WorkflowExecution execution, CancellationToken cancellationToken) => hub.Clients.All.SendAsync("WorkflowProgress", new { workflowId = workflow.Id, executionId = execution.Id, status = execution.Status, progress = execution.Progress, currentStep = execution.CurrentStep }, cancellationToken);

    private static string GetDefinition(Workflow workflow)
    {
        if (!string.IsNullOrWhiteSpace(workflow.Definition)) return workflow.Definition;
        try
        {
            using var stored = JsonDocument.Parse(workflow.Description);
            return stored.RootElement.TryGetProperty("Definition", out var definition) ? definition.GetString() ?? string.Empty : string.Empty;
        }
        catch (JsonException) { return string.Empty; }
    }

    private async Task<Review?> ResolveReviewAsync(JsonElement properties, CancellationToken cancellationToken)
    {
        if (properties.TryGetProperty("reviewId", out var reviewId) && reviewId.TryGetInt32(out var id))
            return await context.Reviews.FindAsync([id], cancellationToken);
        return await context.Reviews.OrderByDescending(review => review.CreatedAt).FirstOrDefaultAsync(cancellationToken);
    }

    private static bool IsExecutableAction(string stepName) => stepName is "Send Email" or "Email" or "Send Teams Message" or "Teams" or "HTTP Request" or "Webhook" or "Database" or "Database Query" or "Publish Google Business Post";
}
