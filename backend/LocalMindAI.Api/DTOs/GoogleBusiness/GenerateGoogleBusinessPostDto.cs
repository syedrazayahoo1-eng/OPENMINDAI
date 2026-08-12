using System.ComponentModel.DataAnnotations;

namespace LocalMindAI.Api.DTOs.GoogleBusiness;

public sealed class GenerateGoogleBusinessPostRequest
{
    [Required, StringLength(1200)]
    public string Prompt { get; init; } = string.Empty;

    [Required]
    public string Tone { get; init; } = string.Empty;
}

public sealed class GenerateGoogleBusinessPostResponse
{
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string CallToAction { get; init; } = string.Empty;
    public IReadOnlyList<string> SuggestedHashtags { get; init; } = [];
    public string SuggestedPublishTime { get; init; } = string.Empty;
}
