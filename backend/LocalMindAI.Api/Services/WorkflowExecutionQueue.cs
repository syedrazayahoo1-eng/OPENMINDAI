using System.Threading.Channels;

namespace LocalMindAI.Api.Services;

public sealed record WorkflowExecutionJob(int WorkflowId, int ExecutionId);

public class WorkflowExecutionQueue
{
    private readonly Channel<WorkflowExecutionJob> _jobs = Channel.CreateUnbounded<WorkflowExecutionJob>(new UnboundedChannelOptions { SingleReader = true });

    public ValueTask EnqueueAsync(WorkflowExecutionJob job, CancellationToken cancellationToken = default) => _jobs.Writer.WriteAsync(job, cancellationToken);
    public ValueTask<WorkflowExecutionJob> DequeueAsync(CancellationToken cancellationToken) => _jobs.Reader.ReadAsync(cancellationToken);
}
