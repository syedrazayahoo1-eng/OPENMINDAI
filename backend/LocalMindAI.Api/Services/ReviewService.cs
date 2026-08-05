using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using LocalMindAI.Api.Data;
using LocalMindAI.Api.Models;
using LocalMindAI.Api.DTOs.Reviews;
using LocalMindAI.Api.Services.AI;
using LocalMindAI.Api.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace LocalMindAI.Api.Services;

/// <summary>
/// Review feature service. CRUD operations are unchanged from the original
/// implementation. <see cref="GenerateReplyAsync"/> now powers the Enterprise AI
/// Review Assistant: it calls the AI Gateway (<see cref="IAIProviderFactory"/>)
/// directly to obtain sentiment, priority, suggested tone, a short explanation,
/// and a ready-to-send reply in a single request, with defensive parsing so a
/// malformed AI response never breaks the endpoint.
/// </summary>
public class ReviewService : IReviewService
{
    private static readonly string[] ValidSentiments = { "Positive", "Neutral", "Negative", "Very Negative" };
    private static readonly string[] ValidPriorities = { "Low", "Medium", "High", "Critical" };
    private static readonly string[] ValidTones = { "Professional", "Friendly", "Apologetic", "Marketing", "Support" };

    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    private readonly ApplicationDbContext _context;
    private readonly IAIProviderFactory _providerFactory;
    private readonly ILogger<ReviewService> _logger;
    private readonly IHubContext<WorkflowMonitoringHub> _hub;
    private readonly IGoogleBusinessProfileService _googleBusiness;

    public ReviewService(ApplicationDbContext context, IAIProviderFactory providerFactory, ILogger<ReviewService> logger, IHubContext<WorkflowMonitoringHub> hub, IGoogleBusinessProfileService googleBusiness)
    {
        _context = context;
        _providerFactory = providerFactory;
        _logger = logger;
        _hub = hub;
        _googleBusiness = googleBusiness;
    }

    public async Task<IEnumerable<ReviewDto>> GetAllAsync()
    {
        return await _context.Reviews
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => MapToDto(r))
            .ToListAsync();
    }

    public async Task<ReviewDto?> GetByIdAsync(int id)
    {
        var review = await _context.Reviews.FindAsync(id);
        return review == null ? null : MapToDto(review);
    }

    public async Task<ReviewDto> CreateAsync(ReviewDto reviewDto)
    {
        var review = new Review
        {
            ReviewerName = reviewDto.ReviewerName,
            Rating = reviewDto.Rating,
            ReviewText = reviewDto.ReviewText,
            AIReply = reviewDto.AIReply,
            IsReplied = reviewDto.IsReplied,
            CreatedAt = DateTime.UtcNow
        };

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        var created = MapToDto(review);
        await PublishReviewUpdatedAsync(created);
        return created;
    }

    public async Task<ReviewDto?> UpdateAsync(int id, ReviewDto reviewDto)
    {
        var review = await _context.Reviews.FindAsync(id);
        if (review == null) return null;

        review.ReviewerName = reviewDto.ReviewerName;
        review.Rating = reviewDto.Rating;
        review.ReviewText = reviewDto.ReviewText;
        review.AIReply = reviewDto.AIReply;
        review.IsReplied = reviewDto.IsReplied;

        await _context.SaveChangesAsync();

        var updated = MapToDto(review);
        await PublishReviewUpdatedAsync(updated);
        return updated;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var review = await _context.Reviews.FindAsync(id);
        if (review == null) return false;

        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync();
        await _hub.Clients.All.SendAsync("ReviewUpdated", new { id, deleted = true });
        return true;
    }

    public async Task<ReviewReplyDto?> GetReplyAsync(int reviewId) => await _context.ReviewReplies.AsNoTracking().Where(reply => reply.ReviewId == reviewId).OrderByDescending(reply => reply.UpdatedAt).Select(reply => MapReply(reply)).FirstOrDefaultAsync();

    public async Task<ReviewReplyDto?> GenerateReplyAsync(int reviewId, GenerateReviewReplyRequest request)
    {
        var review = await _context.Reviews.FindAsync(reviewId);
        if (review == null) return null;
        var mode = NormalizeMode(request.Mode);
        if (mode is null || (mode == "Custom Prompt" && string.IsNullOrWhiteSpace(request.CustomPrompt))) return null;
        var prompt = BuildStudioPrompt(review, mode, request.CustomPrompt);
        var response = await _providerFactory.GetDefaultProvider().GenerateAsync(new AIRequest { Prompt = prompt, Temperature = 0.55, MaxTokens = 420, CorrelationId = $"review-reply-{reviewId}" });
        if (!response.IsSuccess) throw new InvalidOperationException(response.ErrorMessage);
        var reply = new ReviewReply { ReviewId = reviewId, Mode = mode, Prompt = prompt, GeneratedReply = response.Content.Trim(), EditedReply = response.Content.Trim(), Status = "Generated" };
        _context.ReviewReplies.Add(reply);
        await _context.SaveChangesAsync();
        return MapReply(reply);
    }

    public async Task<ReviewReplyDto?> SaveDraftAsync(int reviewId, SaveReviewReplyDraftRequest request)
    {
        var reply = await _context.ReviewReplies.Where(item => item.ReviewId == reviewId).OrderByDescending(item => item.UpdatedAt).FirstOrDefaultAsync();
        if (reply == null || string.IsNullOrWhiteSpace(request.EditedReply)) return null;
        reply.EditedReply = request.EditedReply.Trim(); reply.Status = "Draft"; reply.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(); return MapReply(reply);
    }

    public async Task<ReviewReplyDto?> PublishReplyAsync(int reviewId)
    {
        var review = await _context.Reviews.FindAsync(reviewId);
        var reply = await _context.ReviewReplies.Where(item => item.ReviewId == reviewId).OrderByDescending(item => item.UpdatedAt).FirstOrDefaultAsync();
        if (review == null || reply == null) return null;
        var published = await _googleBusiness.PublishReviewReplyAsync(reviewId, reply.EditedReply);
        reply.Status = published ? "Published" : "Queued"; reply.UpdatedAt = DateTime.UtcNow;
        if (published) { review.AIReply = reply.EditedReply; review.IsReplied = true; await PublishReviewUpdatedAsync(MapToDto(review)); }
        await _context.SaveChangesAsync(); return MapReply(reply);
    }

    /// <summary>
    /// Calls the AI Gateway once to obtain sentiment, priority, suggested tone,
    /// an explanation, and a generated reply for the given review using the
    /// provider selected by the AI Gateway configuration.
    /// </summary>
    private async Task<GenerateReplyResponse> AnalyzeAndGenerateReplyAsync(Review review)
    {
        var provider = _providerFactory.GetDefaultProvider();

        _logger.LogInformation(
            "Analyzing review {ReviewId} using configured AI provider '{ProviderName}'.",
            review.Id,
            provider.ProviderName);

        var aiRequest = BuildAnalysisRequest(review);

        var response = await provider.GenerateAsync(aiRequest).ConfigureAwait(false);

        if (!response.IsSuccess)
        {
            _logger.LogError("AI review analysis failed for review {ReviewId}: {Error}", review.Id, response.ErrorMessage);
            throw new Exception($"AI Error: {response.ErrorMessage}");
        }

        _logger.LogInformation(
            "Review {ReviewId} analyzed via '{ProviderName}' in {DurationMs}ms.",
            review.Id, response.ProviderName, response.DurationMs);

        return ParseAnalysis(response.Content, review);
    }

    private static AIRequest BuildAnalysisRequest(Review review)
    {
        var systemPrompt =
            "You are an enterprise customer review assistant. Analyze the customer review and respond with " +
            "STRICT JSON only — no markdown, no code fences, no commentary — matching exactly this schema: " +
            "{\"sentiment\":\"Positive|Neutral|Negative|Very Negative\"," +
            "\"priority\":\"Low|Medium|High|Critical\"," +
            "\"suggestedTone\":\"Professional|Friendly|Apologetic|Marketing|Support\"," +
            "\"explanation\":\"one short sentence describing why the review was scored this way\"," +
            "\"reply\":\"a ready-to-send reply to the customer, written in the suggested tone\"}. " +
            "Base sentiment and priority on both the star rating and the wording of the review text.";

        var userPrompt =
            $"Star rating: {review.Rating}/5\n" +
            $"Reviewer: {review.ReviewerName}\n" +
            $"Review text: \"{review.ReviewText}\"\n\n" +
            "Return only the JSON object described in your instructions.";

        return new AIRequest
        {
            SystemPrompt = systemPrompt,
            Prompt = userPrompt,
            Temperature = 0.4,
            MaxTokens = 500,
            CorrelationId = $"review-{review.Id}"
        };
    }

    /// <summary>
    /// Parses the AI's JSON analysis, defensively falling back to a rating-based
    /// heuristic for any field that is missing or does not match an allowed value —
    /// so a malformed or partial AI response never surfaces as an API failure.
    /// </summary>
    private GenerateReplyResponse ParseAnalysis(string rawContent, Review review)
    {
        RawAnalysis? parsed = null;

        try
        {
            var json = ExtractJson(rawContent);
            parsed = JsonSerializer.Deserialize<RawAnalysis>(json, JsonOptions);
        }
        catch (JsonException ex)
        {
            _logger.LogWarning(ex,
                "Failed to parse AI analysis JSON for review {ReviewId}. Falling back to heuristic scoring. Raw content: {RawContent}",
                review.Id, rawContent);
        }

        var sentiment = NormalizeSentiment(parsed?.Sentiment, review.Rating);
        var priority = NormalizePriority(parsed?.Priority, sentiment);
        var tone = NormalizeTone(parsed?.SuggestedTone, sentiment);

        var explanation = string.IsNullOrWhiteSpace(parsed?.Explanation)
            ? $"The review has a {review.Rating}-star rating, indicating {sentiment.ToLowerInvariant()} sentiment."
            : parsed!.Explanation.Trim();

        var reply = string.IsNullOrWhiteSpace(parsed?.Reply)
            ? rawContent.Trim()
            : parsed!.Reply.Trim();

        return new GenerateReplyResponse
        {
            GeneratedReply = reply,
            Sentiment = sentiment,
            Priority = priority,
            SuggestedTone = tone,
            Explanation = explanation
        };
    }

    private static string ExtractJson(string content)
    {
        var start = content.IndexOf('{');
        var end = content.LastIndexOf('}');

        return start >= 0 && end > start
            ? content.Substring(start, end - start + 1)
            : content;
    }

    private static string NormalizeSentiment(string? value, int rating)
    {
        var match = ValidSentiments.FirstOrDefault(s => string.Equals(s, value?.Trim(), StringComparison.OrdinalIgnoreCase));
        if (match != null) return match;

        // Fallback heuristic based on star rating when the AI output is missing or invalid.
        return rating switch
        {
            <= 1 => "Very Negative",
            2 => "Negative",
            3 => "Neutral",
            _ => "Positive"
        };
    }

    private static string NormalizePriority(string? value, string sentiment)
    {
        var match = ValidPriorities.FirstOrDefault(p => string.Equals(p, value?.Trim(), StringComparison.OrdinalIgnoreCase));
        if (match != null) return match;

        return sentiment switch
        {
            "Very Negative" => "Critical",
            "Negative" => "High",
            "Neutral" => "Medium",
            _ => "Low"
        };
    }

    private static string NormalizeTone(string? value, string sentiment)
    {
        var match = ValidTones.FirstOrDefault(t => string.Equals(t, value?.Trim(), StringComparison.OrdinalIgnoreCase));
        if (match != null) return match;

        return sentiment switch
        {
            "Very Negative" => "Apologetic",
            "Negative" => "Support",
            "Neutral" => "Professional",
            _ => "Friendly"
        };
    }

    private static string? NormalizeMode(string mode) => mode.Trim().ToLowerInvariant() switch
    {
        "professional" => "Professional",
        "friendly" => "Friendly",
        "premium" => "Premium",
        "custom prompt" => "Custom Prompt",
        _ => null
    };

    private static string BuildStudioPrompt(Review review, string mode, string? customPrompt)
    {
        var instruction = mode switch
        {
            "Friendly" => "Reply warmly and conversationally, with genuine appreciation and approachable language.",
            "Premium" => "Reply with refined, elevated hospitality language that conveys exceptional personal care.",
            "Custom Prompt" => customPrompt!.Trim(),
            _ => "Reply with a polished, concise, professional business tone that addresses the customer respectfully."
        };
        return $"You are writing a public Google Business review reply. {instruction} Use 2-4 sentences, no markdown, no invented claims, discounts, or dates. Customer: {review.ReviewerName}. Rating: {review.Rating}/5. Review: {review.ReviewText}";
    }

    private static ReviewReplyDto MapReply(ReviewReply reply) => new() { Id = reply.Id, ReviewId = reply.ReviewId, Mode = reply.Mode, Prompt = reply.Prompt, GeneratedReply = reply.GeneratedReply, EditedReply = reply.EditedReply, Status = reply.Status, CreatedAt = reply.CreatedAt, UpdatedAt = reply.UpdatedAt };

    private static ReviewDto MapToDto(Review review)
    {
        return new ReviewDto
        {
            Id = review.Id,
            ReviewerName = review.ReviewerName,
            Rating = review.Rating,
            ReviewText = review.ReviewText,
            AIReply = review.AIReply,
            IsReplied = review.IsReplied,
            CreatedAt = review.CreatedAt
        };
    }

    private Task PublishReviewUpdatedAsync(ReviewDto review) =>
        _hub.Clients.All.SendAsync("ReviewUpdated", review);

    private sealed class RawAnalysis
    {
        [JsonPropertyName("sentiment")]
        public string? Sentiment { get; set; }

        [JsonPropertyName("priority")]
        public string? Priority { get; set; }

        [JsonPropertyName("suggestedTone")]
        public string? SuggestedTone { get; set; }

        [JsonPropertyName("explanation")]
        public string? Explanation { get; set; }

        [JsonPropertyName("reply")]
        public string? Reply { get; set; }
    }
}
