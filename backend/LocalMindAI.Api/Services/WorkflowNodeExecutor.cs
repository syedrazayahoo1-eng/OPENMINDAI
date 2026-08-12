using System.Data;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Text.Json;
using LocalMindAI.Api.Data;
using LocalMindAI.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LocalMindAI.Api.Services;

public sealed class WorkflowNodeExecutor(ApplicationDbContext context, AIService aiService, IGoogleBusinessPostPublisher postPublisher, IHttpClientFactory httpClientFactory, IConfiguration configuration, ILogger<WorkflowNodeExecutor> logger) : IWorkflowNodeExecutor
{
    public async Task<WorkflowNodeExecutionResult> ExecuteAsync(string nodeType, string stepName, JsonElement properties, string input, CancellationToken cancellationToken = default)
    {
        if (nodeType == "AI" || string.Equals(stepName, "Azure AI", StringComparison.OrdinalIgnoreCase))
            return await ExecuteAzureAiAsync(properties, input);

        return stepName switch
        {
            "Send Email" or "Email" => await SendEmailAsync(properties, input, cancellationToken),
            "Send Teams Message" or "Teams" => await SendTeamsMessageAsync(properties, input, cancellationToken),
            "Webhook" or "HTTP Request" => await SendHttpRequestAsync(properties, input, cancellationToken),
            "Database" or "Database Query" => await ExecuteDatabaseQueryAsync(properties, cancellationToken),
            "Publish Google Business Post" => await PublishGoogleBusinessPostAsync(properties, cancellationToken),
            _ => throw new InvalidOperationException($"No executor is registered for workflow node '{stepName}'.")
        };
    }

    private async Task<WorkflowNodeExecutionResult> ExecuteAzureAiAsync(JsonElement properties, string input)
    {
        var prompt = GetString(properties, "prompt");
        var output = await aiService.AskAI(string.IsNullOrWhiteSpace(prompt) ? input : $"{prompt}\n\nWorkflow context:\n{input}");
        return new WorkflowNodeExecutionResult($"Azure AI generated {output.Length} characters.", output);
    }

    private async Task<WorkflowNodeExecutionResult> SendEmailAsync(JsonElement properties, string input, CancellationToken cancellationToken)
    {
        var recipient = GetRequiredString(properties, "emailAddress");
        var host = GetRequiredSetting("WorkflowExecution:Smtp:Host");
        var sender = GetRequiredSetting("WorkflowExecution:Smtp:From");
        var port = configuration.GetValue("WorkflowExecution:Smtp:Port", 587);
        var username = configuration["WorkflowExecution:Smtp:Username"];
        var password = configuration["WorkflowExecution:Smtp:Password"];
        var subject = GetString(properties, "subject") ?? GetString(properties, "name") ?? "DIGITECH workflow notification";
        var body = GetString(properties, "body") ?? input;

        using var client = new SmtpClient(host, port) { EnableSsl = configuration.GetValue("WorkflowExecution:Smtp:EnableSsl", true) };
        if (!string.IsNullOrWhiteSpace(username)) client.Credentials = new NetworkCredential(username, password);
        using var message = new MailMessage(sender, recipient, subject, body) { IsBodyHtml = false };
        await client.SendMailAsync(message, cancellationToken);
        return new WorkflowNodeExecutionResult($"SMTP email delivered to {recipient}.");
    }

    private async Task<WorkflowNodeExecutionResult> SendTeamsMessageAsync(JsonElement properties, string input, CancellationToken cancellationToken)
    {
        var url = GetString(properties, "teamsWebhookUrl") ?? GetString(properties, "teamsChannel") ?? configuration["WorkflowExecution:Teams:WebhookUrl"];
        if (string.IsNullOrWhiteSpace(url)) throw new InvalidOperationException("Teams execution requires a teamsWebhookUrl node property or WorkflowExecution:Teams:WebhookUrl configuration.");
        ValidateOutboundUrl(url);
        var response = await httpClientFactory.CreateClient().PostAsync(url, JsonContent.Create(new { text = input }), cancellationToken);
        response.EnsureSuccessStatusCode();
        return new WorkflowNodeExecutionResult("Microsoft Teams message delivered.");
    }

    private async Task<WorkflowNodeExecutionResult> SendHttpRequestAsync(JsonElement properties, string input, CancellationToken cancellationToken)
    {
        var url = GetString(properties, "httpUrl") ?? GetString(properties, "webhookUrl") ?? GetRequiredString(properties, "url");
        ValidateOutboundUrl(url);
        var method = GetString(properties, "httpMethod") ?? "POST";
        using var request = new HttpRequestMessage(new HttpMethod(method.ToUpperInvariant()), url);
        if (request.Method != HttpMethod.Get && request.Method != HttpMethod.Head)
            request.Content = JsonContent.Create(new { input });
        var response = await httpClientFactory.CreateClient().SendAsync(request, cancellationToken);
        var responseBody = await response.Content.ReadAsStringAsync(cancellationToken);
        response.EnsureSuccessStatusCode();
        return new WorkflowNodeExecutionResult($"HTTP {method.ToUpperInvariant()} completed with {(int)response.StatusCode}.", Truncate(responseBody, 4000));
    }

    private async Task<WorkflowNodeExecutionResult> ExecuteDatabaseQueryAsync(JsonElement properties, CancellationToken cancellationToken)
    {
        var query = GetString(properties, "query") ?? GetString(properties, "databaseTarget") ?? throw new InvalidOperationException("Database execution requires a read-only SQL query in the query or databaseTarget node property.");
        if (!IsReadOnlySelect(query)) throw new InvalidOperationException("Database workflow execution accepts a single read-only SELECT statement only.");

        var connection = context.Database.GetDbConnection();
        var wasClosed = connection.State != ConnectionState.Open;
        if (wasClosed) await connection.OpenAsync(cancellationToken);
        try
        {
            await using var command = connection.CreateCommand();
            command.CommandText = query;
            command.CommandTimeout = configuration.GetValue("WorkflowExecution:DatabaseCommandTimeoutSeconds", 30);
            await using var reader = await command.ExecuteReaderAsync(cancellationToken);
            var rows = new List<Dictionary<string, object?>>();
            while (await reader.ReadAsync(cancellationToken) && rows.Count < 100)
            {
                var row = new Dictionary<string, object?>();
                for (var index = 0; index < reader.FieldCount; index++) row[reader.GetName(index)] = await reader.IsDBNullAsync(index, cancellationToken) ? null : reader.GetValue(index);
                rows.Add(row);
            }
            return new WorkflowNodeExecutionResult($"Database query completed with {rows.Count} row(s).", JsonSerializer.Serialize(rows));
        }
        finally
        {
            if (wasClosed) await connection.CloseAsync();
        }
    }

    private async Task<WorkflowNodeExecutionResult> PublishGoogleBusinessPostAsync(JsonElement properties, CancellationToken cancellationToken)
    {
        if (!properties.TryGetProperty("postId", out var postIdValue) || !postIdValue.TryGetInt32(out var postId))
            throw new InvalidOperationException("Publish Google Business Post requires a numeric postId node property.");
        var result = await postPublisher.PublishAsync(postId, cancellationToken: cancellationToken);
        if (!result.Succeeded) throw new InvalidOperationException(result.ErrorMessage);
        return new WorkflowNodeExecutionResult($"Google Business post #{postId} published.");
    }

    private void ValidateOutboundUrl(string url)
    {
        if (!Uri.TryCreate(url, UriKind.Absolute, out var uri) || uri.Scheme != Uri.UriSchemeHttps)
            throw new InvalidOperationException("Outbound workflow URLs must use HTTPS.");
        if (uri.IsLoopback || IPAddress.TryParse(uri.Host, out var address) && IsPrivateAddress(address))
        {
            logger.LogWarning("Blocked unsafe outbound workflow URL host {Host}.", uri.Host);
            throw new InvalidOperationException("Outbound workflow URL targets a prohibited host.");
        }
        if (uri.Port != 443 && !configuration.GetSection("WorkflowExecution:AllowedHttpPorts").Get<int[]>().Contains(uri.Port))
        {
            logger.LogWarning("Blocked outbound workflow URL port {Port} for host {Host}.", uri.Port, uri.Host);
            throw new InvalidOperationException("Outbound workflow URL port is not allow-listed.");
        }
        var allowedHosts = configuration.GetSection("WorkflowExecution:AllowedHttpHosts").Get<string[]>() ?? [];
        if (allowedHosts.Length == 0 || !allowedHosts.Contains(uri.Host, StringComparer.OrdinalIgnoreCase))
            throw new InvalidOperationException($"Outbound host '{uri.Host}' is not allow-listed in WorkflowExecution:AllowedHttpHosts.");
    }
    private static bool IsPrivateAddress(IPAddress address) { var bytes = address.MapToIPv4().GetAddressBytes(); return bytes[0] == 10 || bytes[0] == 127 || bytes[0] == 0 || bytes[0] == 169 && bytes[1] == 254 || bytes[0] == 192 && bytes[1] == 168 || bytes[0] == 172 && bytes[1] is >= 16 and <= 31; }

    private string GetRequiredSetting(string key) => configuration[key] ?? throw new InvalidOperationException($"Missing required configuration '{key}'.");
    private static string GetRequiredString(JsonElement properties, string name) => GetString(properties, name) ?? throw new InvalidOperationException($"Node property '{name}' is required.");
    private static string? GetString(JsonElement properties, string name) => properties.TryGetProperty(name, out var value) && value.ValueKind == JsonValueKind.String ? value.GetString()?.Trim() : null;
    private static bool IsReadOnlySelect(string value) { var statement = value.Trim(); return statement.StartsWith("SELECT", StringComparison.OrdinalIgnoreCase) && !statement.Contains(';') && !statement.Contains("--") && !statement.Contains("/*"); }
    private static string Truncate(string value, int maxLength) => value.Length <= maxLength ? value : value[..maxLength];
}
