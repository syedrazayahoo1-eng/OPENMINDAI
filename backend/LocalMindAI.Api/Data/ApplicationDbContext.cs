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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<User>().HasIndex(user => user.Email).IsUnique();
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
}
