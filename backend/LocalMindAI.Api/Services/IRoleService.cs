using LocalMindAI.Api.DTOs;

namespace LocalMindAI.Api.Services;

public interface IRoleService
{
    Task<IReadOnlyList<RoleDto>> GetRolesAsync(CancellationToken cancellationToken = default);
    Task<RoleDto?> GetRoleAsync(int id, CancellationToken cancellationToken = default);
    Task<RoleDto> CreateAsync(SaveRoleDto input, CancellationToken cancellationToken = default);
    Task<RoleDto?> UpdateAsync(int id, SaveRoleDto input, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<PermissionDto>> GetPermissionsAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<PermissionGroupDto>> GetPermissionGroupsAsync(CancellationToken cancellationToken = default);
    Task<RolePermissionsDto?> GetRolePermissionsAsync(int roleId, CancellationToken cancellationToken = default);
    Task<RolePermissionsDto?> UpdateRolePermissionsAsync(int roleId, SaveRolePermissionsDto input, CancellationToken cancellationToken = default);
}
