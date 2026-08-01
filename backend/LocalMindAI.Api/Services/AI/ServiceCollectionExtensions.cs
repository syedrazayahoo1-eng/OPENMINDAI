using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace LocalMindAI.Api.Services.AI;

/// <summary>
/// DI registration surface for the AI Gateway. Wires up both provider implementations
/// (Azure OpenAI, Ollama) and the <see cref="IAIProviderFactory"/> that selects between
/// them at runtime based on configuration.
/// </summary>
/// <remarks>
/// This extension is additive only — it does not touch <c>Program.cs</c> automatically.
/// To activate the gateway, call it once during host configuration:
/// <code>
/// builder.Services.AddAIGateway(builder.Configuration);
/// </code>
/// </remarks>
public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Registers the AI Gateway: both <see cref="IAIProvider"/> implementations
    /// (<see cref="AzureOpenAIProvider"/> and <see cref="OllamaProvider"/>) and the
    /// <see cref="IAIProviderFactory"/> used to select between them. Providers are
    /// registered as singletons since they hold no per-request state beyond their
    /// (immutable) bound configuration and an internally owned <see cref="HttpClient"/>.
    /// </summary>
    /// <param name="services">The service collection to add registrations to.</param>
    /// <param name="configuration">
    /// Application configuration containing the "AIGateway", "AzureOpenAI" and "Ollama"
    /// sections used by the factory and providers respectively.
    /// </param>
    /// <returns>The same <see cref="IServiceCollection"/> instance, for chaining.</returns>
    public static IServiceCollection AddAIGateway(this IServiceCollection services, IConfiguration configuration)
    {
        ArgumentNullException.ThrowIfNull(services);
        ArgumentNullException.ThrowIfNull(configuration);

        services.AddOptions<AIGatewayOptions>()
            .Bind(configuration.GetRequiredSection(AIGatewayOptions.SectionName))
            .Validate(
                options => Enum.TryParse<AIProviderType>(options.DefaultProvider, true, out _),
                $"{AIGatewayOptions.SectionName}:DefaultProvider must be one of: {string.Join(", ", Enum.GetNames<AIProviderType>())}.")
            .ValidateOnStart();

        services.AddOptions<AzureOpenAIOptions>()
            .Bind(configuration.GetRequiredSection(AzureOpenAIOptions.SectionName));
        services.AddOptions<OllamaOptions>()
            .Bind(configuration.GetRequiredSection(OllamaOptions.SectionName));

        services.AddHttpClient();
        services.AddSingleton<AzureOpenAIProvider>();
        services.AddSingleton<OllamaProvider>();
        services.AddSingleton<IAIProvider>(sp => sp.GetRequiredService<AzureOpenAIProvider>());
        services.AddSingleton<IAIProvider>(sp => sp.GetRequiredService<OllamaProvider>());
        services.AddSingleton<IAIProviderFactory, AIProviderFactory>();

        return services;
    }
}
