using System.Threading.Channels;

namespace LocalMindAI.Api.Services;

public sealed record WorkflowExecutionJob(int WorkflowId, int ExecutionId);

public class WorkflowExecutionQueue
{
    private readonly Channel<WorkflowExecutionJob> _jobs = Channel.CreateUnbounded<WorkflowExecutionJob>(new UnboundedChannelOptions { SingleReader = true });

    private int _count;
    public int Count => Volatile.Read(ref _count);
    public async ValueTask EnqueueAsync(WorkflowExecutionJob job, CancellationToken cancellationToken = default) { await _jobs.Writer.WriteAsync(job, cancellationToken); Interlocked.Increment(ref _count); }
    public async ValueTask<WorkflowExecutionJob> DequeueAsync(CancellationToken cancellationToken) { var job = await _jobs.Reader.ReadAsync(cancellationToken); Interlocked.Decrement(ref _count); return job; }
}
