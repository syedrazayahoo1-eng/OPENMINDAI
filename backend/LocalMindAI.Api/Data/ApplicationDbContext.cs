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
}
