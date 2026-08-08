using LocalMindAI.Api.DTOs;

namespace LocalMindAI.Api.Services;

public interface IUserService
{
    Task<PagedResultDto<UserDto>> GetUsersAsync(UserQueryDto query, CancellationToken cancellationToken = default);
    Task<UserDto?> GetUserAsync(int id, CancellationToken cancellationToken = default);
    Task<UserDto> InviteAsync(InviteUserDto input, CancellationToken cancellationToken = default);
    Task<UserDto?> UpdateAsync(int id, UpdateUserDto input, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
    Task<UserDto?> SetActiveAsync(int id, bool isActive, CancellationToken cancellationToken = default);
    Task<UserDto?> AssignRolesAsync(int id, AssignUserRolesDto input, CancellationToken cancellationToken = default);
}
