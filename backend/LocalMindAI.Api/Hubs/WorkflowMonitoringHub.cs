using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace LocalMindAI.Api.Hubs;

[Authorize]
public class WorkflowMonitoringHub(HubPresenceRegistry presence, ILogger<WorkflowMonitoringHub> logger) : Hub
{
    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier) ?? Context.UserIdentifier ?? "unknown";
        presence.Connected(Context.ConnectionId, userId);
        logger.LogInformation("SignalR client {ConnectionId} connected for user {UserId}.", Context.ConnectionId, userId);
        await Clients.Caller.SendAsync("ConnectionDiagnostics", presence.Snapshot(Context.ConnectionId));
        await Clients.All.SendAsync("PresenceChanged", new { activeConnections = presence.ConnectionCount, activeUsers = presence.UserCount, serverTime = DateTime.UtcNow });
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        presence.Disconnected(Context.ConnectionId);
        logger.LogInformation(exception, "SignalR client {ConnectionId} disconnected.", Context.ConnectionId);
        await Clients.All.SendAsync("PresenceChanged", new { activeConnections = presence.ConnectionCount, activeUsers = presence.UserCount, serverTime = DateTime.UtcNow });
        await base.OnDisconnectedAsync(exception);
    }

    public object GetConnectionDiagnostics() => presence.Snapshot(Context.ConnectionId);
}
