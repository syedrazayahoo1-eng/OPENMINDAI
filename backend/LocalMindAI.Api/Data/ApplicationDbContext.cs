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
    public DbSet<ChatMessage> ChatMessages => Set<ChatMessage>();
    public DbSet<Review> Reviews => Set<Review>();
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
        modelBuilder.Entity<Agent>().HasIndex(agent => new { agent.Status, agent.UpdatedAt });
        modelBuilder.Entity<Review>().HasIndex(review => review.CreatedAt);
        modelBuilder.Entity<Workflow>().HasIndex(workflow => new { workflow.Status, workflow.UpdatedAt });
        modelBuilder.Entity<WorkflowExecution>().HasIndex(execution => new { execution.WorkflowId, execution.CreatedAt });
        modelBuilder.Entity<WorkflowExecutionLog>().HasIndex(log => new { log.WorkflowExecutionId, log.CreatedAt });
    }
}
