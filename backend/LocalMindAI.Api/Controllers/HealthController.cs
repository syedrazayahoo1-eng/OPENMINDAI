using Microsoft.AspNetCore.Mvc;

namespace LocalMindAI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            Application = "LocalMindAI",
            Version = "1.0.0",
            Status = "Running",
            Time = DateTime.UtcNow
        });
    }
}