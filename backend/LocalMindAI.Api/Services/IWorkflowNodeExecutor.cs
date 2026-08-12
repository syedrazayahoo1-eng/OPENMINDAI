using System.Text.Json;

namespace LocalMindAI.Api.Services;

public sealed record WorkflowNodeExecutionResult(string Summary, string? Output = null);

public interface IWorkflowNodeExecutor
{
    Task<WorkflowNodeExecutionResult> ExecuteAsync(string nodeType, string stepName, JsonElement properties, string input, CancellationToken cancellationToken = default);
}
