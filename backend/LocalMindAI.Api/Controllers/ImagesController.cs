using System.Security;
using System.Text;
using System.Text.Json;
using LocalMindAI.Api.Data;
using LocalMindAI.Api.DTOs.Images;
using LocalMindAI.Api.Models;
using LocalMindAI.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LocalMindAI.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/images")]
public sealed class ImagesController(ApplicationDbContext context, AIService aiService) : ControllerBase
{
    private static readonly HashSet<string> Categories = new(StringComparer.OrdinalIgnoreCase) { "Restaurant", "Retail", "Medical", "Education", "Corporate", "Real Estate", "Salon", "Hotel" };
    private static readonly HashSet<string> Styles = new(StringComparer.OrdinalIgnoreCase) { "Realistic", "Corporate", "Luxury", "Minimal", "Modern", "Photorealistic", "3D", "Flat Design" };
    private static readonly HashSet<string> Ratios = new(StringComparer.OrdinalIgnoreCase) { "1:1", "16:9", "9:16" };

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<GeneratedImageDto>>> GetAll([FromQuery] int skip = 0, [FromQuery] int take = 24)
    {
        take = Math.Clamp(take, 1, 48);
        var images = await context.Set<GeneratedImage>().AsNoTracking().OrderByDescending(image => image.CreatedAt).Skip(Math.Max(0, skip)).Take(take).ToListAsync();
        return Ok(images.Select(ToDto).ToList());
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<GeneratedImageDto>> Get(int id)
    {
        var image = await context.Set<GeneratedImage>().AsNoTracking().FirstOrDefaultAsync(item => item.Id == id);
        return image is null ? NotFound() : Ok(ToDto(image));
    }

    [HttpPost("generate")]
    public async Task<ActionResult<IReadOnlyList<GeneratedImageDto>>> Generate([FromBody] GenerateImagesRequest request)
    {
        if (!Categories.Contains(request.BusinessCategory) || !Styles.Contains(request.Style) || !Ratios.Contains(request.AspectRatio)) return BadRequest(new { message = "Image category, style, or aspect ratio is invalid." });
        var count = request.GenerateVariations ? 4 : 1;
        var images = new List<GeneratedImage>(count);
        try
        {
            for (var variation = 1; variation <= count; variation++)
            {
                var prompt = $$"""
Create concise creative direction for an enterprise Google Business marketing image. Return JSON only with this exact schema:
{"headline":"maximum 46 characters","supportingText":"maximum 72 characters"}
Business category: {{request.BusinessCategory}}
Image style: {{request.Style}}
Aspect ratio: {{request.AspectRatio}}
Use brand colors: {{request.UseBrandColors}}
Use brand logo treatment: {{request.UseBrandLogo}}
Include text in the visual: {{request.IncludeText}}
Creative brief: {{request.Prompt.Trim()}}
Variation: {{variation}} of {{count}}
Avoid prices, dates, claims, and markdown.
""";
                var generated = await aiService.AskAI(prompt);
                var direction = JsonSerializer.Deserialize<ImageDirection>(ExtractJson(generated), new JsonSerializerOptions(JsonSerializerDefaults.Web));
                if (direction is null || string.IsNullOrWhiteSpace(direction.Headline)) return StatusCode(StatusCodes.Status502BadGateway, new { message = "The AI service returned incomplete image direction." });
                var url = BuildImageDataUrl(direction, request.Style, request.AspectRatio, request.UseBrandColors, request.IncludeText);
                images.Add(new GeneratedImage { BusinessId = request.BusinessId, Prompt = request.Prompt.Trim(), Style = request.Style, AspectRatio = request.AspectRatio, ImageUrl = url, ThumbnailUrl = url });
            }
            context.AddRange(images);
            await context.SaveChangesAsync();
            return Ok(images.Select(ToDto).ToList());
        }
        catch (JsonException) { return StatusCode(StatusCodes.Status502BadGateway, new { message = "The AI service returned invalid image direction." }); }
        catch (Exception) { return StatusCode(StatusCodes.Status502BadGateway, new { message = "The AI image generator is temporarily unavailable." }); }
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var image = await context.Set<GeneratedImage>().FindAsync(id);
        if (image is null) return NotFound();
        context.Remove(image);
        await context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("{id:int}/download")]
    public async Task<IActionResult> Download(int id)
    {
        var image = await context.Set<GeneratedImage>().AsNoTracking().FirstOrDefaultAsync(item => item.Id == id);
        if (image is null) return NotFound();
        const string prefix = "data:image/svg+xml;base64,";
        if (!image.ImageUrl.StartsWith(prefix, StringComparison.Ordinal)) return BadRequest(new { message = "This image format is not available for server download." });
        return File(Convert.FromBase64String(image.ImageUrl[prefix.Length..]), "image/svg+xml", $"digitech-image-{id}.svg");
    }

    private static GeneratedImageDto ToDto(GeneratedImage image) => new() { Id = image.Id, BusinessId = image.BusinessId, Prompt = image.Prompt, Style = image.Style, AspectRatio = image.AspectRatio, ImageUrl = image.ImageUrl, ThumbnailUrl = image.ThumbnailUrl, Status = image.Status, CreatedAt = image.CreatedAt };
    private static string ExtractJson(string content) { var start = content.IndexOf('{'); var end = content.LastIndexOf('}'); return start >= 0 && end > start ? content[start..(end + 1)] : content; }
    private static string BuildImageDataUrl(ImageDirection direction, string style, string ratio, bool brandColors, bool includeText)
    {
        var (width, height) = ratio switch { "16:9" => (1600, 900), "9:16" => (900, 1600), _ => (1200, 1200) };
        var colors = style.ToLowerInvariant() switch { "luxury" => ("#17233d", "#8e6116", "#f2d588"), "corporate" => ("#0d2b50", "#4d7dae", "#d1e0ef"), "3d" => ("#44266d", "#9d75cf", "#f2d588"), "flat design" => ("#1c3c46", "#65a3a4", "#e7cf85"), _ => ("#10233f", "#557c9b", "#d7a735") };
        if (brandColors) colors = ("#0b1733", "#c8972f", "#f2d588");
        var headline = includeText ? SecurityElement.Escape(direction.Headline.Trim()) ?? string.Empty : string.Empty;
        var supporting = includeText ? SecurityElement.Escape(direction.SupportingText?.Trim() ?? string.Empty) ?? string.Empty : string.Empty;
        var svg = $"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"{width}\" height=\"{height}\" viewBox=\"0 0 {width} {height}\"><defs><linearGradient id=\"g\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop stop-color=\"{colors.Item1}\"/><stop offset=\"1\" stop-color=\"{colors.Item2}\"/></linearGradient></defs><rect width=\"100%\" height=\"100%\" fill=\"url(#g)\"/><circle cx=\"{width * .82:0}\" cy=\"{height * .2:0}\" r=\"{width * .19:0}\" fill=\"{colors.Item3}\" opacity=\".18\"/><circle cx=\"{width * .14:0}\" cy=\"{height * .84:0}\" r=\"{width * .24:0}\" fill=\"{colors.Item3}\" opacity=\".1\"/><rect x=\"{width * .1:0}\" y=\"{height * .12:0}\" width=\"{width * .13:0}\" height=\"8\" rx=\"4\" fill=\"{colors.Item3}\"/><text x=\"{width * .1:0}\" y=\"{height * .45:0}\" fill=\"white\" font-family=\"Arial,sans-serif\" font-size=\"{width * .07:0}\" font-weight=\"700\">{headline}</text><text x=\"{width * .1:0}\" y=\"{height * .55:0}\" fill=\"white\" opacity=\".83\" font-family=\"Arial,sans-serif\" font-size=\"{width * .033:0}\">{supporting}</text></svg>";
        return $"data:image/svg+xml;base64,{Convert.ToBase64String(Encoding.UTF8.GetBytes(svg))}";
    }
    private sealed class ImageDirection { public string Headline { get; init; } = string.Empty; public string? SupportingText { get; init; } }
}
