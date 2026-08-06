using LocalMindAI.Api.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using LocalMindAI.Api.Services.AI;
using Microsoft.OpenApi;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrWhiteSpace(jwtKey) || jwtKey.Length < 32)
    throw new InvalidOperationException("Jwt:Key must be supplied through a secure configuration provider and be at least 32 characters long.");

if (builder.Environment.IsProduction() && !(builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()?.Any() ?? false))
    throw new InvalidOperationException("Cors:AllowedOrigins must contain at least one trusted frontend origin in production.");

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddJsonConsole();

// -------------------------
// Services
// -------------------------

builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddSingleton<LocalMindAI.Api.Hubs.HubPresenceRegistry>();
builder.Services.AddHealthChecks()
    .AddCheck<LocalMindAI.Api.Services.DatabaseHealthCheck>("database", tags: ["ready"])
    .AddCheck<LocalMindAI.Api.Services.PlatformDependenciesHealthCheck>("platform-dependencies", tags: ["ready"]);
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddFixedWindowLimiter("api", limiter => new FixedWindowRateLimiterOptions { PermitLimit = 120, Window = TimeSpan.FromMinutes(1), QueueLimit = 0, AutoReplenishment = true });
    options.OnRejected = async (context, cancellationToken) =>
    {
        context.HttpContext.Response.ContentType = "application/json";
        await context.HttpContext.Response.WriteAsync("{\"message\":\"Too many requests. Please retry shortly.\"}", cancellationToken);
    };
});
if (!string.IsNullOrWhiteSpace(builder.Configuration["ApplicationInsights:ConnectionString"]))
    builder.Services.AddApplicationInsightsTelemetry();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy", policy =>
    {
        var origins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
        if (builder.Environment.IsDevelopment()) policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
        else policy.WithOrigins(origins).AllowAnyHeader().AllowAnyMethod();
    });
});

// Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],

        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtKey))
    };

    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            context.HttpContext.RequestServices.GetRequiredService<ILoggerFactory>().CreateLogger("Authentication").LogWarning(context.Exception, "JWT authentication failed.");
            return Task.CompletedTask;
        },

        OnChallenge = context =>
        {
            context.HttpContext.RequestServices.GetRequiredService<ILoggerFactory>().CreateLogger("Authentication").LogDebug("JWT challenge issued for {Path}.", context.Request.Path);
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization();
builder.Services.AddScoped<LocalMindAI.Api.Services.IAuthTokenService, LocalMindAI.Api.Services.AuthTokenService>();
builder.Services.AddSingleton<LocalMindAI.Api.Services.IExternalServicesDiagnostics, LocalMindAI.Api.Services.ExternalServicesDiagnostics>();
builder.Services.AddSingleton<LocalMindAI.Api.Services.ExternalHttpRetry>();
builder.Services.AddSingleton<LocalMindAI.Api.Services.GoogleOAuthStateStore>();

// AI Service
builder.Services.AddScoped<LocalMindAI.Api.Services.AIService>();

// Review Service
builder.Services.AddScoped<LocalMindAI.Api.Services.IReviewService, LocalMindAI.Api.Services.ReviewService>();
builder.Services.AddScoped<LocalMindAI.Api.Services.IAgentService, LocalMindAI.Api.Services.AgentService>();
builder.Services.AddScoped<LocalMindAI.Api.Services.IGoogleBusinessProfileService, LocalMindAI.Api.Services.GoogleBusinessProfileService>();
builder.Services.AddScoped<LocalMindAI.Api.Services.IWorkflowService, LocalMindAI.Api.Services.WorkflowService>();
builder.Services.AddSingleton<LocalMindAI.Api.Services.WorkflowExecutionQueue>();
builder.Services.AddScoped<LocalMindAI.Api.Services.IWorkflowRuntimeService, LocalMindAI.Api.Services.WorkflowRuntimeService>();
builder.Services.AddScoped<LocalMindAI.Api.Services.IWorkflowNodeExecutor, LocalMindAI.Api.Services.WorkflowNodeExecutor>();
builder.Services.AddScoped<LocalMindAI.Api.Services.IGoogleBusinessPostPublisher, LocalMindAI.Api.Services.GoogleBusinessPostPublisher>();
builder.Services.AddHostedService<LocalMindAI.Api.Services.GoogleBusinessPostPublisherWorker>();
builder.Services.AddHostedService<LocalMindAI.Api.Services.WorkflowExecutionWorker>();

// AI Gateway (Azure OpenAI / Ollama providers + factory)
builder.Services.AddHttpClient("ExternalServices", client => client.Timeout = TimeSpan.FromSeconds(30));
builder.Services.AddHttpClient();
builder.Services.AddAIGateway(builder.Configuration);

// OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "LocalMindAI API",
        Version = "v1"
    });

    // JWT Bearer SecurityDefinition
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter 'Bearer' [space] and then your JWT token.\n\nExample: \"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...\""
    });

    // Global SecurityRequirement so the padlock icon appears on protected endpoints.
    // Microsoft.OpenApi v2+ requires a document-aware reference (OpenApiSecuritySchemeReference)
    // instead of the old OpenApiSecurityScheme.Reference property, and AddSecurityRequirement
    // now takes a Func<OpenApiDocument, OpenApiSecurityRequirement> delegate.
    options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
    {
        [new OpenApiSecuritySchemeReference("Bearer", document)] = new List<string>()
    });
});

var app = builder.Build();

// -------------------------
// Middleware
// -------------------------

app.UseMiddleware<LocalMindAI.Api.Middleware.ErrorHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else app.UseHsts();

app.UseHttpsRedirection();
app.Use(async (context, next) =>
{
    context.Response.Headers["X-Content-Type-Options"] = "nosniff";
    context.Response.Headers["X-Frame-Options"] = "DENY";
    context.Response.Headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
    context.Response.Headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()";
    await next();
});

// Enable CORS
app.UseCors("ReactPolicy");
app.UseRateLimiter();

// Authentication
app.UseAuthentication();
app.UseAuthorization();

// Controllers
app.MapControllers().RequireRateLimiting("api");
app.MapHub<LocalMindAI.Api.Hubs.WorkflowMonitoringHub>("/hubs/workflow-monitoring").RequireRateLimiting("api");
app.MapHealthChecks("/healthz", new HealthCheckOptions
{
    Predicate = _ => true,
    ResultStatusCodes = { [Microsoft.Extensions.Diagnostics.HealthChecks.HealthStatus.Degraded] = StatusCodes.Status200OK },
    ResponseWriter = async (context, report) =>
    {
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync(JsonSerializer.Serialize(new { status = report.Status.ToString(), checks = report.Entries.ToDictionary(entry => entry.Key, entry => new { status = entry.Value.Status.ToString(), description = entry.Value.Description, data = entry.Value.Data }) }));
    }
});

app.Run();
