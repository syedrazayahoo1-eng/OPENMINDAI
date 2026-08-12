using System.ComponentModel.DataAnnotations;

namespace LocalMindAI.Api.DTOs;

public sealed class UserDto
{
    public int Id { get; init; }
    public string FullName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string CompanyName { get; init; } = string.Empty;
    public bool IsActive { get; init; }
    public DateTime CreatedAt { get; init; }
    public IReadOnlyList<string> Roles { get; init; } = [];
}

public sealed class InviteUserDto
{
    [Required, StringLength(160, MinimumLength = 2)] public string FullName { get; init; } = string.Empty;
    [Required, EmailAddress, StringLength(254)] public string Email { get; init; } = string.Empty;
    [Required, StringLength(160)] public string CompanyName { get; init; } = string.Empty;
    [Required, StringLength(128, MinimumLength = 12)] public string InitialPassword { get; init; } = string.Empty;
    public IReadOnlyCollection<int> RoleIds { get; init; } = [];
}

public sealed class UpdateUserDto
{
    [Required, StringLength(160, MinimumLength = 2)] public string FullName { get; init; } = string.Empty;
    [Required, EmailAddress, StringLength(254)] public string Email { get; init; } = string.Empty;
    [Required, StringLength(160)] public string CompanyName { get; init; } = string.Empty;
}

public sealed class AssignUserRolesDto
{
    public IReadOnlyCollection<int> RoleIds { get; init; } = [];
}

public sealed class UserQueryDto
{
    [StringLength(160)] public string? Search { get; init; }
    public bool? IsActive { get; init; }
    [Range(1, int.MaxValue)] public int Page { get; init; } = 1;
    [Range(1, 100)] public int PageSize { get; init; } = 25;
}

public sealed class PagedResultDto<T>
{
    public required IReadOnlyList<T> Items { get; init; }
    public int Page { get; init; }
    public int PageSize { get; init; }
    public int TotalCount { get; init; }
}
