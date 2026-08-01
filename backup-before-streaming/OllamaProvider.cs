using System.Diagnostics;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace LocalMindAI.Api.Services.AI;

/// <summary>
/// Strongly-typed options bound from the "Ollama" section of appsettings.
/// </summary>
/// <example>
/// {
///   "Ollama": {
///     "BaseUrl": "http://127.0.0.1:11434",
///     "DefaultModel": "llama3.2:latest",
///     "TimeoutSeconds": 600
///   }
/// }
/// </example>
public sealed class OllamaOptions
{
    public const string SectionName = "Ollama";

    /// <summary>Base URL of the local/remote Ollama server.</summary>
    public string BaseUrl { get; set; } = "http://127.0.0.1:11434";

    /// <summary>Model used when the request does not specify one.</summary>
    public string DefaultModel { get; set; } = "llama3.2:latest";

    /// <summary>HTTP request timeout, in seconds. Local model inference can be slow, so this defaults high.</summary>
    public int TimeoutSeconds { get; set; } = 600;

    /// <summary>
    /// True when the minimum configuration required to call the service is present.
    /// </summary>
    public bool IsConfigured =>
        !string.IsNullOrWhiteSpace(BaseUrl) &&
        !string.IsNullOrWhiteSpace(DefaultModel);
}

/// <summary>
/// <see cref="IAIProvider"/> implementation backed by a locally or remotely hosted
/// Ollama server, using its "/api/chat" endpoint. Configuration is read from the
/// "Ollama" section of appsettings via <see cref="IConfiguration"/>.
/// </summary>
public sealed class OllamaProvider : IAIProvider
{
    private readonly HttpClient _httpClient;
    private readonly OllamaOptions _options;
    private readonly ILogger<OllamaProvider> _logger;

    public AIProviderType ProviderType => AIProviderType.Ollama;
    public string ProviderName => "Ollama";

    /// <summary>
    /// Creates the provider, binding configuration from the "Ollama" section.
    /// </summary>
    public OllamaProvider(IConfiguration configuration, ILogger<OllamaProvider> logger)
    {
        _logger = logger;

        _options = new OllamaOptions();
        configuration.GetSection(OllamaOptions.SectionName).Bind(_options);

        _httpClient = new HttpClient
        {
            BaseAddress = new Uri(_options.BaseUrl),
            Timeout = TimeSpan.FromSeconds(_options.TimeoutSeconds > 0 ? _options.TimeoutSeconds : 600)
        };
    }

    /// <summary>
    /// Test-friendly constructor allowing an externally managed <see cref="HttpClient"/>
    /// (e.g. from <c>IHttpClientFactory</c>) to be supplied instead of one owned by this instance.
    /// </summary>
    public OllamaProvider(HttpClient httpClient, IConfiguration configuration, ILogger<OllamaProvider> logger)
    {
        _logger = logger;
        _httpClient = httpClient;

        _options = new OllamaOptions();
        configuration.GetSection(OllamaOptions.SectionName).Bind(_options);

        if (_httpClient.BaseAddress is null && !string.IsNullOrWhiteSpace(_options.BaseUrl))
        {
            _httpClient.BaseAddress = new Uri(_options.BaseUrl);
        }
    }

    public async Task<AIResponse> GenerateAsync(AIRequest request, CancellationToken cancellationToken = default)
    {
        var stopwatch = Stopwatch.StartNew();

        if (!_options.IsConfigured)
        {
            const string message = "Ollama provider is not configured. " +
                "Ensure BaseUrl and DefaultModel are set under the 'Ollama' appsettings section.";
            _logger.LogError(message);
            return AIResponse.Failure(ProviderName, message, stopwatch.ElapsedMilliseconds);
        }

        var model = string.IsNullOrWhiteSpace(request.Model) ? _options.DefaultModel : request.Model;

        try
        {
            var payload = new OllamaChatRequest
            {
                Model = model,
                Messages = BuildMessages(request),
                Stream = false,
                Options = new OllamaChatOptions
                {
                    Temperature = request.Temperature,
                    TopP = request.TopP,
                    NumPredict = request.MaxTokens
                }
            };

            using var httpResponse = await _httpClient
                .PostAsJsonAsync("/api/chat", payload, JsonOptions, cancellationToken)
                .ConfigureAwait(false);

            var rawBody = await httpResponse.Content.ReadAsStringAsync(cancellationToken).ConfigureAwait(false);

            if (!httpResponse.IsSuccessStatusCode)
            {
                var errorMessage = $"Ollama request failed with status {(int)httpResponse.StatusCode} ({httpResponse.StatusCode}): {rawBody}";
                _logger.LogError("{ProviderName} error for correlation {CorrelationId}: {Error}",
                    ProviderName, request.CorrelationId, errorMessage);
                return AIResponse.Failure(ProviderName, errorMessage, stopwatch.ElapsedMilliseconds);
            }

            var parsed = JsonSerializer.Deserialize<OllamaChatResponse>(rawBody, JsonOptions);

            var content = parsed?.Message?.Content;
            if (string.IsNullOrEmpty(content))
            {
                const string message = "Ollama response did not contain any completion content.";
                _logger.LogWarning(message);
                return AIResponse.Failure(ProviderName, message, stopwatch.ElapsedMilliseconds);
            }

            stopwatch.Stop();

            return AIResponse.Success(
                ProviderName,
                content,
                model: parsed?.Model ?? model,
                promptTokens: parsed?.PromptEvalCount,
                completionTokens: parsed?.EvalCount,
                totalTokens: (parsed?.PromptEvalCount ?? 0) + (parsed?.EvalCount ?? 0) is var total && total > 0 ? total : null,
                durationMs: stopwatch.ElapsedMilliseconds);
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error calling Ollama for correlation {CorrelationId}", request.CorrelationId);
            return AIResponse.Failure(ProviderName, $"Unexpected error: {ex.Message}", stopwatch.ElapsedMilliseconds);
        }
    }

    public async Task<bool> IsAvailableAsync(CancellationToken cancellationToken = default)
    {
        if (!_options.IsConfigured)
        {
            return false;
        }

        try
        {
            using var response = await _httpClient
                .GetAsync("/api/tags", cancellationToken)
                .ConfigureAwait(false);

            return response.IsSuccessStatusCode;
        }
        catch
        {
            return false;
        }
    }

    private static List<OllamaChatMessage> BuildMessages(AIRequest request)
    {
        var messages = new List<OllamaChatMessage>();

        if (!string.IsNullOrWhiteSpace(request.SystemPrompt))
        {
            messages.Add(new OllamaChatMessage { Role = "system", Content = request.SystemPrompt });
        }

        if (request.History is not null)
        {
            foreach (var turn in request.History)
            {
                messages.Add(new OllamaChatMessage { Role = turn.Role, Content = turn.Content });
            }
        }

        messages.Add(new OllamaChatMessage { Role = "user", Content = request.Prompt });

        return messages;
    }

    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    private sealed class OllamaChatRequest
    {
        [JsonPropertyName("model")]
        public required string Model { get; init; }

        [JsonPropertyName("messages")]
        public required List<OllamaChatMessage> Messages { get; init; }

        [JsonPropertyName("stream")]
        public bool Stream { get; init; }

        [JsonPropertyName("options")]
        public OllamaChatOptions? Options { get; init; }
    }

    private sealed class OllamaChatMessage
    {
        [JsonPropertyName("role")]
        public required string Role { get; init; }

        [JsonPropertyName("content")]
        public required string Content { get; init; }
    }

    private sealed class OllamaChatOptions
    {
        [JsonPropertyName("temperature")]
        public double Temperature { get; init; }

        [JsonPropertyName("top_p")]
        public double? TopP { get; init; }

        [JsonPropertyName("num_predict")]
        public int NumPredict { get; init; }
    }

    private sealed class OllamaChatResponse
    {
        [JsonPropertyName("model")]
        public string? Model { get; init; }

        [JsonPropertyName("message")]
        public OllamaChatMessage? Message { get; init; }

        [JsonPropertyName("prompt_eval_count")]
        public int? PromptEvalCount { get; init; }

        [JsonPropertyName("eval_count")]
        public int? EvalCount { get; init; }
    }
}
