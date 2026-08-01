using LocalMindAI.Api.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using LocalMindAI.Api.Services.AI;
using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);

// -------------------------
// Services
// -------------------------

builder.Services.AddControllers();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
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
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
    };

    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine($"JWT ERROR: {context.Exception.GetType().Name}: {context.Exception.Message}");
            return Task.CompletedTask;
        },

        OnChallenge = context =>
        {
            Console.WriteLine("JWT CHALLENGE");
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization();

// AI Service
builder.Services.AddScoped<LocalMindAI.Api.Services.AIService>();

// Review Service
builder.Services.AddScoped<LocalMindAI.Api.Services.IReviewService, LocalMindAI.Api.Services.ReviewService>();

// AI Gateway (Azure OpenAI / Ollama providers + factory)
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

app.UseHttpsRedirection();

// Enable CORS
app.UseCors("ReactPolicy");

// Authentication
app.UseAuthentication();
app.UseAuthorization();

// Controllers
app.MapControllers();

app.Run();