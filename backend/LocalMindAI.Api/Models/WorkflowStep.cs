namespace LocalMindAI.Api.Models;

public class WorkflowStep
{
    public int Id { get; set; }
    public int WorkflowId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string StepType { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public string Configuration { get; set; } = "{}";
}
