using LocalMindAI.Api.Data;
using LocalMindAI.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LocalMindAI.Api.Services;

public sealed record PublishPostResult(bool Succeeded, string ErrorMessage = "");
public interface IGoogleBusinessPostPublisher { Task<PublishPostResult> PublishAsync(int postId, ScheduledPost? scheduledPost = null, CancellationToken cancellationToken = default); }

public sealed class GoogleBusinessPostPublisher(ApplicationDbContext context, IGoogleBusinessProfileService googleBusinessService, ILogger<GoogleBusinessPostPublisher> logger) : IGoogleBusinessPostPublisher
{
    public async Task<PublishPostResult> PublishAsync(int postId, ScheduledPost? scheduledPost = null, CancellationToken cancellationToken = default)
    {
        var post = await context.Set<GoogleBusinessPost>().FindAsync([postId], cancellationToken);
        if (post is null) return new(false, "Google Business post was not found.");
        post.Status = "Publishing";
        post.UpdatedAt = DateTime.UtcNow;
        if (scheduledPost is not null) { scheduledPost.Status = "Publishing"; scheduledPost.LastAttempt = DateTime.UtcNow; scheduledPost.UpdatedAt = DateTime.UtcNow; }
        await context.SaveChangesAsync(cancellationToken);
        try
        {
            if (!await googleBusinessService.PublishPostAsync(post)) throw new InvalidOperationException("A connected Google Business account is required to publish this post.");
            var now = DateTime.UtcNow;
            post.Status = "Published";
            post.PublishedTime = now;
            post.UpdatedAt = now;
            if (scheduledPost is not null) { scheduledPost.Status = "Published"; scheduledPost.PublishedTime = now; scheduledPost.ErrorMessage = string.Empty; scheduledPost.UpdatedAt = now; }
            await context.SaveChangesAsync(cancellationToken);
            return new(true);
        }
        catch (Exception exception)
        {
            logger.LogWarning(exception, "Google Business post {PostId} publish failed.", postId);
            post.Status = "Failed";
            post.UpdatedAt = DateTime.UtcNow;
            if (scheduledPost is not null) { scheduledPost.RetryCount++; scheduledPost.ErrorMessage = exception.Message; scheduledPost.Status = scheduledPost.RetryCount >= 3 ? "Failed" : "Scheduled"; scheduledPost.UpdatedAt = DateTime.UtcNow; }
            await context.SaveChangesAsync(cancellationToken);
            return new(false, exception.Message);
        }
    }
}
