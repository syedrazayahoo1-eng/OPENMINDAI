using System.ComponentModel.DataAnnotations.Schema;

namespace LocalMindAI.Api.Models;

public class Workflow
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    [NotMapped]
    public string Definition { get; set; } = string.Empty;
    public string Status { get; set; } = "Draft";
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public List<WorkflowStep> Steps { get; set; } = [];
    public List<WorkflowExecution> Executions { get; set; } = [];
}
