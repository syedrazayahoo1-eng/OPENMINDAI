using LocalMindAI.Api.Services.AI;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Options;

namespace LocalMindAI.Api.Services;

public interface IExternalServicesDiagnostics
{
    object GetReport();
}

public sealed class ExternalServicesDiagnostics(IConfiguration configuration, IOptions<AzureOpenAIOptions> azureOptions) : IExternalServicesDiagnostics
{
    public object GetReport()
    {
        var googleClientId = configuration["GoogleBusiness:ClientId"];
        var googleClientSecret = configuration["GoogleBusiness:ClientSecret"];
        var azure = azureOptions.Value;
        return new
        {
            generatedAt = DateTime.UtcNow,
            googleBusiness = new { configured = !string.IsNullOrWhiteSpace(googleClientId) && !string.IsNullOrWhiteSpace(googleClientSecret), clientIdConfigured = !string.IsNullOrWhiteSpace(googleClientId), clientSecretConfigured = !string.IsNullOrWhiteSpace(googleClientSecret) },
            azureOpenAi = new { configured = azure.IsConfigured, endpointConfigured = Uri.TryCreate(azure.Endpoint, UriKind.Absolute, out _), apiKeyConfigured = !string.IsNullOrWhiteSpace(azure.ApiKey), deploymentConfigured = !string.IsNullOrWhiteSpace(azure.DeploymentName), deployment = azure.DeploymentName },
            retry = new { maxAttempts = 3, retryableStatusCodes = new[] { 408, 429, 500, 501, 502, 503, 504 } }
        };
    }
}

public sealed class ExternalServicesHealthCheck(IExternalServicesDiagnostics diagnostics) : IHealthCheck
{
    public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        var report = diagnostics.GetReport();
        var json = System.Text.Json.JsonSerializer.SerializeToElement(report);
        var azureConfigured = json.GetProperty("azureOpenAi").GetProperty("configured").GetBoolean();
        var googleConfigured = json.GetProperty("googleBusiness").GetProperty("configured").GetBoolean();
        var data = new Dictionary<string, object> { ["azureOpenAiConfigured"] = azureConfigured, ["googleBusinessConfigured"] = googleConfigured };
        return Task.FromResult(azureConfigured ? HealthCheckResult.Healthy("External service configuration is valid.", data) : HealthCheckResult.Degraded("Azure OpenAI is not configured. Google Business remains optional until connected.", null, data));
    }
}
