using System.Collections.Concurrent;

namespace LocalMindAI.Api.Hubs;

public sealed class HubPresenceRegistry
{
    private readonly ConcurrentDictionary<string, PresenceConnection> _connections = new();

    public void Connected(string connectionId, string userId) => _connections[connectionId] = new PresenceConnection(connectionId, userId, DateTime.UtcNow);
    public void Disconnected(string connectionId) => _connections.TryRemove(connectionId, out _);
    public int ConnectionCount => _connections.Count;
    public int UserCount => _connections.Values.Select(item => item.UserId).Distinct(StringComparer.Ordinal).Count();
    public object Snapshot(string connectionId) => new { connectionId, activeConnections = ConnectionCount, activeUsers = UserCount, serverTime = DateTime.UtcNow };

    private sealed record PresenceConnection(string ConnectionId, string UserId, DateTime ConnectedAt);
}
