namespace LocalMindAI.Api.Models;

public class Customer
{
    public int Id { get; set; }
    public int OrganizationId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string LeadSource { get; set; } = string.Empty;
    public string Status { get; set; } = "Lead";
    public string Tags { get; set; } = string.Empty;
    public string CreatedBy { get; set; } = string.Empty;
    public string UpdatedBy { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public List<CustomerNote> Notes { get; set; } = [];
    public List<CustomerActivity> Activities { get; set; } = [];
}
