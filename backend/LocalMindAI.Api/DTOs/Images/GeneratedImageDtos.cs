using System.ComponentModel.DataAnnotations;

namespace LocalMindAI.Api.DTOs.Images;

public sealed class GenerateImagesRequest
{
    public int BusinessId { get; init; }
    [Required, StringLength(800)] public string Prompt { get; init; } = string.Empty;
    [Required] public string BusinessCategory { get; init; } = string.Empty;
    [Required] public string Style { get; init; } = string.Empty;
    [Required] public string AspectRatio { get; init; } = string.Empty;
    public bool UseBrandColors { get; init; }
    public bool UseBrandLogo { get; init; }
    public bool IncludeText { get; init; }
    public bool GenerateVariations { get; init; }
}

public sealed class GeneratedImageDto
{
    public int Id { get; init; }
    public int BusinessId { get; init; }
    public string Prompt { get; init; } = string.Empty;
    public string Style { get; init; } = string.Empty;
    public string AspectRatio { get; init; } = string.Empty;
    public string ImageUrl { get; init; } = string.Empty;
    public string ThumbnailUrl { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }
}
