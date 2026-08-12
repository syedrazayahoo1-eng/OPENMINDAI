using System.ClientModel;
using System.Diagnostics;
using System.Runtime.CompilerServices;
using System.Text;
using Microsoft.Extensions.Options;
using OpenAI;
using OpenAI.Chat;

namespace LocalMindAI.Api.Services.AI;

public sealed class AzureOpenAIOptions
{
    public const string SectionName = "AzureOpenAI";

    public string Endpoint { get; set; } = string.Empty;
    public string ApiKey { get; set; } = string.Empty;
    public string DeploymentName { get; set; } = string.Empty;

    public bool IsConfigured =>
        Uri.TryCreate(Endpoint, UriKind.Absolute, out _) &&
        !string.IsNullOrWhiteSpace(ApiKey) &&
        !string.IsNullOrWhiteSpace(DeploymentName);
}

public sealed class AzureOpenAIProvider : IAIProvider
{
    private readonly AzureOpenAIOptions _options;
    private readonly ILogger<AzureOpenAIProvider> _logger;
    private readonly ChatClient? _chatClient;

    public AzureOpenAIProvider(
        IOptions<AzureOpenAIOptions> options,
        ILogger<AzureOpenAIProvider> logger)
    {
        ArgumentNullException.ThrowIfNull(options);
        ArgumentNullException.ThrowIfNull(logger);

        _options = options.Value;
        _logger = logger;

        if (!_options.IsConfigured)
        {
            return;
        }

        var endpoint = new Uri($"{_options.Endpoint.TrimEnd('/')}/openai/v1/");
        var client = new OpenAIClient(
            new ApiKeyCredential(_options.ApiKey),
            new OpenAIClientOptions { Endpoint = endpoint });

        _chatClient = client.GetChatClient(_options.DeploymentName);
    }

    public AIProviderType ProviderType => AIProviderType.AzureOpenAI;

    public string ProviderName => nameof(AIProviderType.AzureOpenAI);

    public async Task<AIResponse> GenerateAsync(
        AIRequest request,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        var stopwatch = Stopwatch.StartNew();

        if (_chatClient is null)
        {
            return AIResponse.Failure(
                ProviderName,
                "Azure OpenAI is not configured. Endpoint, ApiKey, and DeploymentName are required.",
                stopwatch.ElapsedMilliseconds);
        }

        try
        {
            ClientResult<ChatCompletion>? completion = null;
            for (var attempt = 1; attempt <= 3; attempt++)
            {
                try
                {
                    completion = await _chatClient.CompleteChatAsync(BuildMessages(request), BuildOptions(request), cancellationToken).ConfigureAwait(false);
                    break;
                }
                catch (ClientResultException exception) when (attempt < 3 && (exception.Status == 429 || exception.Status >= 500))
                {
                    var delay = TimeSpan.FromMilliseconds(250 * Math.Pow(2, attempt - 1));
                    _logger.LogWarning(exception, "Azure OpenAI request for deployment {DeploymentName} failed on attempt {Attempt}; retrying in {DelayMs} ms.", _options.DeploymentName, attempt, delay.TotalMilliseconds);
                    await Task.Delay(delay, cancellationToken);
                }
            }

            if (completion is null) throw new InvalidOperationException("Azure OpenAI retry attempts completed without a response.");

            var content = new StringBuilder();

            foreach (ChatMessageContentPart part in completion.Value.Content)
            {
                if (!string.IsNullOrEmpty(part.Text))
                {
                    content.Append(part.Text);
                }
            }

            if (content.Length == 0)
            {
                return AIResponse.Failure(
                    ProviderName,
                    "Azure OpenAI returned an empty response.",
                    stopwatch.ElapsedMilliseconds);
            }

            ChatTokenUsage? usage = completion.Value.Usage;

            return AIResponse.Success(
                providerName: ProviderName,
                content: content.ToString(),
                model: _options.DeploymentName,
                promptTokens: usage?.InputTokenCount,
                completionTokens: usage?.OutputTokenCount,
                totalTokens: usage?.TotalTokenCount,
                durationMs: stopwatch.ElapsedMilliseconds);
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            throw;
        }
        catch (ClientResultException exception)
        {
            stopwatch.Stop();
            string message = MapError(exception);

            _logger.LogError(
                exception,
                "Azure OpenAI request failed for deployment {DeploymentName} with status {Status}.",
                _options.DeploymentName,
                exception.Status);

            return AIResponse.Failure(ProviderName, message, stopwatch.ElapsedMilliseconds);
        }
        catch (Exception exception)
        {
            stopwatch.Stop();

            _logger.LogError(
                exception,
                "Unexpected Azure OpenAI failure for deployment {DeploymentName}.",
                _options.DeploymentName);

            return AIResponse.Failure(
                ProviderName,
                exception.Message,
                stopwatch.ElapsedMilliseconds);
        }
    }

    public async IAsyncEnumerable<string> StreamAsync(
        AIRequest request,
        [EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        if (_chatClient is null)
        {
            throw new InvalidOperationException(
                "Azure OpenAI is not configured. Endpoint, ApiKey, and DeploymentName are required.");
        }

        AsyncCollectionResult<StreamingChatCompletionUpdate> updates =
            _chatClient.CompleteChatStreamingAsync(
                BuildMessages(request),
                BuildOptions(request),
                cancellationToken);

        await foreach (StreamingChatCompletionUpdate update in
            updates.WithCancellation(cancellationToken).ConfigureAwait(false))
        {
            foreach (ChatMessageContentPart part in update.ContentUpdate)
            {
                if (!string.IsNullOrEmpty(part.Text))
                {
                    yield return part.Text;
                }
            }
        }
    }

    public Task<bool> IsAvailableAsync(CancellationToken cancellationToken = default)
    {
        return Task.FromResult(_chatClient is not null);
    }

    private static ChatCompletionOptions BuildOptions(AIRequest request)
    {
        return new ChatCompletionOptions
        {
            MaxOutputTokenCount = request.MaxTokens
        };
    }

    private static List<ChatMessage> BuildMessages(AIRequest request)
    {
        var messages = new List<ChatMessage>();

        if (!string.IsNullOrWhiteSpace(request.SystemPrompt))
        {
            messages.Add(new SystemChatMessage(request.SystemPrompt));
        }

        if (request.History is not null)
        {
            foreach (AIChatMessage message in request.History)
            {
                messages.Add(message.Role.ToLowerInvariant() switch
                {
                    "assistant" => new AssistantChatMessage(message.Content),
                    "system" => new SystemChatMessage(message.Content),
                    _ => new UserChatMessage(message.Content)
                });
            }
        }

        messages.Add(new UserChatMessage(request.Prompt));
        return messages;
    }

    private static string MapError(ClientResultException exception)
    {
        return exception.Status switch
        {
            400 => $"Azure OpenAI rejected the request: {exception.Message}",
            401 => "Azure OpenAI authentication failed. Check the API key.",
            403 => "Azure OpenAI access was denied.",
            404 => "Azure OpenAI endpoint or deployment was not found.",
            429 => "Azure OpenAI quota was exceeded or the request was rate limited.",
            >= 500 => "Azure OpenAI returned a server error.",
            _ => exception.Message
        };
    }
}
