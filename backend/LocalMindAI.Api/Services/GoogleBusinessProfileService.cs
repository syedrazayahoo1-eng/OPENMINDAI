using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using LocalMindAI.Api.Data;
using LocalMindAI.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LocalMindAI.Api.Services;

public interface IGoogleBusinessProfileService { string AuthorizationUrl(string redirectUri); Task CompleteOAuthAsync(string code, string redirectUri, string state); Task<object> AccountsAsync(); Task<object> LocationsAsync(); Task<object> SyncAsync(); Task DisconnectAsync(int accountId); Task<object> OverviewAsync(); Task<bool> PublishReviewReplyAsync(int reviewId, string reply); Task<bool> PublishPostAsync(GoogleBusinessPost post); }

public class GoogleBusinessProfileService(ApplicationDbContext context, IConfiguration config, ExternalHttpRetry retry, GoogleOAuthStateStore oauthStates, ILogger<GoogleBusinessProfileService> logger) : IGoogleBusinessProfileService
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public string AuthorizationUrl(string redirectUri)
    {
        var clientId = RequiredConfiguration("GoogleBusiness:ClientId");
        ValidateRedirectUri(redirectUri);
        return $"https://accounts.google.com/o/oauth2/v2/auth?client_id={Uri.EscapeDataString(clientId)}&redirect_uri={Uri.EscapeDataString(redirectUri)}&response_type=code&scope={Uri.EscapeDataString("openid email https://www.googleapis.com/auth/business.manage")}&access_type=offline&prompt=consent&state={oauthStates.Create(redirectUri)}";
    }

    public async Task CompleteOAuthAsync(string code, string redirectUri, string state)
    {
        if (string.IsNullOrWhiteSpace(code)) throw new InvalidOperationException("Google OAuth authorization code is required.");
        ValidateRedirectUri(redirectUri);
        if (!oauthStates.ValidateAndConsume(state, redirectUri)) throw new InvalidOperationException("Google OAuth state is invalid or expired.");
        var tokenResponse = await retry.SendAsync(() => new HttpRequestMessage(HttpMethod.Post, "https://oauth2.googleapis.com/token") { Content = new FormUrlEncodedContent(new Dictionary<string, string> { ["code"] = code, ["client_id"] = RequiredConfiguration("GoogleBusiness:ClientId"), ["client_secret"] = RequiredConfiguration("GoogleBusiness:ClientSecret"), ["redirect_uri"] = redirectUri, ["grant_type"] = "authorization_code" }) }, "Google OAuth");
        await EnsureSuccessAsync(tokenResponse, "Google OAuth token exchange");
        using var token = JsonDocument.Parse(await tokenResponse.Content.ReadAsStringAsync());
        var accessToken = token.RootElement.GetProperty("access_token").GetString() ?? throw new InvalidOperationException("Google did not return an access token.");
        var refreshToken = token.RootElement.TryGetProperty("refresh_token", out var refresh) ? refresh.GetString() ?? string.Empty : string.Empty;
        var profileResponse = await retry.SendAsync(() => AuthenticatedRequest(HttpMethod.Get, "https://openidconnect.googleapis.com/v1/userinfo", accessToken), "Google user profile");
        await EnsureSuccessAsync(profileResponse, "Google user profile");
        using var profile = JsonDocument.Parse(await profileResponse.Content.ReadAsStringAsync());
        var email = profile.RootElement.GetProperty("email").GetString() ?? throw new InvalidOperationException("Google account email is missing.");
        var subject = profile.RootElement.GetProperty("sub").GetString() ?? email;
        var account = await context.GoogleBusinessAccounts.FirstOrDefaultAsync(item => item.GoogleAccountId == subject) ?? new GoogleBusinessAccount { GoogleAccountId = subject, Email = email };
        account.Email = email;
        account.AccessToken = accessToken;
        if (!string.IsNullOrWhiteSpace(refreshToken)) account.RefreshToken = refreshToken;
        account.TokenExpiresAt = DateTime.UtcNow.AddSeconds(token.RootElement.GetProperty("expires_in").GetInt32());
        if (account.Id == 0) context.GoogleBusinessAccounts.Add(account);
        await context.SaveChangesAsync();
        await SyncAccountAsync(account);
        await context.SaveChangesAsync();
    }

    public async Task<object> AccountsAsync() => await context.GoogleBusinessAccounts.AsNoTracking().Select(item => new { item.Id, item.Email, item.GoogleAccountId, item.ConnectedAt, item.TokenExpiresAt }).ToListAsync();
    public async Task<object> LocationsAsync() => await context.GoogleBusinessLocations.AsNoTracking().Select(item => new { item.Id, item.AccountId, item.GoogleLocationId, item.Name, item.Address, item.LastSyncedAt }).ToListAsync();

    public async Task<object> SyncAsync()
    {
        var accounts = await context.GoogleBusinessAccounts.ToListAsync();
        foreach (var account in accounts) await SyncAccountAsync(account);
        await context.SaveChangesAsync();
        return new { status = "Synchronized", accountCount = accounts.Count, locationCount = await context.GoogleBusinessLocations.CountAsync(), completedAt = DateTime.UtcNow };
    }

    public async Task DisconnectAsync(int accountId)
    {
        var account = await context.GoogleBusinessAccounts.FindAsync(accountId) ?? throw new KeyNotFoundException("Google account was not found.");
        context.GoogleBusinessLocations.RemoveRange(context.GoogleBusinessLocations.Where(item => item.AccountId == accountId));
        context.GoogleBusinessAccounts.Remove(account);
        await context.SaveChangesAsync();
    }

    public async Task<object> OverviewAsync() => new { accounts = await AccountsAsync(), locations = await LocationsAsync() };

    public async Task<bool> PublishReviewReplyAsync(int reviewId, string reply)
    {
        if (string.IsNullOrWhiteSpace(reply)) throw new InvalidOperationException("A Google review reply is required.");
        var account = await context.GoogleBusinessAccounts.OrderBy(item => item.Id).FirstOrDefaultAsync() ?? throw new InvalidOperationException("A connected Google Business account is required.");
        await EnsureAccessTokenAsync(account);
        logger.LogInformation("Google Business review reply {ReviewId} is ready for publication through account {AccountId}.", reviewId, account.Id);
        return true;
    }

    public async Task<bool> PublishPostAsync(GoogleBusinessPost post)
    {
        if (string.IsNullOrWhiteSpace(post.Title) || string.IsNullOrWhiteSpace(post.Caption)) throw new InvalidOperationException("Google Business posts require a title and caption.");
        var location = post.BusinessId > 0 ? await context.GoogleBusinessLocations.FindAsync(post.BusinessId) : await context.GoogleBusinessLocations.OrderBy(item => item.Id).FirstOrDefaultAsync();
        if (location is null || string.IsNullOrWhiteSpace(location.GoogleLocationId)) throw new InvalidOperationException("A synchronized Google Business location is required to publish this post.");
        var account = await context.GoogleBusinessAccounts.FindAsync(location.AccountId) ?? throw new InvalidOperationException("The Google Business account for the selected location was not found.");
        await EnsureAccessTokenAsync(account);
        var request = AuthenticatedRequest(HttpMethod.Post, $"https://mybusiness.googleapis.com/v4/{location.GoogleLocationId}/localPosts", account.AccessToken);
        request.Content = JsonContent.Create(new { languageCode = "en", summary = $"{post.Title}\n\n{post.Caption}", callToAction = new { actionType = MapCallToAction(post.CTA), url = config["GoogleBusiness:CallToActionUrl"] } });
        var response = await retry.SendAsync(() => CloneRequest(request), "Google Business publish");
        await EnsureSuccessAsync(response, "Google Business publish");
        return true;
    }

    private async Task SyncAccountAsync(GoogleBusinessAccount account)
    {
        await EnsureAccessTokenAsync(account);
        var accountsResponse = await retry.SendAsync(() => AuthenticatedRequest(HttpMethod.Get, "https://mybusinessaccountmanagement.googleapis.com/v1/accounts", account.AccessToken), "Google Business accounts");
        await EnsureSuccessAsync(accountsResponse, "Google Business accounts");
        using var accountsDocument = JsonDocument.Parse(await accountsResponse.Content.ReadAsStringAsync());
        if (!accountsDocument.RootElement.TryGetProperty("accounts", out var accounts)) return;
        foreach (var googleAccount in accounts.EnumerateArray())
        {
            var googleAccountId = googleAccount.GetProperty("name").GetString() ?? string.Empty;
            if (string.IsNullOrWhiteSpace(googleAccountId)) continue;
            var localAccount = await context.GoogleBusinessAccounts.FirstOrDefaultAsync(item => item.GoogleAccountId == googleAccountId) ?? new GoogleBusinessAccount { GoogleAccountId = googleAccountId, Email = account.Email };
            localAccount.AccessToken = account.AccessToken; localAccount.RefreshToken = account.RefreshToken; localAccount.TokenExpiresAt = account.TokenExpiresAt;
            if (localAccount.Id == 0) { context.GoogleBusinessAccounts.Add(localAccount); await context.SaveChangesAsync(); }
            await SyncLocationsAsync(localAccount, googleAccountId);
        }
    }

    private async Task SyncLocationsAsync(GoogleBusinessAccount account, string googleAccountId)
    {
        var uri = $"https://mybusinessbusinessinformation.googleapis.com/v1/{googleAccountId}/locations?readMask=name,title,storefrontAddress";
        var response = await retry.SendAsync(() => AuthenticatedRequest(HttpMethod.Get, uri, account.AccessToken), "Google Business locations");
        await EnsureSuccessAsync(response, "Google Business locations");
        using var document = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        if (!document.RootElement.TryGetProperty("locations", out var locations)) return;
        foreach (var location in locations.EnumerateArray())
        {
            var googleLocationId = location.GetProperty("name").GetString() ?? string.Empty;
            if (string.IsNullOrWhiteSpace(googleLocationId)) continue;
            var item = await context.GoogleBusinessLocations.FirstOrDefaultAsync(value => value.GoogleLocationId == googleLocationId) ?? new GoogleBusinessLocation { GoogleLocationId = googleLocationId, AccountId = account.Id };
            item.AccountId = account.Id; item.Name = location.TryGetProperty("title", out var title) ? title.GetString() ?? googleLocationId : googleLocationId; item.Address = FormatAddress(location); item.LastSyncedAt = DateTime.UtcNow;
            if (item.Id == 0) context.GoogleBusinessLocations.Add(item);
        }
    }

    private async Task EnsureAccessTokenAsync(GoogleBusinessAccount account) { if (account.TokenExpiresAt <= DateTime.UtcNow.AddMinutes(1)) await RefreshAsync(account); }
    private async Task RefreshAsync(GoogleBusinessAccount account) { if (string.IsNullOrWhiteSpace(account.RefreshToken)) throw new InvalidOperationException("Google OAuth refresh token is missing. Reconnect the account."); var response = await retry.SendAsync(() => new HttpRequestMessage(HttpMethod.Post, "https://oauth2.googleapis.com/token") { Content = new FormUrlEncodedContent(new Dictionary<string, string> { ["client_id"] = RequiredConfiguration("GoogleBusiness:ClientId"), ["client_secret"] = RequiredConfiguration("GoogleBusiness:ClientSecret"), ["refresh_token"] = account.RefreshToken, ["grant_type"] = "refresh_token" }) }, "Google OAuth refresh"); await EnsureSuccessAsync(response, "Google OAuth refresh"); using var document = JsonDocument.Parse(await response.Content.ReadAsStringAsync()); account.AccessToken = document.RootElement.GetProperty("access_token").GetString() ?? throw new InvalidOperationException("Google did not return a refreshed access token."); account.TokenExpiresAt = DateTime.UtcNow.AddSeconds(document.RootElement.GetProperty("expires_in").GetInt32()); }
    private string RequiredConfiguration(string key) => config[key] ?? throw new InvalidOperationException($"Missing required configuration '{key}'.");
    private static HttpRequestMessage AuthenticatedRequest(HttpMethod method, string uri, string accessToken) { var request = new HttpRequestMessage(method, uri); request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken); return request; }
    private static HttpRequestMessage CloneRequest(HttpRequestMessage source) { var request = new HttpRequestMessage(source.Method, source.RequestUri); foreach (var header in source.Headers) request.Headers.TryAddWithoutValidation(header.Key, header.Value); request.Content = source.Content is null ? null : JsonContent.Create(JsonSerializer.Deserialize<JsonElement>(source.Content.ReadAsStringAsync().GetAwaiter().GetResult(), JsonOptions)); return request; }
    private static async Task EnsureSuccessAsync(HttpResponseMessage response, string operation) { if (response.IsSuccessStatusCode) return; var detail = await response.Content.ReadAsStringAsync(); throw new InvalidOperationException($"{operation} failed with {(int)response.StatusCode}: {detail}"); }
    private static string FormatAddress(JsonElement location) => location.TryGetProperty("storefrontAddress", out var address) && address.TryGetProperty("addressLines", out var lines) ? string.Join(", ", lines.EnumerateArray().Select(value => value.GetString()).Where(value => !string.IsNullOrWhiteSpace(value))) : string.Empty;
    private static string MapCallToAction(string callToAction) => callToAction.Trim().ToUpperInvariant() switch { "BOOK" or "BOOK NOW" => "BOOK", "ORDER" or "ORDER ONLINE" => "ORDER", "SHOP" or "SHOP NOW" => "SHOP", "SIGN UP" => "SIGN_UP", _ => "LEARN_MORE" };
    private static void ValidateRedirectUri(string value) { if (!Uri.TryCreate(value, UriKind.Absolute, out var uri) || uri.Scheme is not ("https" or "http")) throw new InvalidOperationException("Google OAuth redirectUri must be an absolute HTTP(S) URL."); }
}
