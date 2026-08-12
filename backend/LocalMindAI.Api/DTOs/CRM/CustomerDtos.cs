using System.ComponentModel.DataAnnotations;

namespace LocalMindAI.Api.DTOs.CRM;

public sealed class CustomerRequest
{
    public int OrganizationId { get; init; }
    [Required, StringLength(100)] public string FirstName { get; init; } = string.Empty;
    [StringLength(100)] public string LastName { get; init; } = string.Empty;
    [StringLength(200)] public string Company { get; init; } = string.Empty;
    [EmailAddress, StringLength(320)] public string Email { get; init; } = string.Empty;
    [StringLength(50)] public string Phone { get; init; } = string.Empty;
    [StringLength(300)] public string Address { get; init; } = string.Empty;
    [StringLength(100)] public string City { get; init; } = string.Empty;
    [StringLength(100)] public string State { get; init; } = string.Empty;
    [StringLength(100)] public string Country { get; init; } = string.Empty;
    [StringLength(100)] public string LeadSource { get; init; } = string.Empty;
    [Required, StringLength(50)] public string Status { get; init; } = "Lead";
    [StringLength(500)] public string Tags { get; init; } = string.Empty;
}

public sealed class CustomerNoteRequest { [Required, StringLength(4000)] public string Content { get; init; } = string.Empty; }
public sealed class CustomerActivityRequest { [Required, RegularExpression("Call|Email|Meeting|Task")] public string Type { get; init; } = string.Empty; [Required, StringLength(2000)] public string Description { get; init; } = string.Empty; public DateTime? DueDate { get; init; } public bool Completed { get; init; } }
