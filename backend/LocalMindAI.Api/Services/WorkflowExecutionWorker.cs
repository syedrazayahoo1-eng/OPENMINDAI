namespace LocalMindAI.Api.Services;

public class WorkflowExecutionWorker(WorkflowExecutionQueue queue, IServiceScopeFactory scopeFactory, ILogger<WorkflowExecutionWorker> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                var job = await queue.DequeueAsync(stoppingToken);
                using var scope = scopeFactory.CreateScope();
                await scope.ServiceProvider.GetRequiredService<IWorkflowRuntimeService>().ProcessAsync(job, stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested) { }
            catch (Exception exception) { logger.LogError(exception, "Workflow execution worker error."); }
        }
    }
}
