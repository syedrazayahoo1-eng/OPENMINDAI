using System.Collections.Concurrent;
using System.Security.Cryptography;

namespace LocalMindAI.Api.Services;

public sealed class GoogleOAuthStateStore
{
    private readonly ConcurrentDictionary<string, OAuthState> _states = new();

    public string Create(string redirectUri)
    {
        RemoveExpired();
        var state = Convert.ToHexString(RandomNumberGenerator.GetBytes(32));
        _states[state] = new OAuthState(redirectUri, DateTime.UtcNow.AddMinutes(10));
        return state;
    }

    public bool ValidateAndConsume(string state, string redirectUri)
    {
        if (string.IsNullOrWhiteSpace(state) || !_states.TryRemove(state, out var item)) return false;
        return item.ExpiresAt >= DateTime.UtcNow && string.Equals(item.RedirectUri, redirectUri, StringComparison.Ordinal);
    }

    private void RemoveExpired()
    {
        foreach (var item in _states.Where(entry => entry.Value.ExpiresAt < DateTime.UtcNow)) _states.TryRemove(item.Key, out _);
    }

    private sealed record OAuthState(string RedirectUri, DateTime ExpiresAt);
}
