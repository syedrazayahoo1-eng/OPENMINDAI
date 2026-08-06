namespace LocalMindAI.Api.Models;

public class CustomerActivity
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    public bool Completed { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Customer? Customer { get; set; }
}
