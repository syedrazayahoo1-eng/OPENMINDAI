using System.Diagnostics;
using System.Security.Claims;

namespace LocalMindAI.Api.Middleware;

public sealed class CorrelationMiddleware(RequestDelegate next, ILogger<CorrelationMiddleware> logger)
{
    public const string HeaderName = "X-Correlation-ID";

    public async Task Invoke(HttpContext context)
    {
        var correlationId = context.Request.Headers[HeaderName].FirstOrDefault();
        correlationId = string.IsNullOrWhiteSpace(correlationId) ? Guid.NewGuid().ToString("N") : correlationId[..Math.Min(correlationId.Length, 128)];
        context.TraceIdentifier = correlationId;
        context.Items[HeaderName] = correlationId;
        context.Response.Headers[HeaderName] = correlationId;
        context.Response.Headers["X-Trace-ID"] = Activity.Current?.TraceId.ToString() ?? context.TraceIdentifier;
        context.Response.Headers["X-Request-ID"] = context.TraceIdentifier;
        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "anonymous";
        using (logger.BeginScope(new Dictionary<string, object?> { ["CorrelationId"] = correlationId, ["TraceId"] = Activity.Current?.TraceId.ToString(), ["RequestId"] = context.TraceIdentifier, ["UserId"] = userId }))
            await next(context);
    }
}
