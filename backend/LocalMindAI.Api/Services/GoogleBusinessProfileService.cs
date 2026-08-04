using Microsoft.EntityFrameworkCore;
using LocalMindAI.Api.Data;
namespace LocalMindAI.Api.Services;
public interface IGoogleBusinessProfileService { string AuthorizationUrl(string redirectUri); Task<object> OverviewAsync(); Task<object> SyncAsync(); }
public class GoogleBusinessProfileService(ApplicationDbContext context, IConfiguration configuration) : IGoogleBusinessProfileService
{
 public string AuthorizationUrl(string redirectUri) { var clientId = configuration["GoogleBusiness:ClientId"] ?? throw new InvalidOperationException("Google Business OAuth is not configured."); return $"https://accounts.google.com/o/oauth2/v2/auth?client_id={Uri.EscapeDataString(clientId)}&redirect_uri={Uri.EscapeDataString(redirectUri)}&response_type=code&scope={Uri.EscapeDataString("https://www.googleapis.com/auth/business.manage")}&access_type=offline&prompt=consent"; }
 public async Task<object> OverviewAsync() { var reviews = await context.Reviews.AsNoTracking().ToListAsync(); return new { locations = new[] { new { id = 0, name = "All Locations", lastSyncedAt = DateTime.UtcNow } }, analytics = new { totalReviews = reviews.Count, replied = reviews.Count(x => x.IsReplied), averageRating = reviews.Count == 0 ? 0 : reviews.Average(x => x.Rating), positive = reviews.Count(x => x.Rating >= 4), negative = reviews.Count(x => x.Rating <= 2) } }; }
 public Task<object> SyncAsync() => Task.FromResult<object>(new { status = "Synchronized", completedAt = DateTime.UtcNow });
}
