using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text;
using LocalMindAI.Api.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Xunit;

namespace LocalMindAI.Api.Tests;

public sealed class AuthorizationIntegrationTests : IClassFixture<AuthorizationWebApplicationFactory>
{
    private readonly AuthorizationWebApplicationFactory _factory;

    public AuthorizationIntegrationTests(AuthorizationWebApplicationFactory factory) => _factory = factory;

    [Fact]
    public async Task Privileged_management_endpoints_reject_unauthenticated_requests()
    {
        using var client = _factory.CreateClient();

        var response = await client.PutAsJsonAsync("/api/organization", OrganizationPayload());

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Login_issues_a_jwt_for_a_valid_user_and_rejects_an_invalid_password()
    {
        using var client = _factory.CreateClient();

        var valid = await LoginAsync(client, "ordinary@integration.test", AuthorizationWebApplicationFactory.TestPassword);
        var invalid = await client.PostAsJsonAsync("/api/auth/login", new { email = "ordinary@integration.test", password = "incorrect-password" });

        Assert.False(string.IsNullOrWhiteSpace(valid));
        Assert.Equal(HttpStatusCode.Unauthorized, invalid.StatusCode);
    }

    [Theory]
    [InlineData("/api/users")]
    [InlineData("/api/roles")]
    [InlineData("/api/permissions")]
    [InlineData("/api/integrations/redis")]
    [InlineData("/api/analytics/overview")]
    public async Task Ordinary_authenticated_users_are_forbidden_from_privileged_reads(string path)
    {
        using var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", await LoginAsync(client, "ordinary@integration.test", AuthorizationWebApplicationFactory.TestPassword));

        var response = await client.GetAsync(path);

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task Permission_claims_allow_their_matching_management_operations()
    {
        using var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", await LoginAsync(client, "manager@integration.test", AuthorizationWebApplicationFactory.TestPassword));

        var organization = await client.PutAsJsonAsync("/api/organization", OrganizationPayload());
        var users = await client.GetAsync("/api/users");
        var roles = await client.GetAsync("/api/roles");
        var permissions = await client.GetAsync("/api/permissions");
        var integrations = await client.GetAsync("/api/integrations/redis");
        var analytics = await client.GetAsync("/api/analytics/overview");

        Assert.Equal(HttpStatusCode.OK, organization.StatusCode);
        Assert.Equal(HttpStatusCode.OK, users.StatusCode);
        Assert.Equal(HttpStatusCode.OK, roles.StatusCode);
        Assert.Equal(HttpStatusCode.OK, permissions.StatusCode);
        Assert.Equal(HttpStatusCode.OK, integrations.StatusCode);
        Assert.Equal(HttpStatusCode.OK, analytics.StatusCode);
    }

    private static object OrganizationPayload() => new { name = "Integration Test Organization", displayName = "Integration Test Organization", timezone = "UTC", currency = "USD", language = "English" };

    private static async Task<string> LoginAsync(HttpClient client, string email, string password)
    {
        var response = await client.PostAsJsonAsync("/api/auth/login", new { email, password, rememberMe = false });
        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadFromJsonAsync<LoginResponse>();
        return result?.AccessToken ?? throw new InvalidOperationException("Login did not return an access token.");
    }

    private sealed record LoginResponse(string AccessToken);
}

public sealed class AuthorizationWebApplicationFactory : WebApplicationFactory<Program>, IDisposable
{
    internal const string JwtKey = "integration-tests-only-key-that-is-longer-than-thirty-two-characters";
    internal const string TestPassword = "IntegrationOnlyPassword!123";
    private readonly string _databasePath = Path.Combine(Path.GetTempPath(), $"digitech-tests-{Guid.NewGuid():N}.db");

    public AuthorizationWebApplicationFactory()
    {
        Environment.SetEnvironmentVariable("Jwt__Key", JwtKey);
        Environment.SetEnvironmentVariable("Jwt__Issuer", "LocalMindAI");
        Environment.SetEnvironmentVariable("Jwt__Audience", "LocalMindAIUsers");
        Environment.SetEnvironmentVariable("Database__Provider", "Sqlite");
        Environment.SetEnvironmentVariable("ConnectionStrings__DefaultConnection", $"Data Source={_databasePath}");
        Environment.SetEnvironmentVariable("DataProtection__KeyRingPath", Path.Combine(Path.GetTempPath(), $"digitech-keys-{Guid.NewGuid():N}"));
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Development");
        builder.ConfigureAppConfiguration((_, configuration) => configuration.AddInMemoryCollection(new Dictionary<string, string?>
        {
            ["Jwt:Key"] = JwtKey,
            ["Jwt:Issuer"] = "LocalMindAI",
            ["Jwt:Audience"] = "LocalMindAIUsers",
            ["Database:Provider"] = "Sqlite",
            ["ConnectionStrings:DefaultConnection"] = $"Data Source={_databasePath}",
            ["DataProtection:KeyRingPath"] = Path.Combine(Path.GetTempPath(), $"digitech-keys-{Guid.NewGuid():N}"),
        }));
        builder.ConfigureServices(services =>
        {
            using var provider = services.BuildServiceProvider();
            using var scope = provider.CreateScope();
            var database = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            database.Database.EnsureCreated();
            if (!database.Users.Any())
            {
                var ordinary = new LocalMindAI.Api.Models.User { FullName = "Ordinary Integration User", Email = "ordinary@integration.test", CompanyName = "Integration", PasswordHash = BCrypt.Net.BCrypt.HashPassword(TestPassword) };
                var manager = new LocalMindAI.Api.Models.User { FullName = "Manager Integration User", Email = "manager@integration.test", CompanyName = "Integration", PasswordHash = BCrypt.Net.BCrypt.HashPassword(TestPassword) };
                var role = new LocalMindAI.Api.Models.Role { Name = "Integration Manager" };
                database.Users.AddRange(ordinary, manager);
                database.Roles.Add(role);
                database.SaveChanges();
                var permissionIds = database.Permissions
                    .Where(permission => new[] { "Organization.Manage", "Settings.Manage", "Analytics.View", "Users.Invite", "Users.Edit", "Users.Delete", "Users.AssignRoles" }.Contains(permission.Name))
                    .Select(permission => permission.Id)
                    .ToList();
                database.UserRoles.Add(new LocalMindAI.Api.Models.UserRole { UserId = manager.Id, RoleId = role.Id });
                database.RolePermissions.AddRange(permissionIds.Select(permissionId => new LocalMindAI.Api.Models.RolePermission { RoleId = role.Id, PermissionId = permissionId }));
                database.SaveChanges();
            }
        });
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);
        DeleteDatabaseFiles();
        Environment.SetEnvironmentVariable("Jwt__Key", null);
        Environment.SetEnvironmentVariable("Jwt__Issuer", null);
        Environment.SetEnvironmentVariable("Jwt__Audience", null);
        Environment.SetEnvironmentVariable("Database__Provider", null);
        Environment.SetEnvironmentVariable("ConnectionStrings__DefaultConnection", null);
        Environment.SetEnvironmentVariable("DataProtection__KeyRingPath", null);
    }

    private void DeleteDatabaseFiles()
    {
        foreach (var path in new[] { _databasePath, $"{_databasePath}-wal", $"{_databasePath}-shm" })
        {
            for (var attempt = 0; attempt < 3 && File.Exists(path); attempt++)
            {
                try { File.Delete(path); }
                catch (IOException) { Thread.Sleep(100); }
            }
        }
    }
}
