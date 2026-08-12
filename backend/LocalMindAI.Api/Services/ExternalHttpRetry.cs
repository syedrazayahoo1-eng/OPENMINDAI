using System.Net;

namespace LocalMindAI.Api.Services;

public sealed class ExternalHttpRetry(IHttpClientFactory clients, ILogger<ExternalHttpRetry> logger)
{
    public async Task<HttpResponseMessage> SendAsync(Func<HttpRequestMessage> requestFactory, string integration, CancellationToken cancellationToken = default)
    {
        const int maxAttempts = 3;
        for (var attempt = 1; ; attempt++)
        {
            using var request = requestFactory();
            try
            {
                var response = await clients.CreateClient("ExternalServices").SendAsync(request, cancellationToken);
                if (attempt == maxAttempts || !IsTransient(response.StatusCode)) return response;
                response.Dispose();
                await DelayAsync(attempt, null, cancellationToken);
            }
            catch (HttpRequestException exception) when (attempt < maxAttempts)
            {
                logger.LogWarning(exception, "{Integration} request failed on attempt {Attempt}; retrying.", integration, attempt);
                await DelayAsync(attempt, null, cancellationToken);
            }
        }
    }

    private static bool IsTransient(HttpStatusCode statusCode) => statusCode == HttpStatusCode.RequestTimeout || statusCode == (HttpStatusCode)429 || (int)statusCode >= 500;
    private static Task DelayAsync(int attempt, TimeSpan? retryAfter, CancellationToken cancellationToken) => Task.Delay(retryAfter ?? TimeSpan.FromMilliseconds(250 * Math.Pow(2, attempt - 1)), cancellationToken);
}
