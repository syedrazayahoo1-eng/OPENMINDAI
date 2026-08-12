using LocalMindAI.Api.Models;

namespace LocalMindAI.Api.Services;

public sealed record WorkflowRuntimeSnapshot(string WorkflowStatus, WorkflowExecution? Execution, IReadOnlyList<WorkflowExecutionLog> Logs);

public interface IWorkflowRuntimeService
{
    Task<WorkflowExecution?> QueueAsync(int workflowId, CancellationToken cancellationToken = default);
    Task<WorkflowRuntimeSnapshot?> GetSnapshotAsync(int workflowId);
    Task<bool> PauseAsync(int workflowId);
    Task<bool> ResumeAsync(int workflowId, CancellationToken cancellationToken = default);
    Task ProcessAsync(WorkflowExecutionJob job, CancellationToken cancellationToken);
}
