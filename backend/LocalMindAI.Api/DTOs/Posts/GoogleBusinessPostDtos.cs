using System.ComponentModel.DataAnnotations;

namespace LocalMindAI.Api.DTOs.Posts;

public sealed class GeneratePostRequest
{
    [Required, StringLength(1200)] public string Prompt { get; init; } = string.Empty;
    [Required] public string PostType { get; init; } = string.Empty;
    public string TargetAudience { get; init; } = string.Empty;
    public string Location { get; init; } = string.Empty;
    public string CTA { get; init; } = string.Empty;
    [Range(100, 1500)] public int CharacterLimit { get; init; } = 1500;
    public bool IncludeHashtags { get; init; } = true;
}

public sealed class GeneratePostResponse
{
    public string Title { get; init; } = string.Empty;
    public string Caption { get; init; } = string.Empty;
    public string CTA { get; init; } = string.Empty;
    public string Hashtags { get; init; } = string.Empty;
    public int SeoScore { get; init; }
    public int ReadabilityScore { get; init; }
}

public sealed class SaveGoogleBusinessPostRequest
{
    public int BusinessId { get; init; }
    [Required] public string PostType { get; init; } = string.Empty;
    [Required, StringLength(1200)] public string Prompt { get; init; } = string.Empty;
    [Required, StringLength(58)] public string Title { get; init; } = string.Empty;
    [Required, StringLength(1500)] public string Caption { get; init; } = string.Empty;
    [StringLength(2_000_000)] public string ImageUrl { get; init; } = string.Empty;
    [StringLength(120)] public string CTA { get; init; } = string.Empty;
    [StringLength(500)] public string Hashtags { get; init; } = string.Empty;
}

public sealed class ScheduleGoogleBusinessPostRequest
{
    [Required] public DateTime? ScheduledTime { get; init; }
}

public sealed class GoogleBusinessPostDto
{
    public int Id { get; init; }
    public int BusinessId { get; init; }
    public string PostType { get; init; } = string.Empty;
    public string Prompt { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string Caption { get; init; } = string.Empty;
    public string ImageUrl { get; init; } = string.Empty;
    public string CTA { get; init; } = string.Empty;
    public string Hashtags { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
    public DateTime? ScheduledTime { get; init; }
    public DateTime? PublishedTime { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
}
