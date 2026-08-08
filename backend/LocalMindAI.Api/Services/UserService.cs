using LocalMindAI.Api.Data;
using LocalMindAI.Api.DTOs;
using LocalMindAI.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LocalMindAI.Api.Services;

public sealed class UserService(ApplicationDbContext context) : IUserService
{
    public async Task<PagedResultDto<UserDto>> GetUsersAsync(UserQueryDto query, CancellationToken cancellationToken = default)
    {
        var users = context.Users.AsNoTracking().Include(user => user.UserRoles).ThenInclude(link => link.Role).AsQueryable();
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var term = query.Search.Trim();
            users = users.Where(user => user.FullName.Contains(term) || user.Email.Contains(term) || user.CompanyName.Contains(term));
        }
        if (query.IsActive.HasValue) users = users.Where(user => user.IsActive == query.IsActive.Value);

        var totalCount = await users.CountAsync(cancellationToken);
        var records = await users.OrderBy(user => user.FullName).ThenBy(user => user.Id)
            .Skip((query.Page - 1) * query.PageSize).Take(query.PageSize).ToListAsync(cancellationToken);
        return new PagedResultDto<UserDto> { Items = records.Select(Map).ToList(), Page = query.Page, PageSize = query.PageSize, TotalCount = totalCount };
    }

    public async Task<UserDto?> GetUserAsync(int id, CancellationToken cancellationToken = default)
    {
        var user = await UserQuery().AsNoTracking().SingleOrDefaultAsync(item => item.Id == id, cancellationToken);
        return user is null ? null : Map(user);
    }

    public async Task<UserDto> InviteAsync(InviteUserDto input, CancellationToken cancellationToken = default)
    {
        var email = NormalizeEmail(input.Email);
        if (await context.Users.AnyAsync(user => user.Email == email, cancellationToken)) throw new InvalidOperationException("A user with this email already exists.");
        var user = new User
        {
            FullName = input.FullName.Trim(),
            Email = email,
            CompanyName = input.CompanyName.Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(input.InitialPassword),
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        await SetRolesAsync(user, input.RoleIds, cancellationToken);
        context.Users.Add(user);
        await context.SaveChangesAsync(cancellationToken);
        return await GetUserAsync(user.Id, cancellationToken) ?? throw new InvalidOperationException("The invited user could not be loaded.");
    }

    public async Task<UserDto?> UpdateAsync(int id, UpdateUserDto input, CancellationToken cancellationToken = default)
    {
        var user = await context.Users.SingleOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (user is null) return null;
        var email = NormalizeEmail(input.Email);
        if (await context.Users.AnyAsync(item => item.Id != id && item.Email == email, cancellationToken)) throw new InvalidOperationException("A user with this email already exists.");

        user.FullName = input.FullName.Trim();
        user.Email = email;
        user.CompanyName = input.CompanyName.Trim();
        await context.SaveChangesAsync(cancellationToken);
        return await GetUserAsync(id, cancellationToken);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var user = await context.Users.SingleOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (user is null) return false;
        context.Users.Remove(user);
        await context.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<UserDto?> SetActiveAsync(int id, bool isActive, CancellationToken cancellationToken = default)
    {
        var user = await context.Users.SingleOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (user is null) return null;
        user.IsActive = isActive;
        if (!isActive)
        {
            var activeTokens = await context.RefreshTokens.Where(token => token.UserId == id && token.RevokedAt == null).ToListAsync(cancellationToken);
            foreach (var token in activeTokens) token.RevokedAt = DateTime.UtcNow;
        }
        await context.SaveChangesAsync(cancellationToken);
        return await GetUserAsync(id, cancellationToken);
    }

    public async Task<UserDto?> AssignRolesAsync(int id, AssignUserRolesDto input, CancellationToken cancellationToken = default)
    {
        var user = await context.Users.Include(item => item.UserRoles).SingleOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (user is null) return null;
        await SetRolesAsync(user, input.RoleIds, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        return await GetUserAsync(id, cancellationToken);
    }

    private IQueryable<User> UserQuery() => context.Users.Include(user => user.UserRoles).ThenInclude(link => link.Role);

    private async Task SetRolesAsync(User user, IReadOnlyCollection<int> roleIds, CancellationToken cancellationToken)
    {
        var requestedIds = roleIds.Distinct().ToHashSet();
        var validIds = await context.Roles.Where(role => requestedIds.Contains(role.Id)).Select(role => role.Id).ToListAsync(cancellationToken);
        if (validIds.Count != requestedIds.Count) throw new InvalidOperationException("One or more selected roles do not exist.");
        user.UserRoles.Clear();
        foreach (var roleId in validIds) user.UserRoles.Add(new UserRole { RoleId = roleId });
    }

    private static UserDto Map(User user) => new()
    {
        Id = user.Id,
        FullName = user.FullName,
        Email = user.Email,
        CompanyName = user.CompanyName,
        IsActive = user.IsActive,
        CreatedAt = user.CreatedAt,
        Roles = user.UserRoles.OrderBy(link => link.Role.Name).Select(link => link.Role.Name).ToArray()
    };

    private static string NormalizeEmail(string email) => email.Trim().ToLowerInvariant();
}
