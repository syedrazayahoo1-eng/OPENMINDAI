using System.Text.Json;
using LocalMindAI.Api.Data;
using LocalMindAI.Api.DTOs.Posts;
using LocalMindAI.Api.Models;
using LocalMindAI.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LocalMindAI.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/posts")]
public sealed class PostsController(ApplicationDbContext context, AIService aiService, IGoogleBusinessPostPublisher publisher) : ControllerBase
{
    private static readonly HashSet<string> PostTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "Offer", "What's New", "Event", "Product", "Promotion", "Educational", "Festival", "Announcement"
    };

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<GoogleBusinessPostDto>>> GetAll()
    {
        var posts = await context.Set<GoogleBusinessPost>().AsNoTracking().OrderByDescending(post => post.UpdatedAt).ToListAsync();
        return Ok(posts.Select(ToDto).ToList());
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<GoogleBusinessPostDto>> Get(int id)
    {
        var post = await context.Set<GoogleBusinessPost>().AsNoTracking().FirstOrDefaultAsync(item => item.Id == id);
        return post is null ? NotFound() : Ok(ToDto(post));
    }

    [HttpPost("generate")]
    public async Task<ActionResult<GeneratePostResponse>> Generate([FromBody] GeneratePostRequest request)
    {
        if (!PostTypes.Contains(request.PostType)) return BadRequest(new { message = "Unsupported post type." });
        var prompt = $$"""
Create a Google Business Profile post. Return JSON only with this exact schema:
{"title":"string","caption":"string","cta":"string","hashtags":["#tag"]}
Post type: {{request.PostType}}
Business objective: {{request.Prompt.Trim()}}
Target audience: {{request.TargetAudience.Trim()}}
Location: {{request.Location.Trim()}}
Requested CTA: {{request.CTA.Trim()}}
Caption maximum length: {{request.CharacterLimit}} characters.
Include hashtags: {{request.IncludeHashtags}}.
Do not invent dates, prices, discounts or claims.
""";

        try
        {
            var generated = await aiService.AskAI(prompt);
            var content = JsonSerializer.Deserialize<GeneratedContent>(ExtractJson(generated), new JsonSerializerOptions(JsonSerializerDefaults.Web));
            if (content is null || string.IsNullOrWhiteSpace(content.Title) || string.IsNullOrWhiteSpace(content.Caption))
                return StatusCode(StatusCodes.Status502BadGateway, new { message = "The AI service returned incomplete content." });

            var caption = content.Caption.Trim();
            if (caption.Length > request.CharacterLimit) caption = caption[..request.CharacterLimit].TrimEnd();
            var hashtags = request.IncludeHashtags ? string.Join(" ", content.Hashtags.Where(tag => !string.IsNullOrWhiteSpace(tag)).Take(6)) : string.Empty;
            return Ok(new GeneratePostResponse
            {
                Title = content.Title.Trim()[..Math.Min(58, content.Title.Trim().Length)],
                Caption = caption,
                CTA = string.IsNullOrWhiteSpace(request.CTA) ? content.Cta?.Trim() ?? string.Empty : request.CTA.Trim(),
                Hashtags = hashtags,
                SeoScore = ScoreSeo(content.Title, caption, hashtags),
                ReadabilityScore = ScoreReadability(caption)
            });
        }
        catch (JsonException) { return StatusCode(StatusCodes.Status502BadGateway, new { message = "The AI service returned invalid content." }); }
        catch (Exception) { return StatusCode(StatusCodes.Status502BadGateway, new { message = "The AI post generator is temporarily unavailable." }); }
    }

    [HttpPost]
    public async Task<ActionResult<GoogleBusinessPostDto>> Create([FromBody] SaveGoogleBusinessPostRequest request)
    {
        if (!PostTypes.Contains(request.PostType)) return BadRequest(new { message = "Unsupported post type." });
        var post = new GoogleBusinessPost();
        Apply(post, request);
        context.Add(post);
        await context.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = post.Id }, ToDto(post));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<GoogleBusinessPostDto>> Update(int id, [FromBody] SaveGoogleBusinessPostRequest request)
    {
        if (!PostTypes.Contains(request.PostType)) return BadRequest(new { message = "Unsupported post type." });
        var post = await context.Set<GoogleBusinessPost>().FindAsync(id);
        if (post is null) return NotFound();
        Apply(post, request);
        await context.SaveChangesAsync();
        return Ok(ToDto(post));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var post = await context.Set<GoogleBusinessPost>().FindAsync(id);
        if (post is null) return NotFound();
        context.Remove(post);
        await context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("{id:int}/publish")]
    public async Task<ActionResult<GoogleBusinessPostDto>> Publish(int id)
    {
        var post = await context.Set<GoogleBusinessPost>().FindAsync(id);
        if (post is null) return NotFound();
        var result = await publisher.PublishAsync(id);
        return result.Succeeded ? Ok(ToDto(post)) : StatusCode(StatusCodes.Status503ServiceUnavailable, new { message = result.ErrorMessage });
    }

    [HttpPost("{id:int}/schedule")]
    public async Task<ActionResult<ScheduledPostDto>> Schedule(int id, [FromBody] ScheduleGoogleBusinessPostRequest request)
    {
        if (request.ScheduledTime is null || request.ScheduledTime <= DateTime.UtcNow) return BadRequest(new { message = "Scheduled time must be in the future." });
        var post = await context.Set<GoogleBusinessPost>().FindAsync(id);
        if (post is null) return NotFound();
        post.Status = "Scheduled";
        post.ScheduledTime = request.ScheduledTime.Value;
        post.UpdatedAt = DateTime.UtcNow;
        var scheduled = await context.Set<ScheduledPost>().FirstOrDefaultAsync(item => item.GoogleBusinessPostId == id && item.Status == "Scheduled") ?? new ScheduledPost { GoogleBusinessPostId = id };
        scheduled.BusinessId = post.BusinessId;
        scheduled.ScheduledTime = request.ScheduledTime.Value;
        scheduled.Status = "Scheduled";
        scheduled.RetryCount = 0;
        scheduled.ErrorMessage = string.Empty;
        scheduled.UpdatedAt = DateTime.UtcNow;
        if (scheduled.Id == 0) context.Add(scheduled);
        await context.SaveChangesAsync();
        return Ok(ToScheduledDto(scheduled, post));
    }

    [HttpGet("history")]
    public async Task<ActionResult<IReadOnlyList<ScheduledPostDto>>> History()
    {
        var items = await context.Set<ScheduledPost>().AsNoTracking().Include(item => item.GoogleBusinessPost).OrderByDescending(item => item.UpdatedAt).ToListAsync();
        return Ok(items.Select(item => ToScheduledDto(item, item.GoogleBusinessPost)).ToList());
    }

    [HttpGet("scheduled")]
    public async Task<ActionResult<IReadOnlyList<ScheduledPostDto>>> Scheduled()
    {
        var items = await context.Set<ScheduledPost>().AsNoTracking().Include(item => item.GoogleBusinessPost).Where(item => item.Status == "Scheduled" || item.Status == "Publishing").OrderBy(item => item.ScheduledTime).ToListAsync();
        return Ok(items.Select(item => ToScheduledDto(item, item.GoogleBusinessPost)).ToList());
    }

    [HttpDelete("{id:int}/cancel")]
    public async Task<IActionResult> Cancel(int id)
    {
        var item = await context.Set<ScheduledPost>().Include(value => value.GoogleBusinessPost).FirstOrDefaultAsync(value => value.GoogleBusinessPostId == id && value.Status == "Scheduled");
        if (item is null) return NotFound();
        item.Status = "Cancelled";
        item.UpdatedAt = DateTime.UtcNow;
        if (item.GoogleBusinessPost is not null) { item.GoogleBusinessPost.Status = "Cancelled"; item.GoogleBusinessPost.UpdatedAt = DateTime.UtcNow; }
        await context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("{id:int}/retry")]
    public async Task<ActionResult<GoogleBusinessPostDto>> Retry(int id)
    {
        var post = await context.Set<GoogleBusinessPost>().FindAsync(id);
        if (post is null) return NotFound();
        var scheduled = await context.Set<ScheduledPost>().OrderByDescending(item => item.CreatedAt).FirstOrDefaultAsync(item => item.GoogleBusinessPostId == id && item.Status == "Failed");
        var result = await publisher.PublishAsync(id, scheduled);
        return result.Succeeded ? Ok(ToDto(post)) : StatusCode(StatusCodes.Status503ServiceUnavailable, new { message = result.ErrorMessage });
    }

    [HttpPost("{id:int}/duplicate")]
    public async Task<ActionResult<GoogleBusinessPostDto>> Duplicate(int id)
    {
        var source = await context.Set<GoogleBusinessPost>().AsNoTracking().FirstOrDefaultAsync(item => item.Id == id);
        if (source is null) return NotFound();
        var copy = new GoogleBusinessPost { BusinessId = source.BusinessId, PostType = source.PostType, Prompt = source.Prompt, Title = source.Title, Caption = source.Caption, ImageUrl = source.ImageUrl, CTA = source.CTA, Hashtags = source.Hashtags };
        context.Add(copy);
        await context.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = copy.Id }, ToDto(copy));
    }

    private static void Apply(GoogleBusinessPost post, SaveGoogleBusinessPostRequest request)
    {
        post.BusinessId = request.BusinessId;
        post.PostType = request.PostType.Trim();
        post.Prompt = request.Prompt.Trim();
        post.Title = request.Title.Trim();
        post.Caption = request.Caption.Trim();
        post.ImageUrl = request.ImageUrl.Trim();
        post.CTA = request.CTA.Trim();
        post.Hashtags = request.Hashtags.Trim();
        post.Status = "Draft";
        post.ScheduledTime = null;
        post.PublishedTime = null;
        post.UpdatedAt = DateTime.UtcNow;
    }

    private static GoogleBusinessPostDto ToDto(GoogleBusinessPost post) => new()
    {
        Id = post.Id, BusinessId = post.BusinessId, PostType = post.PostType, Prompt = post.Prompt, Title = post.Title,
        Caption = post.Caption, ImageUrl = post.ImageUrl, CTA = post.CTA, Hashtags = post.Hashtags, Status = post.Status,
        ScheduledTime = post.ScheduledTime, PublishedTime = post.PublishedTime, CreatedAt = post.CreatedAt, UpdatedAt = post.UpdatedAt
    };
    private static ScheduledPostDto ToScheduledDto(ScheduledPost item, GoogleBusinessPost? post) => new() { Id = item.Id, BusinessId = item.BusinessId, GoogleBusinessPostId = item.GoogleBusinessPostId, PostTitle = post?.Title ?? string.Empty, ScheduledTime = item.ScheduledTime, Status = item.Status, RetryCount = item.RetryCount, LastAttempt = item.LastAttempt, PublishedTime = item.PublishedTime, ErrorMessage = item.ErrorMessage, CreatedAt = item.CreatedAt };

    private static string ExtractJson(string content) { var start = content.IndexOf('{'); var end = content.LastIndexOf('}'); return start >= 0 && end > start ? content[start..(end + 1)] : content; }
    private static int ScoreSeo(string title, string caption, string hashtags) => Math.Clamp(48 + (title.Length > 18 ? 14 : 6) + (caption.Length > 100 ? 17 : 8) + (string.IsNullOrWhiteSpace(hashtags) ? 0 : 14), 0, 100);
    private static int ScoreReadability(string caption) => Math.Clamp(96 - Math.Max(0, caption.Length - 350) / 18, 55, 96);
    private sealed class GeneratedContent { public string Title { get; init; } = string.Empty; public string Caption { get; init; } = string.Empty; public string? Cta { get; init; } public List<string> Hashtags { get; init; } = []; }
}
