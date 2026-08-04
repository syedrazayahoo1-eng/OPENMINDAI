using System.Net;
using System.Text.Json;

namespace LocalMindAI.Api.Middleware;

public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ErrorHandlingMiddleware> _logger;
    private readonly IWebHostEnvironment _environment;

    public ErrorHandlingMiddleware(
        RequestDelegate next,
        ILogger<ErrorHandlingMiddleware> logger,
        IWebHostEnvironment environment)
    {
        _next = next;
        _logger = logger;
        _environment = environment;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Unhandled exception. Message: {Message}. Inner exception: {InnerException}. Stack trace: {StackTrace}",
                ex.Message,
                ex.InnerException?.Message,
                ex.StackTrace);

            await HandleExceptionAsync(context, ex);
        }
    }

    private Task HandleExceptionAsync(HttpContext context, Exception ex)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

        object response = _environment.IsDevelopment()
            ? new
            {
                message = ex.Message,
                innerException = ex.InnerException?.Message,
                stackTrace = ex.StackTrace
            }
            : new
            {
                status = context.Response.StatusCode,
                message = "An unexpected error occurred."
            };

        return context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}
