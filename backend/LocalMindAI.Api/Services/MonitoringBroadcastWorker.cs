using LocalMindAI.Api.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace LocalMindAI.Api.Services;

public sealed class MonitoringBroadcastWorker(IMonitoringService monitoring, IHubContext<WorkflowMonitoringHub> hub, ILogger<MonitoringBroadcastWorker> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using var timer = new PeriodicTimer(TimeSpan.FromSeconds(15));
        while (await timer.WaitForNextTickAsync(stoppingToken))
        {
            try { await hub.Clients.All.SendAsync("MonitoringUpdated", await monitoring.ReportAsync(stoppingToken), stoppingToken); }
            catch (Exception exception) { logger.LogWarning(exception, "Unable to broadcast monitoring metrics."); }
        }
    }
}
