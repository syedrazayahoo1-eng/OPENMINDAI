using System.Diagnostics;
using System.Diagnostics.Metrics;
using System.Collections.Concurrent;
using LocalMindAI.Api.Data;
using LocalMindAI.Api.Hubs;
using Microsoft.EntityFrameworkCore;

namespace LocalMindAI.Api.Services;

public interface IMonitoringService
{
    void RecordRequest(string path, int statusCode, double durationMs);
    void RecordDependency(string dependency, double durationMs, bool succeeded);
    void RecordException(string source, Exception exception);
    Task<object> SystemAsync(CancellationToken cancellationToken = default);
    Task<object> ServicesAsync(CancellationToken cancellationToken = default);
    Task<object> WorkflowsAsync(CancellationToken cancellationToken = default);
    object Ai();
    Task<object> ReportAsync(CancellationToken cancellationToken = default);
}

public sealed class MonitoringService(IServiceScopeFactory scopeFactory, HubPresenceRegistry presence, WorkflowExecutionQueue queue, ILogger<MonitoringService> logger) : IMonitoringService
{
    private static readonly Meter Meter = new("DIGITECH.Operations", "1.0");
    private static readonly Counter<long> RequestCounter = Meter.CreateCounter<long>("digitech.requests");
    private static readonly Histogram<double> RequestDuration = Meter.CreateHistogram<double>("digitech.request.duration", "ms");
    private static readonly Histogram<double> DependencyDuration = Meter.CreateHistogram<double>("digitech.dependency.duration", "ms");
    private readonly ConcurrentQueue<double> _requestDurations = new();
    private readonly ConcurrentQueue<double> _aiDurations = new();
    private readonly ConcurrentQueue<object> _warnings = new();
    private long _requestCount;
    private long _exceptionCount;

    public void RecordRequest(string path, int statusCode, double durationMs)
    {
        RequestCounter.Add(1, new KeyValuePair<string, object?>("http.route", path), new KeyValuePair<string, object?>("http.status_code", statusCode));
        RequestDuration.Record(durationMs, new KeyValuePair<string, object?>("http.route", path));
        Interlocked.Increment(ref _requestCount); Enqueue(_requestDurations, durationMs);
        if (durationMs >= 2000) _warnings.Enqueue(new { type = "SlowRequest", path, durationMs, occurredAt = DateTime.UtcNow });
    }

    public void RecordDependency(string dependency, double durationMs, bool succeeded)
    {
        DependencyDuration.Record(durationMs, new KeyValuePair<string, object?>("dependency", dependency), new KeyValuePair<string, object?>("success", succeeded));
        if (dependency.Equals("AzureAI", StringComparison.OrdinalIgnoreCase)) Enqueue(_aiDurations, durationMs);
        if (!succeeded) _warnings.Enqueue(new { type = "DependencyFailure", dependency, durationMs, occurredAt = DateTime.UtcNow });
    }

    public void RecordException(string source, Exception exception)
    {
        Interlocked.Increment(ref _exceptionCount);
        _warnings.Enqueue(new { type = "Exception", source, message = exception.Message, occurredAt = DateTime.UtcNow });
        logger.LogError(exception, "Monitoring captured exception from {Source}.", source);
    }

    public Task<object> SystemAsync(CancellationToken cancellationToken = default) => Task.FromResult<object>(new { timestamp = DateTime.UtcNow, cpu = Process.GetCurrentProcess().TotalProcessorTime.TotalMilliseconds, memoryBytes = GC.GetTotalMemory(false), activeUsers = presence.UserCount, signalRConnections = presence.ConnectionCount, averageApiResponseMs = Average(_requestDurations), requestCount = Interlocked.Read(ref _requestCount), exceptionCount = Interlocked.Read(ref _exceptionCount) });
    public Task<object> ServicesAsync(CancellationToken cancellationToken = default) => Task.FromResult<object>(new { database = "configured", redis = "configured-or-in-memory", blobStorage = "configured-or-local", azureAi = "configured-on-demand", googleBusiness = "configured-on-demand", signalR = new { connections = presence.ConnectionCount, users = presence.UserCount } });
    public async Task<object> WorkflowsAsync(CancellationToken cancellationToken = default)
    {
        await using var scope = scopeFactory.CreateAsyncScope(); var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        return new { running = await db.Workflows.CountAsync(item => item.Status == "Running", cancellationToken), completed = await db.WorkflowExecutions.CountAsync(item => item.Status == "Completed", cancellationToken), failed = await db.WorkflowExecutions.CountAsync(item => item.Status == "Failed", cancellationToken), queued = queue.Count };
    }
    public object Ai() => new { averageResponseMs = Average(_aiDurations), samples = _aiDurations.Count };
    public async Task<object> ReportAsync(CancellationToken cancellationToken = default) => new { system = await SystemAsync(cancellationToken), services = await ServicesAsync(cancellationToken), workflows = await WorkflowsAsync(cancellationToken), ai = Ai(), warnings = _warnings.Reverse().Take(50), generatedAt = DateTime.UtcNow };
    private static void Enqueue(ConcurrentQueue<double> queue, double value) { queue.Enqueue(value); while (queue.Count > 200 && queue.TryDequeue(out _)) { } }
    private static double Average(IEnumerable<double> values) { var sample = values.ToArray(); return sample.Length == 0 ? 0 : Math.Round(sample.Average(), 2); }
}
