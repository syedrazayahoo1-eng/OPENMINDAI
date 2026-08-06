using LocalMindAI.Api.Data;
using LocalMindAI.Api.Hubs;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace LocalMindAI.Api.Services;

public sealed class DatabaseHealthCheck(ApplicationDbContext database) : IHealthCheck
{
    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        try
        {
            var connected = await database.Database.CanConnectAsync(cancellationToken);
            return connected ? HealthCheckResult.Healthy("Database is reachable.") : HealthCheckResult.Unhealthy("Database is unreachable.");
        }
        catch (Exception exception)
        {
            return HealthCheckResult.Unhealthy("Database connectivity failed.", exception);
        }
    }
}

public sealed class PlatformDependenciesHealthCheck(IExternalServicesDiagnostics diagnostics, IConfiguration configuration, HubPresenceRegistry presence) : IHealthCheck
{
    public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        var report = diagnostics.GetReport();
        var json = System.Text.Json.JsonSerializer.SerializeToElement(report);
        var azureConfigured = json.GetProperty("azureOpenAi").GetProperty("configured").GetBoolean();
        var googleConfigured = json.GetProperty("googleBusiness").GetProperty("configured").GetBoolean();
        var smtpConfigured = !string.IsNullOrWhiteSpace(configuration["WorkflowExecution:Smtp:Host"]) && !string.IsNullOrWhiteSpace(configuration["WorkflowExecution:Smtp:From"]);
        var teamsConfigured = !string.IsNullOrWhiteSpace(configuration["WorkflowExecution:Teams:WebhookUrl"]);
        var data = new Dictionary<string, object> { ["signalR"] = "ready", ["signalRConnections"] = presence.ConnectionCount, ["azureOpenAi"] = azureConfigured ? "configured" : "not-configured", ["googleBusiness"] = googleConfigured ? "configured" : "not-configured", ["smtp"] = smtpConfigured ? "configured" : "not-configured", ["teams"] = teamsConfigured ? "configured" : "not-configured" };
        return Task.FromResult(azureConfigured ? HealthCheckResult.Healthy("Platform dependencies are ready.", data) : HealthCheckResult.Degraded("One or more optional external integrations are not configured.", null, data));
    }
}
