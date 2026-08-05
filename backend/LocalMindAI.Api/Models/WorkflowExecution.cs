namespace LocalMindAI.Api.Models;

public class WorkflowExecution
{
    public int Id { get; set; }
    public int WorkflowId { get; set; }
    public string Status { get; set; } = "Pending";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public int Progress { get; set; }
    public string CurrentStep { get; set; } = string.Empty;
    public string Error { get; set; } = string.Empty;
}
