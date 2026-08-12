using Azure.Identity;
using Azure.Storage.Blobs;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace LocalMindAI.Api.Services;

public sealed class RedisHealthCheck(IDistributedCache cache, IConfiguration configuration) : IHealthCheck
{
    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(configuration["Redis:ConnectionString"])) return HealthCheckResult.Degraded("Redis is not configured; in-memory cache is active.");
        try
        {
            await cache.GetAsync("health:redis", cancellationToken);
            return HealthCheckResult.Healthy("Redis is reachable.");
        }
        catch (Exception exception)
        {
            return HealthCheckResult.Unhealthy("Redis is unreachable.", exception);
        }
    }
}

public sealed class BlobStorageHealthCheck(IConfiguration configuration) : IHealthCheck
{
    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        if (!string.Equals(configuration["Storage:Provider"], "AzureBlob", StringComparison.OrdinalIgnoreCase)) return HealthCheckResult.Degraded("Local file storage is active.");
        try
        {
            var connectionString = configuration["Storage:AzureBlob:ConnectionString"];
            var serviceUri = configuration["Storage:AzureBlob:ServiceUri"];
            var client = !string.IsNullOrWhiteSpace(connectionString)
                ? new BlobServiceClient(connectionString)
                : Uri.TryCreate(serviceUri, UriKind.Absolute, out var uri)
                    ? new BlobServiceClient(uri, new DefaultAzureCredential())
                    : throw new InvalidOperationException("Azure Blob storage configuration is incomplete.");
            await client.GetAccountInfoAsync(cancellationToken: cancellationToken);
            return HealthCheckResult.Healthy("Azure Blob Storage is reachable.");
        }
        catch (Exception exception)
        {
            return HealthCheckResult.Unhealthy("Azure Blob Storage is unreachable.", exception);
        }
    }
}
