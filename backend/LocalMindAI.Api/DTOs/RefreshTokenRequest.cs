using System.ComponentModel.DataAnnotations;

namespace LocalMindAI.Api.DTOs;

public class RefreshTokenRequest
{
    [Required]
    [MinLength(32)]
    public string RefreshToken { get; set; } = string.Empty;
}
