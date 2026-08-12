using System.ComponentModel.DataAnnotations;

namespace LocalMindAI.Api.DTOs;

public sealed class RoleDto
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public IReadOnlyList<string> Permissions { get; init; } = [];
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
}

public sealed class SaveRoleDto
{
    [Required, StringLength(100, MinimumLength = 2)] public string Name { get; init; } = string.Empty;
    [StringLength(500)] public string? Description { get; init; }
    public IReadOnlyCollection<int> PermissionIds { get; init; } = [];
}

public sealed class PermissionDto
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
}

public sealed class PermissionGroupDto
{
    public string Name { get; init; } = string.Empty;
    public IReadOnlyList<PermissionDto> Permissions { get; init; } = [];
}

public sealed class RolePermissionsDto
{
    public int RoleId { get; init; }
    public IReadOnlyCollection<int> PermissionIds { get; init; } = [];
}

public sealed class SaveRolePermissionsDto
{
    public IReadOnlyCollection<int> PermissionIds { get; init; } = [];
}
