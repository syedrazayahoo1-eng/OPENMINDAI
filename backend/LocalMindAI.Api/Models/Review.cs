namespace LocalMindAI.Api.Models
{
    public class Review
    {
        public int Id { get; set; }

        public string ReviewerName { get; set; } = string.Empty;

        public int Rating { get; set; }

        public string ReviewText { get; set; } = string.Empty;

        public string? AIReply { get; set; }

        public bool IsReplied { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}