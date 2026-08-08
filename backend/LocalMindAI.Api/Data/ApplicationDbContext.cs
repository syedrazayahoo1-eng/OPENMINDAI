using Microsoft.EntityFrameworkCore;
using LocalMindAI.Api.Models;

namespace LocalMindAI.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Organization> Organizations => Set<Organization>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<ChatMessage> ChatMessages => Set<ChatMessage>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<ReviewReply> ReviewReplies => Set<ReviewReply>();
    public DbSet<BrandVoice> BrandVoices => Set<BrandVoice>();
    public DbSet<GoogleBusinessPost> GoogleBusinessPosts => Set<GoogleBusinessPost>();
    public DbSet<GeneratedImage> GeneratedImages => Set<GeneratedImage>();
    public DbSet<ScheduledPost> ScheduledPosts => Set<ScheduledPost>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<CustomerNote> CustomerNotes => Set<CustomerNote>();
    public DbSet<CustomerActivity> CustomerActivities => Set<CustomerActivity>();
    public DbSet<CustomerPipeline> CustomerPipelines => Set<CustomerPipeline>();
    public DbSet<Agent> Agents => Set<Agent>();
    public DbSet<GoogleBusinessAccount> GoogleBusinessAccounts => Set<GoogleBusinessAccount>();
    public DbSet<GoogleBusinessLocation> GoogleBusinessLocations => Set<GoogleBusinessLocation>();
    public DbSet<Workflow> Workflows => Set<Workflow>();
    public DbSet<WorkflowStep> WorkflowSteps => Set<WorkflowStep>();
    public DbSet<WorkflowExecution> WorkflowExecutions => Set<WorkflowExecution>();
    public DbSet<WorkflowExecutionLog> WorkflowExecutionLogs => Set<WorkflowExecutionLog>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Permission> Permissions => Set<Permission>();
    public DbSet<UserRole> UserRoles => Set<UserRole>();
    public DbSet<RolePermission> RolePermissions => Set<RolePermission>();
    public DbSet<ApiKey> ApiKeys => Set<ApiKey>();
    public DbSet<MfaCredential> MfaCredentials => Set<MfaCredential>();
    public DbSet<LoginHistory> LoginHistories => Set<LoginHistory>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<IntegrationConfiguration> IntegrationConfigurations => Set<IntegrationConfiguration>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<User>().HasIndex(user => user.Email).IsUnique();
        modelBuilder.Entity<User>().HasIndex(user => new { user.IsActive, user.FullName });
        modelBuilder.Entity<ApiKey>(entity =>
        {
            entity.Property(item => item.Name).HasMaxLength(100).IsRequired();
            entity.Property(item => item.KeyHash).HasMaxLength(128).IsRequired();
            entity.Property(item => item.KeyPrefix).HasMaxLength(24).IsRequired();
            entity.HasIndex(item => item.KeyHash).IsUnique();
            entity.HasIndex(item => new { item.UserId, item.RevokedAt });
            entity.HasOne(item => item.User).WithMany().HasForeignKey(item => item.UserId).OnDelete(DeleteBehavior.Cascade);
        });
        modelBuilder.Entity<MfaCredential>(entity =>
        {
            entity.Property(item => item.EncryptedSecret).IsRequired();
            entity.HasIndex(item => item.UserId).IsUnique();
            entity.HasOne(item => item.User).WithMany().HasForeignKey(item => item.UserId).OnDelete(DeleteBehavior.Cascade);
        });
        modelBuilder.Entity<LoginHistory>(entity =>
        {
            entity.Property(item => item.Email).HasMaxLength(254).IsRequired();
            entity.Property(item => item.UserAgent).HasMaxLength(512);
            entity.HasIndex(item => new { item.UserId, item.CreatedAt });
            entity.HasOne(item => item.User).WithMany().HasForeignKey(item => item.UserId).OnDelete(DeleteBehavior.SetNull);
        });
        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.Property(item => item.Action).HasMaxLength(160).IsRequired();
            entity.Property(item => item.EntityType).HasMaxLength(100);
            entity.Property(item => item.EntityId).HasMaxLength(100);
            entity.HasIndex(item => new { item.UserId, item.CreatedAt });
            entity.HasIndex(item => item.Action);
            entity.HasOne(item => item.User).WithMany().HasForeignKey(item => item.UserId).OnDelete(DeleteBehavior.SetNull);
        });
        modelBuilder.Entity<IntegrationConfiguration>(entity =>
        {
            entity.Property(item => item.Provider).HasMaxLength(64).IsRequired();
            entity.Property(item => item.EncryptedConfiguration).IsRequired();
            entity.Property(item => item.Status).HasMaxLength(32).IsRequired();
            entity.HasIndex(item => item.Provider).IsUnique();
        });
        modelBuilder.Entity<Role>(entity =>
        {
            entity.Property(item => item.Name).HasMaxLength(100).IsRequired();
            entity.Property(item => item.Description).HasMaxLength(500);
            entity.HasIndex(item => item.Name).IsUnique();
        });
        modelBuilder.Entity<Permission>(entity =>
        {
            entity.Property(item => item.Name).HasMaxLength(100).IsRequired();
            entity.Property(item => item.Description).HasMaxLength(500);
            entity.HasIndex(item => item.Name).IsUnique();
        });
        modelBuilder.Entity<UserRole>(entity =>
        {
            entity.HasKey(item => new { item.UserId, item.RoleId });
            entity.HasIndex(item => item.RoleId);
            entity.HasOne(item => item.User).WithMany(item => item.UserRoles).HasForeignKey(item => item.UserId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(item => item.Role).WithMany(item => item.UserRoles).HasForeignKey(item => item.RoleId).OnDelete(DeleteBehavior.Cascade);
        });
        modelBuilder.Entity<RolePermission>(entity =>
        {
            entity.HasKey(item => new { item.RoleId, item.PermissionId });
            entity.HasIndex(item => item.PermissionId);
            entity.HasOne(item => item.Role).WithMany(item => item.RolePermissions).HasForeignKey(item => item.RoleId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(item => item.Permission).WithMany(item => item.RolePermissions).HasForeignKey(item => item.PermissionId).OnDelete(DeleteBehavior.Cascade);
        });
        modelBuilder.Entity<Permission>().HasData(
            PermissionSeed("CRM.View"), PermissionSeed("CRM.Create"), PermissionSeed("CRM.Edit"), PermissionSeed("CRM.Delete"),
            PermissionSeed("Reviews.View"), PermissionSeed("Reviews.Reply"), PermissionSeed("Reviews.Publish"),
            PermissionSeed("Posts.View"), PermissionSeed("Posts.Create"), PermissionSeed("Posts.Publish"),
            PermissionSeed("Images.Generate"), PermissionSeed("Workflow.Execute"), PermissionSeed("Agents.Run"),
            PermissionSeed("Monitoring.View"), PermissionSeed("Organization.Manage"),
            PermissionSeed("Reviews.Delete"), PermissionSeed("Posts.Edit"), PermissionSeed("Posts.Delete"),
            PermissionSeed("Images.View"), PermissionSeed("Images.Delete"),
            PermissionSeed("Workflows.View"), PermissionSeed("Workflows.Create"), PermissionSeed("Workflows.Edit"), PermissionSeed("Workflows.Delete"), PermissionSeed("Workflows.Execute"),
            PermissionSeed("Agents.View"), PermissionSeed("Agents.Create"), PermissionSeed("Agents.Edit"), PermissionSeed("Agents.Delete"),
            PermissionSeed("Users.Invite"), PermissionSeed("Users.Edit"), PermissionSeed("Users.Delete"), PermissionSeed("Users.AssignRoles"), PermissionSeed("Settings.Manage"),
            PermissionSeed("Analytics.View"));
        modelBuilder.Entity<Organization>(entity => { entity.Property(item => item.Name).HasMaxLength(160).IsRequired(); entity.Property(item => item.DisplayName).HasMaxLength(160).IsRequired(); entity.Property(item => item.Timezone).HasMaxLength(100).IsRequired(); entity.Property(item => item.Currency).HasMaxLength(8).IsRequired(); entity.Property(item => item.Language).HasMaxLength(50).IsRequired(); entity.HasIndex(item => item.Name).IsUnique(); });
        modelBuilder.Entity<RefreshToken>().HasIndex(token => token.TokenHash).IsUnique();
        modelBuilder.Entity<RefreshToken>().HasIndex(token => new { token.UserId, token.ExpiresAt });
        modelBuilder.Entity<RefreshToken>().HasOne(token => token.User).WithMany(user => user.RefreshTokens).HasForeignKey(token => token.UserId).OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<Agent>().HasIndex(agent => new { agent.Status, agent.UpdatedAt });
        modelBuilder.Entity<Review>().HasIndex(review => review.CreatedAt);
        modelBuilder.Entity<ReviewReply>().HasIndex(reply => new { reply.ReviewId, reply.UpdatedAt });
        modelBuilder.Entity<GoogleBusinessPost>().HasIndex(post => new { post.Status, post.UpdatedAt });
        modelBuilder.Entity<GeneratedImage>().HasIndex(image => image.CreatedAt);
        modelBuilder.Entity<ScheduledPost>().HasIndex(item => new { item.Status, item.ScheduledTime });
        modelBuilder.Entity<Customer>().HasIndex(item => new { item.OrganizationId, item.Email });
        modelBuilder.Entity<Customer>().HasIndex(item => new { item.Status, item.UpdatedAt });
        modelBuilder.Entity<CustomerNote>().HasOne(item => item.Customer).WithMany(item => item.Notes).HasForeignKey(item => item.CustomerId).OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<CustomerActivity>().HasOne(item => item.Customer).WithMany(item => item.Activities).HasForeignKey(item => item.CustomerId).OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<CustomerPipeline>().HasData(
            new CustomerPipeline { Id = 1, Name = "Lead", SortOrder = 1, IsActive = true },
            new CustomerPipeline { Id = 2, Name = "Qualified", SortOrder = 2, IsActive = true },
            new CustomerPipeline { Id = 3, Name = "Proposal", SortOrder = 3, IsActive = true },
            new CustomerPipeline { Id = 4, Name = "Negotiation", SortOrder = 4, IsActive = true },
            new CustomerPipeline { Id = 5, Name = "Won", SortOrder = 5, IsActive = true },
            new CustomerPipeline { Id = 6, Name = "Lost", SortOrder = 6, IsActive = true });
        modelBuilder.Entity<ScheduledPost>().HasOne(item => item.GoogleBusinessPost).WithMany().HasForeignKey(item => item.GoogleBusinessPostId).OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<ReviewReply>().HasOne(reply => reply.Review).WithMany().HasForeignKey(reply => reply.ReviewId).OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<Workflow>().HasIndex(workflow => new { workflow.Status, workflow.UpdatedAt });
        modelBuilder.Entity<WorkflowExecution>().HasIndex(execution => new { execution.WorkflowId, execution.CreatedAt });
        modelBuilder.Entity<WorkflowExecutionLog>().HasIndex(log => new { log.WorkflowExecutionId, log.CreatedAt });
    }

    private static Permission PermissionSeed(string name) => new() { Id = PermissionId(name), Name = name };

    private static int PermissionId(string name) => name switch
    {
        "CRM.View" => 1,
        "CRM.Create" => 2,
        "CRM.Edit" => 3,
        "CRM.Delete" => 4,
        "Reviews.View" => 5,
        "Reviews.Reply" => 6,
        "Reviews.Publish" => 7,
        "Posts.View" => 8,
        "Posts.Create" => 9,
        "Posts.Publish" => 10,
        "Images.Generate" => 11,
        "Workflow.Execute" => 12,
        "Agents.Run" => 13,
        "Monitoring.View" => 14,
        "Organization.Manage" => 15,
        "Reviews.Delete" => 16,
        "Posts.Edit" => 17,
        "Posts.Delete" => 18,
        "Images.View" => 19,
        "Images.Delete" => 20,
        "Workflows.View" => 21,
        "Workflows.Create" => 22,
        "Workflows.Edit" => 23,
        "Workflows.Delete" => 24,
        "Workflows.Execute" => 25,
        "Agents.View" => 26,
        "Agents.Create" => 27,
        "Agents.Edit" => 28,
        "Agents.Delete" => 29,
        "Users.Invite" => 30,
        "Users.Edit" => 31,
        "Users.Delete" => 32,
        "Users.AssignRoles" => 33,
        "Settings.Manage" => 34,
        "Analytics.View" => 35,
        _ => throw new ArgumentOutOfRangeException(nameof(name), name, "Unsupported permission.")
    };
}
