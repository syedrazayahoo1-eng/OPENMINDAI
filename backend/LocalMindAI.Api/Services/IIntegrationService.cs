using LocalMindAI.Api.DTOs;

namespace LocalMindAI.Api.Services;

public interface IIntegrationService
{
    Task<IntegrationDto> GetAsync(string provider, CancellationToken cancellationToken = default);
    Task<IntegrationDto> SaveAsync(string provider, SaveIntegrationDto input, CancellationToken cancellationToken = default);
    Task<IntegrationTestDto> TestAsync(string provider, CancellationToken cancellationToken = default);
    Task<IntegrationDto> GetGoogleBusinessAsync(CancellationToken cancellationToken = default);
    Task<IntegrationTestDto> ReconnectGoogleBusinessAsync(CancellationToken cancellationToken = default);
}
