using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace LocalMindAI.Api.Hubs;

[Authorize]
public class WorkflowMonitoringHub : Hub
{
}
