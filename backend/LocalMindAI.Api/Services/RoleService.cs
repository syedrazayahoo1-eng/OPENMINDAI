using LocalMindAI.Api.Data;
using LocalMindAI.Api.DTOs;
using LocalMindAI.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LocalMindAI.Api.Services;

public sealed class RoleService(ApplicationDbContext context) : IRoleService
{
    public async Task<IReadOnlyList<RoleDto>> GetRolesAsync(CancellationToken cancellationToken = default)
    {
        var roles = await context.Roles.AsNoTracking()
            .Include(role => role.RolePermissions).ThenInclude(link => link.Permission)
            .OrderBy(role => role.Name)
            .ToListAsync(cancellationToken);
        return roles.Select(Map).ToList();
    }

    public async Task<RoleDto?> GetRoleAsync(int id, CancellationToken cancellationToken = default)
    {
        var role = await context.Roles.AsNoTracking()
            .Include(item => item.RolePermissions).ThenInclude(link => link.Permission)
            .SingleOrDefaultAsync(item => item.Id == id, cancellationToken);
        return role is null ? null : Map(role);
    }

    public async Task<RoleDto> CreateAsync(SaveRoleDto input, CancellationToken cancellationToken = default)
    {
        var name = NormalizeName(input.Name);
        if (await context.Roles.AnyAsync(role => role.Name == name, cancellationToken))
            throw new InvalidOperationException("A role with this name already exists.");

        var role = new Role { Name = name, Description = NormalizeDescription(input.Description) };
        await SetPermissionsAsync(role, input.PermissionIds, cancellationToken);
        context.Roles.Add(role);
        await context.SaveChangesAsync(cancellationToken);
        return await GetRoleAsync(role.Id, cancellationToken) ?? throw new InvalidOperationException("The created role could not be loaded.");
    }

    public async Task<RoleDto?> UpdateAsync(int id, SaveRoleDto input, CancellationToken cancellationToken = default)
    {
        var role = await context.Roles.Include(item => item.RolePermissions).SingleOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (role is null) return null;

        var name = NormalizeName(input.Name);
        if (await context.Roles.AnyAsync(item => item.Id != id && item.Name == name, cancellationToken))
            throw new InvalidOperationException("A role with this name already exists.");

        role.Name = name;
        role.Description = NormalizeDescription(input.Description);
        role.UpdatedAt = DateTime.UtcNow;
        await SetPermissionsAsync(role, input.PermissionIds, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        return await GetRoleAsync(id, cancellationToken);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var role = await context.Roles.SingleOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (role is null) return false;

        context.Roles.Remove(role);
        await context.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<IReadOnlyList<PermissionDto>> GetPermissionsAsync(CancellationToken cancellationToken = default) =>
        await context.Permissions.AsNoTracking().OrderBy(permission => permission.Name)
            .Select(permission => new PermissionDto { Id = permission.Id, Name = permission.Name, Description = permission.Description })
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<PermissionGroupDto>> GetPermissionGroupsAsync(CancellationToken cancellationToken = default)
    {
        var permissions = await GetPermissionsAsync(cancellationToken);
        return permissions
            .Select(permission => new { Permission = permission, Group = permission.Name.Split('.', 2)[0] })
            .Where(item => PermissionGroupOrder.Contains(item.Group))
            .GroupBy(item => item.Group)
            .OrderBy(group => Array.IndexOf(PermissionGroupOrder, group.Key))
            .Select(group => new PermissionGroupDto { Name = group.Key, Permissions = group.OrderBy(item => item.Permission.Name).Select(item => item.Permission).ToArray() })
            .ToList();
    }

    public async Task<RolePermissionsDto?> GetRolePermissionsAsync(int roleId, CancellationToken cancellationToken = default)
    {
        var role = await context.Roles.AsNoTracking().Include(item => item.RolePermissions).SingleOrDefaultAsync(item => item.Id == roleId, cancellationToken);
        return role is null ? null : new RolePermissionsDto { RoleId = roleId, PermissionIds = role.RolePermissions.Select(item => item.PermissionId).ToArray() };
    }

    public async Task<RolePermissionsDto?> UpdateRolePermissionsAsync(int roleId, SaveRolePermissionsDto input, CancellationToken cancellationToken = default)
    {
        var role = await context.Roles.Include(item => item.RolePermissions).SingleOrDefaultAsync(item => item.Id == roleId, cancellationToken);
        if (role is null) return null;
        await SetPermissionsAsync(role, input.PermissionIds, cancellationToken);
        role.UpdatedAt = DateTime.UtcNow;
        await context.SaveChangesAsync(cancellationToken);
        return new RolePermissionsDto { RoleId = roleId, PermissionIds = role.RolePermissions.Select(item => item.PermissionId).ToArray() };
    }

    private async Task SetPermissionsAsync(Role role, IReadOnlyCollection<int> permissionIds, CancellationToken cancellationToken)
    {
        var requestedIds = permissionIds.Distinct().ToHashSet();
        var validIds = await context.Permissions.Where(permission => requestedIds.Contains(permission.Id)).Select(permission => permission.Id).ToListAsync(cancellationToken);
        if (validIds.Count != requestedIds.Count) throw new InvalidOperationException("One or more selected permissions do not exist.");

        role.RolePermissions.Clear();
        foreach (var permissionId in validIds) role.RolePermissions.Add(new RolePermission { PermissionId = permissionId });
    }

    private static RoleDto Map(Role role) => new()
    {
        Id = role.Id,
        Name = role.Name,
        Description = role.Description,
        Permissions = role.RolePermissions.OrderBy(link => link.Permission.Name).Select(link => link.Permission.Name).ToArray(),
        CreatedAt = role.CreatedAt,
        UpdatedAt = role.UpdatedAt
    };

    private static string NormalizeName(string name) => name.Trim();
    private static string? NormalizeDescription(string? description) => string.IsNullOrWhiteSpace(description) ? null : description.Trim();
    private static readonly string[] PermissionGroupOrder = ["CRM", "Reviews", "Posts", "Images", "Workflows", "Agents", "Monitoring", "Analytics", "Organization", "Users", "Settings"];
}
