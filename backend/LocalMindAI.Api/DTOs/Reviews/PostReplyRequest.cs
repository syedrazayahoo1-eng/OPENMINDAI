namespace LocalMindAI.Api.DTOs.Reviews;

public class PostReplyRequest
{
    public int ReviewId { get; set; }
    public string ReplyText { get; set; } = string.Empty;
}
