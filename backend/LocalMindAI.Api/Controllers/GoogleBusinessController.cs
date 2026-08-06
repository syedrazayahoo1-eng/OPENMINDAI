using LocalMindAI.Api.Services;
using LocalMindAI.Api.DTOs.GoogleBusiness;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Diagnostics;
using System.Security;
namespace LocalMindAI.Api.Controllers;
[ApiController, Route("api/google"), Authorize]
public class GoogleBusinessController(IGoogleBusinessProfileService service, IConfiguration config, AIService aiService) : ControllerBase
{
 private static readonly HashSet<string> SupportedPostTones = new(StringComparer.OrdinalIgnoreCase) { "Professional", "Marketing", "Educational", "Festival", "Offer" };
 private static readonly HashSet<string> SupportedImageStyles = new(StringComparer.OrdinalIgnoreCase) { "Modern", "Editorial", "Illustrated", "Seasonal", "Minimal" };
 private static readonly HashSet<string> SupportedAspectRatios = new(StringComparer.OrdinalIgnoreCase) { "1:1", "4:5", "16:9" };
 private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);
 [HttpGet("auth")] public IActionResult Auth([FromQuery] string redirectUri) => Redirect(service.AuthorizationUrl(redirectUri));
 [AllowAnonymous, HttpGet("callback")] public async Task<IActionResult> Callback([FromQuery] string code, [FromQuery] string redirectUri, [FromQuery] string state) { await service.CompleteOAuthAsync(code, redirectUri, state); return Redirect(config["GoogleBusiness:FrontendCallbackUrl"] ?? "/reviews"); }
 [HttpGet("accounts")] public async Task<IActionResult> Accounts() => Ok(await service.AccountsAsync());
 [HttpGet("locations")] public async Task<IActionResult> Locations() => Ok(await service.LocationsAsync());
 [HttpPost("sync")] public async Task<IActionResult> Sync() => Ok(await service.SyncAsync());
 [HttpDelete("accounts/{accountId:int}")] public async Task<IActionResult> Disconnect(int accountId) { await service.DisconnectAsync(accountId); return NoContent(); }
 [HttpGet("/api/google-business/overview")] public async Task<IActionResult> Overview() => Ok(await service.OverviewAsync());
 [HttpPost("/api/googlebusiness/posts/generate")]
 public async Task<ActionResult<GenerateGoogleBusinessPostResponse>> GeneratePost([FromBody] GenerateGoogleBusinessPostRequest request)
 {
  if (!ModelState.IsValid) return ValidationProblem(ModelState);
  if (!SupportedPostTones.Contains(request.Tone)) return BadRequest(new { message = "Tone must be Professional, Marketing, Educational, Festival, or Offer." });

  var prompt = $$"""
You create concise, high-quality Google Business Profile posts. Return JSON only, with no markdown or prose outside the JSON object.
Use exactly this schema:
{"title":"string","description":"string","callToAction":"string","suggestedHashtags":["#tag"],"suggestedPublishTime":"string"}
Tone: {{request.Tone}}
Business objective: {{request.Prompt.Trim()}}
Requirements: Title must be under 58 characters; description must be under 1,500 characters; provide 3-5 relevant hashtags; provide a practical local-business publishing time. Do not invent discounts, dates, prices, or claims that were not given.
""";

  try
  {
   var generated = await aiService.AskAI(prompt);
   var response = JsonSerializer.Deserialize<GenerateGoogleBusinessPostResponse>(ExtractJson(generated), JsonOptions);
   if (response is null || string.IsNullOrWhiteSpace(response.Title) || string.IsNullOrWhiteSpace(response.Description) || string.IsNullOrWhiteSpace(response.CallToAction)) return StatusCode(StatusCodes.Status502BadGateway, new { message = "The AI service returned an incomplete post response." });
   return Ok(response);
  }
  catch (JsonException) { return StatusCode(StatusCodes.Status502BadGateway, new { message = "The AI service returned an invalid post response." }); }
  catch (Exception) { return StatusCode(StatusCodes.Status502BadGateway, new { message = "The AI post generator is temporarily unavailable." }); }
 }

 [HttpPost("/api/googlebusiness/images/generate")]
 public async Task<ActionResult<GenerateGoogleBusinessImageResponse>> GenerateImage([FromBody] GenerateGoogleBusinessImageRequest request)
 {
  if (!ModelState.IsValid) return ValidationProblem(ModelState);
  if (!SupportedImageStyles.Contains(request.Style)) return BadRequest(new { message = "Style must be Modern, Editorial, Illustrated, Seasonal, or Minimal." });
  if (!SupportedAspectRatios.Contains(request.AspectRatio)) return BadRequest(new { message = "Aspect ratio must be 1:1, 4:5, or 16:9." });

  var stopwatch = Stopwatch.StartNew();
  var creativePrompt = $$"""
Create a concise creative direction for a local business social image. Return JSON only using this exact schema:
{"headline":"maximum 46 characters","supportingText":"maximum 70 characters"}
Style: {{request.Style}}
Aspect ratio: {{request.AspectRatio}}
Business objective: {{request.Prompt.Trim()}}
Avoid unverified prices, dates, or claims. Do not use markdown.
""";

  try
  {
   var generated = await aiService.AskAI(creativePrompt);
   var direction = JsonSerializer.Deserialize<ImageCreativeDirection>(ExtractJson(generated), JsonOptions);
   if (direction is null || string.IsNullOrWhiteSpace(direction.Headline)) return StatusCode(StatusCodes.Status502BadGateway, new { message = "The AI service returned an incomplete image direction." });
   stopwatch.Stop();
   return Ok(new GenerateGoogleBusinessImageResponse { ImageUrl = BuildImageDataUrl(direction, request.Style, request.AspectRatio), PromptUsed = request.Prompt.Trim(), GenerationTime = $"{stopwatch.Elapsed.TotalMilliseconds:0} ms" });
  }
  catch (JsonException) { return StatusCode(StatusCodes.Status502BadGateway, new { message = "The AI service returned an invalid image direction." }); }
  catch (Exception) { return StatusCode(StatusCodes.Status502BadGateway, new { message = "The AI image generator is temporarily unavailable." }); }
 }

 private static string ExtractJson(string content) { var start = content.IndexOf('{'); var end = content.LastIndexOf('}'); return start >= 0 && end > start ? content[start..(end + 1)] : content; }

 private static string BuildImageDataUrl(ImageCreativeDirection direction, string style, string aspectRatio)
 {
  var (width, height) = aspectRatio switch { "4:5" => (1200, 1500), "16:9" => (1600, 900), _ => (1200, 1200) };
  var (start, end, accent) = style.ToLowerInvariant() switch { "editorial" => ("#17233d", "#526f98", "#f0c15b"), "illustrated" => ("#4f3678", "#a57ac7", "#f5d77a"), "seasonal" => ("#7a4134", "#c87a47", "#f7dc91"), "minimal" => ("#263238", "#607d8b", "#d9aa3b"), _ => ("#10233f", "#557c9b", "#d7a735") };
  var headline = SecurityElement.Escape(direction.Headline.Trim()) ?? string.Empty;
  var supportingText = SecurityElement.Escape(direction.SupportingText?.Trim() ?? string.Empty) ?? string.Empty;
  var svg = $"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"{width}\" height=\"{height}\" viewBox=\"0 0 {width} {height}\"><defs><linearGradient id=\"g\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop stop-color=\"{start}\"/><stop offset=\"1\" stop-color=\"{end}\"/></linearGradient></defs><rect width=\"100%\" height=\"100%\" fill=\"url(#g)\"/><circle cx=\"{width * 0.84:0}\" cy=\"{height * 0.2:0}\" r=\"{width * 0.17:0}\" fill=\"{accent}\" opacity=\".18\"/><circle cx=\"{width * 0.12:0}\" cy=\"{height * 0.86:0}\" r=\"{width * 0.22:0}\" fill=\"{accent}\" opacity=\".1\"/><rect x=\"{width * 0.1:0}\" y=\"{height * 0.12:0}\" width=\"{width * 0.12:0}\" height=\"8\" rx=\"4\" fill=\"{accent}\"/><text x=\"{width * 0.1:0}\" y=\"{height * 0.43:0}\" fill=\"white\" font-family=\"Arial, sans-serif\" font-size=\"{width * 0.07:0}\" font-weight=\"700\">{headline}</text><text x=\"{width * 0.1:0}\" y=\"{height * 0.53:0}\" fill=\"white\" opacity=\".82\" font-family=\"Arial, sans-serif\" font-size=\"{width * 0.033:0}\">{supportingText}</text><text x=\"{width * 0.1:0}\" y=\"{height * 0.84:0}\" fill=\"{accent}\" font-family=\"Arial, sans-serif\" font-size=\"{width * 0.024:0}\" font-weight=\"700\">GOOGLE BUSINESS</text></svg>";
  return $"data:image/svg+xml;base64,{Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(svg))}";
 }

 private sealed class ImageCreativeDirection { public string Headline { get; init; } = string.Empty; public string? SupportingText { get; init; } }
}
