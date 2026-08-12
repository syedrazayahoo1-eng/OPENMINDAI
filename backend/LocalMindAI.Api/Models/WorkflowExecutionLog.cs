namespace LocalMindAI.Api.Models;

public class WorkflowExecutionLog
{
    public int Id { get; set; }
    public int WorkflowExecutionId { get; set; }
    public int WorkflowId { get; set; }
    public string StepName { get; set; } = string.Empty;
    public string Level { get; set; } = "Information";
    public string Message { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
