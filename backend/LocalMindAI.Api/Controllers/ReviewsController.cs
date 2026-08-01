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

    [HttpPost("{id}/reply")]
    public async Task<ActionResult<GenerateReplyResponse>> GenerateReply(int id)
    {
        try
        {
            var request = new GenerateReplyRequest { ReviewId = id };
            var response = await _reviewService.GenerateReplyAsync(request);
            return Ok(response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { Message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "An error occurred while generating the reply.", Details = ex.Message });
        }
    }
}
