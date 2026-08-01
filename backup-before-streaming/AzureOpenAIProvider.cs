using System.ClientModel;
using System.Diagnostics;
using Azure;
using Azure.AI.OpenAI;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using OpenAI.Chat;

namespace LocalMindAI.Api.Services.AI;

public sealed class AzureOpenAIOptions
{
    public const string SectionName = "AzureOpenAI";

    public string Endpoint { get; set; } = string.Empty;
    public string ApiKey { get; set; } = string.Empty;
    public string DeploymentName { get; set; } = string.Empty;

    public bool IsConfigured =>
        !string.IsNullOrWhiteSpace(Endpoint) &&
        !string.IsNullOrWhiteSpace(ApiKey) &&
        !string.IsNullOrWhiteSpace(DeploymentName);
}

public sealed class AzureOpenAIProvider : IAIProvider
{
    private readonly AzureOpenAIOptions _options;
    private readonly ILogger<AzureOpenAIProvider> _logger;

    private readonly ChatClient? _chatClient;

    public AIProviderType ProviderType => AIProviderType.AzureOpenAI;

    public string ProviderName => "AzureOpenAI";

    public AzureOpenAIProvider(
        IConfiguration configuration,
        ILogger<AzureOpenAIProvider> logger)
    {
        _logger = logger;

        _options = new AzureOpenAIOptions();

        configuration
            .GetSection(AzureOpenAIOptions.SectionName)
            .Bind(_options);

        if (_options.IsConfigured)
        {
            var endpoint = new Uri(_options.Endpoint);

            var credential = new AzureKeyCredential(_options.ApiKey);

            var client = new AzureOpenAIClient(
                endpoint,
                credential);

            _chatClient = client.GetChatClient(
                _options.DeploymentName);
        }
    }

    public AzureOpenAIProvider(
        HttpClient _,
        IConfiguration configuration,
        ILogger<AzureOpenAIProvider> logger)
        : this(configuration, logger)
    {
    }

    public async Task<AIResponse> GenerateAsync(
        AIRequest request,
        CancellationToken cancellationToken = default)
    {
        var stopwatch = Stopwatch.StartNew();

        if (!_options.IsConfigured || _chatClient == null)
        {
            return AIResponse.Failure(
                ProviderName,
                "Azure OpenAI is not configured.",
                stopwatch.ElapsedMilliseconds);
        }

        try
        {
            List<ChatMessage> messages = BuildMessages(request);

            ChatCompletionOptions options =
                new ChatCompletionOptions();

            options.Temperature =
                (float)request.Temperature;

            options.MaxOutputTokenCount =
                request.MaxTokens;

            if (request.TopP.HasValue)
            {
                options.TopP =
                    (float)request.TopP.Value;
            }

            ClientResult<ChatCompletion> completion =
                await _chatClient.CompleteChatAsync(
                    messages,
                    options,
                    cancellationToken);

            ChatCompletion result =
                completion.Value;

            string responseText = string.Empty;

            foreach (var part in result.Content)
            {
                responseText += part.Text;
            }

            if (string.IsNullOrWhiteSpace(responseText))
            {
                return AIResponse.Failure(
                    ProviderName,
                    "Model returned an empty response.",
                    stopwatch.ElapsedMilliseconds);
            }

            var usage = result.Usage;

            stopwatch.Stop();

            return AIResponse.Success(
                providerName: ProviderName,
                content: responseText,
                model: _options.DeploymentName,
                promptTokens: usage?.InputTokenCount,
                completionTokens: usage?.OutputTokenCount,
                totalTokens: usage?.TotalTokenCount,
                durationMs: stopwatch.ElapsedMilliseconds);
        }
        catch (OperationCanceledException)
            when (cancellationToken.IsCancellationRequested)
        {
            throw;
        }
        catch (ClientResultException ex)
        {
            stopwatch.Stop();

            string message = ex.Status switch
            {
                401 => "Azure OpenAI authentication failed. Check ApiKey.",
                403 => "Azure OpenAI access denied.",
                404 => "Deployment or endpoint not found.",
                429 => "Azure OpenAI quota exceeded or rate limited.",
                500 => "Azure OpenAI internal server error.",
                _ => ex.Message
            };

            _logger.LogError(ex,
                "Azure OpenAI request failed.");

            return AIResponse.Failure(
                ProviderName,
                message,
                stopwatch.ElapsedMilliseconds);
        }
        catch (RequestFailedException ex)
        {
            stopwatch.Stop();

            string message = ex.Status switch
            {
                401 => "Azure OpenAI authentication failed. Check ApiKey.",
                403 => "Azure OpenAI access denied.",
                404 => "Deployment or endpoint not found.",
                429 => "Azure OpenAI quota exceeded or rate limited.",
                500 => "Azure OpenAI internal server error.",
                _ => ex.Message
            };

            _logger.LogError(ex,
                "Azure OpenAI request failed.");

            return AIResponse.Failure(
                ProviderName,
                message,
                stopwatch.ElapsedMilliseconds);
        }
        catch (Exception ex)
        {
            stopwatch.Stop();

            _logger.LogError(ex,
                "Unexpected Azure OpenAI error.");

            return AIResponse.Failure(
                ProviderName,
                ex.Message,
                stopwatch.ElapsedMilliseconds);
        }
    }

    public async Task<bool> IsAvailableAsync(
        CancellationToken cancellationToken = default)
    {
        if (!_options.IsConfigured || _chatClient == null)
            return false;

        try
        {
            var result =
                await GenerateAsync(
                    new AIRequest
                    {
                        Prompt = "ping",
                        Temperature = 0,
                        MaxTokens = 5
                    },
                    cancellationToken);

            return result.IsSuccess;
        }
        catch
        {
            return false;
        }
    }

    private static List<ChatMessage> BuildMessages(
        AIRequest request)
    {
        List<ChatMessage> messages = new();

        if (!string.IsNullOrWhiteSpace(request.SystemPrompt))
        {
            messages.Add(
                new SystemChatMessage(
                    request.SystemPrompt));
        }

        if (request.History != null)
        {
            foreach (var item in request.History)
            {
                switch (item.Role.ToLowerInvariant())
                {
                    case "assistant":

                        messages.Add(
                            new AssistantChatMessage(
                                item.Content));

                        break;

                    case "system":

                        messages.Add(
                            new SystemChatMessage(
                                item.Content));

                        break;

                    default:

                        messages.Add(
                            new UserChatMessage(
                                item.Content));

                        break;
                }
            }
        }

        messages.Add(
            new UserChatMessage(
                request.Prompt));

        return messages;
    }
}
