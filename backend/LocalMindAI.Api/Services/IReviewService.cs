using LocalMindAI.Api.DTOs.Reviews;

namespace LocalMindAI.Api.Services;

public interface IReviewService
{
    Task<IEnumerable<ReviewDto>> GetAllAsync();
    Task<ReviewDto?> GetByIdAsync(int id);
    Task<ReviewDto> CreateAsync(ReviewDto reviewDto);
    Task<ReviewDto?> UpdateAsync(int id, ReviewDto reviewDto);
    Task<bool> DeleteAsync(int id);
    Task<GenerateReplyResponse> GenerateReplyAsync(GenerateReplyRequest request);
    Task<bool> PostReplyAsync(PostReplyRequest request);
}
