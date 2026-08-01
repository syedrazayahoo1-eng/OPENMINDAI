using Microsoft.Extensions.Options;

namespace LocalMindAI.Api.Services.AI;

/// <summary>
/// Strongly-typed options bound from the "AIGateway" section of appsettings,
/// controlling which provider the factory resolves by default.
/// </summary>
/// <example>
/// {
///   "AIGateway": {
///     "DefaultProvider": "Ollama"
///   }
/// }
/// </example>
public sealed class AIGatewayOptions
{
    public const string SectionName = "AIGateway";

    /// <summary>
    /// Name of the default provider to use when the caller does not request one
    /// explicitly. Must match one of the <see cref="AIProviderType"/> names
    /// (e.g. "AzureOpenAI" or "Ollama").
    /// </summary>
    public string DefaultProvider { get; set; } = string.Empty;
}

/// <summary>
/// Resolves the active <see cref="IAIProvider"/> implementation, allowing callers
/// to switch between Azure OpenAI and Ollama purely through configuration
/// ("AIGateway:DefaultProvider" in appsettings) or by requesting a specific
/// provider explicitly at call time.
/// </summary>
public interface IAIProviderFactory
{
    /// <summary>
    /// Returns the provider configured as the gateway default
    /// ("AIGateway:DefaultProvider" in appsettings).
    /// </summary>
    IAIProvider GetDefaultProvider();

    /// <summary>
    /// Returns the provider matching the requested <paramref name="providerType"/>.
    /// </summary>
    /// <exception cref="InvalidOperationException">
    /// Thrown when no provider implementation is registered for the requested type.
    /// </exception>
    IAIProvider GetProvider(AIProviderType providerType);

    /// <summary>
    /// Attempts to resolve the provider matching <paramref name="providerName"/>
    /// (case-insensitive match against <see cref="AIProviderType"/> names).
    /// </summary>
    /// <exception cref="ArgumentException">
    /// Thrown when <paramref name="providerName"/> does not match any known provider type.
    /// </exception>
    /// <exception cref="InvalidOperationException">
    /// Thrown when no provider implementation is registered for the resolved type.
    /// </exception>
    IAIProvider GetProvider(string providerName);

    /// <summary>
    /// Returns every provider implementation currently registered with the gateway.
    /// </summary>
    IReadOnlyCollection<IAIProvider> GetAllProviders();
}

/// <summary>
/// Default <see cref="IAIProviderFactory"/> implementation. Providers are supplied
/// via constructor injection (typically <c>IEnumerable&lt;IAIProvider&gt;</c> resolved
/// by the DI container once <see cref="AzureOpenAIProvider"/> and <see cref="OllamaProvider"/>
/// are registered), and the default selection is driven by the "AIGateway" appsettings
/// section — so switching providers in any environment requires only a configuration
/// change, never a code or deployment change.
/// </summary>
public sealed class AIProviderFactory : IAIProviderFactory
{
    private readonly IReadOnlyDictionary<AIProviderType, IAIProvider> _providersByType;
    private readonly AIGatewayOptions _options;

    public AIProviderFactory(IEnumerable<IAIProvider> providers, IOptions<AIGatewayOptions> options)
    {
        ArgumentNullException.ThrowIfNull(providers);
        ArgumentNullException.ThrowIfNull(options);

        _providersByType = providers
            .GroupBy(p => p.ProviderType)
            .ToDictionary(g => g.Key, g => g.First());

        _options = options.Value;
    }

    public IAIProvider GetDefaultProvider()
    {
        return GetProvider(_options.DefaultProvider);
    }

    public IAIProvider GetProvider(AIProviderType providerType)
    {
        if (_providersByType.TryGetValue(providerType, out var provider))
        {
            return provider;
        }

        throw new InvalidOperationException(
            $"No IAIProvider implementation is registered for provider type '{providerType}'. " +
            "Ensure the corresponding provider (e.g. AzureOpenAIProvider or OllamaProvider) is registered in the DI container.");
    }

    public IAIProvider GetProvider(string providerName)
    {
        if (string.IsNullOrWhiteSpace(providerName))
        {
            throw new ArgumentException("Provider name must not be null or empty.", nameof(providerName));
        }

        if (!Enum.TryParse<AIProviderType>(providerName, ignoreCase: true, out var providerType))
        {
            var validNames = string.Join(", ", Enum.GetNames<AIProviderType>());
            throw new ArgumentException(
                $"'{providerName}' is not a recognized AI provider. Valid values are: {validNames}.",
                nameof(providerName));
        }

        return GetProvider(providerType);
    }

    public IReadOnlyCollection<IAIProvider> GetAllProviders()
    {
        return _providersByType.Values.ToList().AsReadOnly();
    }
}
