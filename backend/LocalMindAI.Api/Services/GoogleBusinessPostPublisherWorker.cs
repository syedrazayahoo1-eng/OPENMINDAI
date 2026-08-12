using LocalMindAI.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace LocalMindAI.Api.Services;

public sealed class GoogleBusinessPostPublisherWorker(IServiceScopeFactory scopeFactory, ILogger<GoogleBusinessPostPublisherWorker> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using var timer = new PeriodicTimer(TimeSpan.FromMinutes(1));
        do { await PublishDuePostsAsync(stoppingToken); } while (await timer.WaitForNextTickAsync(stoppingToken));
    }

    private async Task PublishDuePostsAsync(CancellationToken cancellationToken)
    {
        try
        {
            using var scope = scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var publisher = scope.ServiceProvider.GetRequiredService<IGoogleBusinessPostPublisher>();
            var due = await context.Set<Models.ScheduledPost>().Where(item => item.Status == "Scheduled" && item.ScheduledTime <= DateTime.UtcNow && item.RetryCount < 3).OrderBy(item => item.ScheduledTime).ToListAsync(cancellationToken);
            foreach (var scheduledPost in due) await publisher.PublishAsync(scheduledPost.GoogleBusinessPostId, scheduledPost, cancellationToken);
        }
        catch (Exception exception) when (!cancellationToken.IsCancellationRequested) { logger.LogError(exception, "Google Business scheduled publisher cycle failed."); }
    }
}
