using System.ComponentModel.DataAnnotations;

namespace LocalMindAI.Api.DTOs;

public sealed class OrganizationDto
{
    [Required, StringLength(160)] public string Name { get; set; } = string.Empty;
    [Required, StringLength(160)] public string DisplayName { get; set; } = string.Empty;
    [Url, StringLength(500)] public string? Website { get; set; }
    [EmailAddress, StringLength(254)] public string? Email { get; set; }
    [StringLength(64)] public string? Phone { get; set; }
    [StringLength(300)] public string? Address { get; set; }
    [StringLength(100)] public string? City { get; set; }
    [StringLength(100)] public string? State { get; set; }
    [StringLength(100)] public string? Country { get; set; }
    [Required, StringLength(100)] public string Timezone { get; set; } = "UTC";
    [Required, StringLength(8)] public string Currency { get; set; } = "USD";
    [Required, StringLength(50)] public string Language { get; set; } = "English";
    public string? LogoUrl { get; set; }
}
