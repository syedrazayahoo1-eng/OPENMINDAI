using LocalMindAI.Api.DTOs;

namespace LocalMindAI.Api.Services;

public interface IOrganizationService
{
    Task<OrganizationDto> GetAsync(CancellationToken cancellationToken = default);
    Task<OrganizationDto> CreateAsync(OrganizationDto input, CancellationToken cancellationToken = default);
    Task<OrganizationDto> UpdateAsync(OrganizationDto input, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
}
