using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using LocalMindAI.Api.Services;
using LocalMindAI.Api.DTOs.Reviews;

namespace LocalMindAI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewsController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ReviewDto>>> GetAll()
    {
        var reviews = await _reviewService.GetAllAsync();
        return Ok(reviews);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ReviewDto>> GetById(int id)
    {
        var review = await _reviewService.GetByIdAsync(id);
        if (review == null)
        {
            return NotFound(new { Message = $"Review with ID {id} not found." });
        }
        return Ok(review);
    }

    [HttpPost]
    public async Task<ActionResult<ReviewDto>> Create(ReviewDto reviewDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var createdReview = await _reviewService.CreateAsync(reviewDto);
        return CreatedAtAction(nameof(GetById), new { id = createdReview.Id }, createdReview);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ReviewDto>> Update(int id, ReviewDto reviewDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var updatedReview = await _reviewService.UpdateAsync(id, reviewDto);
        if (updatedReview == null)
        {
            return NotFound(new { Message = $"Review with ID {id} not found." });
        }
        return Ok(updatedReview);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _reviewService.DeleteAsync(id);
        if (!deleted)
        {
            return NotFound(new { Message = $"Review with ID {id} not found." });
        }
        return NoContent();
    }

    [HttpPost("{id}/generate")]
    public async Task<ActionResult<ReviewReplyDto>> GenerateReply(int id, GenerateReviewReplyRequest request)
    {
        try
        {
            var response = await _reviewService.GenerateReplyAsync(id, request);
            return response is null ? NotFound() : Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "An error occurred while generating the reply.", Details = ex.Message });
        }
    }

    [HttpPost("{id}/draft")]
    public async Task<ActionResult<ReviewReplyDto>> SaveDraft(int id, SaveReviewReplyDraftRequest request) => (await _reviewService.SaveDraftAsync(id, request)) is { } reply ? Ok(reply) : NotFound();

    [HttpPost("{id}/publish")]
    public async Task<ActionResult<ReviewReplyDto>> PublishReply(int id) => (await _reviewService.PublishReplyAsync(id)) is { } reply ? Ok(reply) : NotFound();

    [HttpGet("{id}/reply")]
    public async Task<ActionResult<ReviewReplyDto>> GetReply(int id) => (await _reviewService.GetReplyAsync(id)) is { } reply ? Ok(reply) : NotFound();

    [HttpGet("analytics")]
    public async Task<IActionResult> Analytics()
    {
        var reviews = (await _reviewService.GetAllAsync()).ToList();
        return Ok(new { total = reviews.Count, replied = reviews.Count(review => review.IsReplied), averageRating = reviews.Count == 0 ? 0 : reviews.Average(review => review.Rating), positive = reviews.Count(review => review.Rating >= 4), neutral = reviews.Count(review => review.Rating == 3), negative = reviews.Count(review => review.Rating <= 2) });
    }
}
