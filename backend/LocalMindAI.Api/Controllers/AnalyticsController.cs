using LocalMindAI.Api.DTOs; using LocalMindAI.Api.Services; using Microsoft.AspNetCore.Authorization; using Microsoft.AspNetCore.Mvc;
namespace LocalMindAI.Api.Controllers;
[ApiController][Authorize(Policy="Permission:Analytics.View")][Route("api/analytics")]
public sealed class AnalyticsController(IAnalyticsService service):ControllerBase
{
[HttpGet("overview")]public Task<AnalyticsDto> Overview([FromQuery]AnalyticsRangeQuery q,CancellationToken c)=>service.OverviewAsync(q,c);
[HttpGet("revenue")]public Task<AnalyticsDto> Revenue([FromQuery]AnalyticsRangeQuery q,CancellationToken c)=>service.RevenueAsync(q,c);
[HttpGet("customers")]public Task<AnalyticsDto> Customers([FromQuery]AnalyticsRangeQuery q,CancellationToken c)=>service.CustomersAsync(q,c);
[HttpGet("reviews")]public Task<AnalyticsDto> Reviews([FromQuery]AnalyticsRangeQuery q,CancellationToken c)=>service.ReviewsAsync(q,c);
[HttpGet("posts")]public Task<AnalyticsDto> Posts([FromQuery]AnalyticsRangeQuery q,CancellationToken c)=>service.PostsAsync(q,c);
[HttpGet("workflows")]public Task<AnalyticsDto> Workflows([FromQuery]AnalyticsRangeQuery q,CancellationToken c)=>service.WorkflowsAsync(q,c);
[HttpGet("agents")]public Task<AnalyticsDto> Agents([FromQuery]AnalyticsRangeQuery q,CancellationToken c)=>service.AgentsAsync(q,c);
[HttpGet("ai-usage")]public Task<AnalyticsDto> Ai([FromQuery]AnalyticsRangeQuery q,CancellationToken c)=>service.AiUsageAsync(q,c);
}
