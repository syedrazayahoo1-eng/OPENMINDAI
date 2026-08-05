using System.ComponentModel.DataAnnotations;

namespace LocalMindAI.Api.DTOs.GoogleBusiness;

public sealed class GenerateGoogleBusinessImageRequest
{
    [Required, StringLength(800)]
    public string Prompt { get; init; } = string.Empty;

    [Required]
    public string Style { get; init; } = string.Empty;

    [Required]
    public string AspectRatio { get; init; } = string.Empty;
}

public sealed class GenerateGoogleBusinessImageResponse
{
    public string ImageUrl { get; init; } = string.Empty;
    public string PromptUsed { get; init; } = string.Empty;
    public string GenerationTime { get; init; } = string.Empty;
}
