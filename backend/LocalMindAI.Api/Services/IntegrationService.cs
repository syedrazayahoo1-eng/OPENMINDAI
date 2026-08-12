using System.Net.Sockets;
using System.Text.Json;
using Azure.Storage.Blobs;
using LocalMindAI.Api.Data;
using LocalMindAI.Api.DTOs;
using LocalMindAI.Api.Models;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;

namespace LocalMindAI.Api.Services;

public sealed class IntegrationService(ApplicationDbContext context, IDataProtectionProvider protectionProvider, IHttpClientFactory httpClientFactory) : IIntegrationService
{
    private readonly IDataProtector _protector = protectionProvider.CreateProtector("DIGITECH.Integrations.v1");
    private static readonly HashSet<string> Providers = ["azure-openai", "smtp", "teams", "whatsapp", "blob", "redis"];
    private static readonly HashSet<string> SensitiveKeys = ["ApiKey", "ApiSecret", "Password", "ConnectionString", "WebhookUrl", "AccessToken"];

    public async Task<IntegrationDto> GetAsync(string provider, CancellationToken cancellationToken = default)
    {
        EnsureProvider(provider);
        var item = await context.IntegrationConfigurations.AsNoTracking().SingleOrDefaultAsync(config => config.Provider == provider, cancellationToken);
        return item is null ? new IntegrationDto { Provider = provider } : Map(item);
    }

    public async Task<IntegrationDto> SaveAsync(string provider, SaveIntegrationDto input, CancellationToken cancellationToken = default)
    {
        EnsureProvider(provider);
        var item = await context.IntegrationConfigurations.SingleOrDefaultAsync(config => config.Provider == provider, cancellationToken);
        var existing = item is null ? new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) : Decrypt(item.EncryptedConfiguration);
        foreach (var setting in input.Settings.Where(pair => !string.IsNullOrWhiteSpace(pair.Value))) existing[setting.Key] = setting.Value.Trim();
        if (item is null) { item = new IntegrationConfiguration { Provider = provider }; context.IntegrationConfigurations.Add(item); }
        item.EncryptedConfiguration = _protector.Protect(JsonSerializer.Serialize(existing));
        item.PublicConfiguration = JsonSerializer.Serialize(existing.Where(pair => !SensitiveKeys.Contains(pair.Key)).ToDictionary(pair => pair.Key, pair => pair.Value));
        item.Status = "Disconnected";
        item.UpdatedAt = DateTime.UtcNow;
        await context.SaveChangesAsync(cancellationToken);
        return Map(item);
    }

    public async Task<IntegrationTestDto> TestAsync(string provider, CancellationToken cancellationToken = default)
    {
        EnsureProvider(provider);
        var item = await context.IntegrationConfigurations.SingleOrDefaultAsync(config => config.Provider == provider, cancellationToken) ?? throw new InvalidOperationException("Save the provider configuration before testing it.");
        var settings = Decrypt(item.EncryptedConfiguration);
        var result = await TestProviderAsync(provider, settings, cancellationToken);
        item.Status = result.Succeeded ? "Connected" : "Error";
        item.LastTestMessage = result.Message;
        item.LastTestedAt = result.TestedAt;
        await context.SaveChangesAsync(cancellationToken);
        return result;
    }

    public async Task<IntegrationDto> GetGoogleBusinessAsync(CancellationToken cancellationToken = default)
    {
        var account = await context.GoogleBusinessAccounts.AsNoTracking().OrderByDescending(item => item.ConnectedAt).FirstOrDefaultAsync(cancellationToken);
        return new IntegrationDto { Provider = "google-business", Status = account is null ? "Disconnected" : "Connected", LastTestedAt = account?.ConnectedAt, LastTestMessage = account is null ? "No Google Business account is connected." : $"Connected as {account.Email}", Settings = account is null ? [] : new Dictionary<string, string> { ["AccountEmail"] = account.Email } };
    }

    public async Task<IntegrationTestDto> ReconnectGoogleBusinessAsync(CancellationToken cancellationToken = default)
    {
        var integration = await GetGoogleBusinessAsync(cancellationToken);
        return new IntegrationTestDto { Succeeded = integration.Status == "Connected", Message = integration.LastTestMessage ?? "Google Business connection was not found.", TestedAt = DateTime.UtcNow };
    }

    private async Task<IntegrationTestDto> TestProviderAsync(string provider, Dictionary<string, string> settings, CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        try
        {
            switch (provider)
            {
                case "smtp": await ConnectTcpAsync(Required(settings, "Host"), int.Parse(settings.GetValueOrDefault("Port", "587")), cancellationToken); break;
                case "redis": await ConnectTcpAsync(ParseHost(Required(settings, "ConnectionString")), ParsePort(Required(settings, "ConnectionString")), cancellationToken); break;
                case "blob": await new BlobContainerClient(Required(settings, "ConnectionString"), Required(settings, "Container")).ExistsAsync(cancellationToken); break;
                default:
                    var url = provider == "azure-openai" ? Required(settings, "Endpoint").TrimEnd('/') + "/openai/models?api-version=" + settings.GetValueOrDefault("ApiVersion", "2024-10-21") : Required(settings, provider == "teams" ? "WebhookUrl" : "Endpoint");
                    if (!Uri.TryCreate(url, UriKind.Absolute, out var uri) || uri.Scheme != Uri.UriSchemeHttps) throw new InvalidOperationException("A valid HTTPS endpoint is required.");
                    using (var request = new HttpRequestMessage(HttpMethod.Get, uri))
                    {
                        if (settings.TryGetValue("ApiKey", out var apiKey)) request.Headers.TryAddWithoutValidation("api-key", apiKey);
                        if (settings.TryGetValue("AccessToken", out var token)) request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
                        using var response = await httpClientFactory.CreateClient("ExternalServices").SendAsync(request, cancellationToken);
                        if ((int)response.StatusCode >= 500) throw new InvalidOperationException($"Provider returned HTTP {(int)response.StatusCode}.");
                    }
                    break;
            }
            return new IntegrationTestDto { Succeeded = true, Message = "Connection test completed successfully.", TestedAt = now };
        }
        catch (Exception exception) { return new IntegrationTestDto { Succeeded = false, Message = exception.Message, TestedAt = now }; }
    }
    private static async Task ConnectTcpAsync(string host, int port, CancellationToken token) { using var client = new TcpClient(); await client.ConnectAsync(host, port, token); }
    private Dictionary<string, string> Decrypt(string configuration) => string.IsNullOrWhiteSpace(configuration) ? [] : JsonSerializer.Deserialize<Dictionary<string, string>>(_protector.Unprotect(configuration)) ?? [];
    private static IntegrationDto Map(IntegrationConfiguration item) => new() { Provider = item.Provider, Settings = JsonSerializer.Deserialize<Dictionary<string, string>>(item.PublicConfiguration) ?? [], Status = item.Status, LastTestMessage = item.LastTestMessage, LastTestedAt = item.LastTestedAt };
    private static string Required(Dictionary<string, string> settings, string key) => settings.TryGetValue(key, out var value) && !string.IsNullOrWhiteSpace(value) ? value : throw new InvalidOperationException($"{key} is required.");
    private static string ParseHost(string connection) => connection.Split(',')[0].Split('=')[0].Trim(); private static int ParsePort(string connection) => int.TryParse(connection.Split(',').Skip(1).FirstOrDefault()?.Split('=')[0], out var port) ? port : 6379;
    private static void EnsureProvider(string provider) { if (!Providers.Contains(provider)) throw new InvalidOperationException("Unsupported integration provider."); }
}
