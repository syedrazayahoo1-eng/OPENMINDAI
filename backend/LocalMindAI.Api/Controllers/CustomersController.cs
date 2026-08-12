using System.Security.Claims;
using LocalMindAI.Api.Data;
using LocalMindAI.Api.DTOs.CRM;
using LocalMindAI.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LocalMindAI.Api.Controllers;

[ApiController, Authorize, Route("api/customers")]
public sealed class CustomersController(ApplicationDbContext context) : ControllerBase
{
    private static readonly string[] SortFields = ["createdAt", "updatedAt", "firstName", "company", "status", "city"];
    private string Actor => User.FindFirstValue(ClaimTypes.Email) ?? User.FindFirstValue("email") ?? "system";

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? search, [FromQuery] string? status, [FromQuery] string? city, [FromQuery] string? sortBy = "updatedAt", [FromQuery] bool descending = true, [FromQuery] int page = 1, [FromQuery] int pageSize = 25)
    {
        page = Math.Max(1, page); pageSize = Math.Clamp(pageSize, 1, 100); sortBy = SortFields.Contains(sortBy ?? "") ? sortBy : "updatedAt";
        var query = context.Customers.AsNoTracking().AsQueryable();
        if (!string.IsNullOrWhiteSpace(search)) { var term = search.Trim(); query = query.Where(item => item.FirstName.Contains(term) || item.LastName.Contains(term) || item.Company.Contains(term) || item.Email.Contains(term) || item.Phone.Contains(term) || item.Tags.Contains(term)); }
        if (!string.IsNullOrWhiteSpace(status)) query = query.Where(item => item.Status == status);
        if (!string.IsNullOrWhiteSpace(city)) query = query.Where(item => item.City == city);
        query = (sortBy, descending) switch { ("firstName", true) => query.OrderByDescending(item => item.FirstName), ("firstName", false) => query.OrderBy(item => item.FirstName), ("company", true) => query.OrderByDescending(item => item.Company), ("company", false) => query.OrderBy(item => item.Company), ("status", true) => query.OrderByDescending(item => item.Status), ("status", false) => query.OrderBy(item => item.Status), ("city", true) => query.OrderByDescending(item => item.City), ("city", false) => query.OrderBy(item => item.City), ("createdAt", true) => query.OrderByDescending(item => item.CreatedAt), ("createdAt", false) => query.OrderBy(item => item.CreatedAt), (_, true) => query.OrderByDescending(item => item.UpdatedAt), _ => query.OrderBy(item => item.UpdatedAt) };
        var total = await query.CountAsync(); var data = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        return Ok(new { data, page, pageSize, total, totalPages = (int)Math.Ceiling(total / (double)pageSize) });
    }

    [HttpGet("{id:int}")] public async Task<IActionResult> Get(int id) { var customer = await context.Customers.AsNoTracking().Include(item => item.Notes).Include(item => item.Activities).FirstOrDefaultAsync(item => item.Id == id); return customer is null ? NotFound() : Ok(customer); }
    [HttpPost] public async Task<IActionResult> Create(CustomerRequest request) { var customer = new Customer { CreatedBy = Actor, UpdatedBy = Actor }; Apply(customer, request); context.Add(customer); await context.SaveChangesAsync(); return CreatedAtAction(nameof(Get), new { id = customer.Id }, customer); }
    [HttpPut("{id:int}")] public async Task<IActionResult> Update(int id, CustomerRequest request) { var customer = await context.Customers.FindAsync(id); if (customer is null) return NotFound(); Apply(customer, request); customer.UpdatedBy = Actor; customer.UpdatedAt = DateTime.UtcNow; await context.SaveChangesAsync(); return Ok(customer); }
    [HttpDelete("{id:int}")] public async Task<IActionResult> Delete(int id) { var customer = await context.Customers.FindAsync(id); if (customer is null) return NotFound(); context.Remove(customer); await context.SaveChangesAsync(); return NoContent(); }
    [HttpGet("{id:int}/notes")] public async Task<IActionResult> Notes(int id) => !await context.Customers.AnyAsync(item => item.Id == id) ? NotFound() : Ok(await context.CustomerNotes.AsNoTracking().Where(item => item.CustomerId == id).OrderByDescending(item => item.CreatedAt).ToListAsync());
    [HttpPost("{id:int}/notes")] public async Task<IActionResult> AddNote(int id, CustomerNoteRequest request) { if (!await context.Customers.AnyAsync(item => item.Id == id)) return NotFound(); var note = new CustomerNote { CustomerId = id, Content = request.Content.Trim(), CreatedBy = Actor }; context.Add(note); await context.SaveChangesAsync(); return CreatedAtAction(nameof(Notes), new { id }, note); }
    [HttpGet("{id:int}/activities")] public async Task<IActionResult> Activities(int id) => !await context.Customers.AnyAsync(item => item.Id == id) ? NotFound() : Ok(await context.CustomerActivities.AsNoTracking().Where(item => item.CustomerId == id).OrderByDescending(item => item.CreatedAt).ToListAsync());
    [HttpPost("{id:int}/activities")] public async Task<IActionResult> AddActivity(int id, CustomerActivityRequest request) { if (!await context.Customers.AnyAsync(item => item.Id == id)) return NotFound(); var activity = new CustomerActivity { CustomerId = id, Type = request.Type, Description = request.Description.Trim(), DueDate = request.DueDate, Completed = request.Completed }; context.Add(activity); await context.SaveChangesAsync(); return CreatedAtAction(nameof(Activities), new { id }, activity); }
    [HttpPut("activities/{activityId:int}")] public async Task<IActionResult> UpdateActivity(int activityId, CustomerActivityRequest request) { var activity = await context.CustomerActivities.FindAsync(activityId); if (activity is null) return NotFound(); activity.Type = request.Type; activity.Description = request.Description.Trim(); activity.DueDate = request.DueDate; activity.Completed = request.Completed; await context.SaveChangesAsync(); return Ok(activity); }
    [HttpDelete("activities/{activityId:int}")] public async Task<IActionResult> DeleteActivity(int activityId) { var activity = await context.CustomerActivities.FindAsync(activityId); if (activity is null) return NotFound(); context.Remove(activity); await context.SaveChangesAsync(); return NoContent(); }
    [HttpGet("pipelines")] public async Task<IActionResult> Pipelines() => Ok(await context.CustomerPipelines.AsNoTracking().Where(item => item.IsActive).OrderBy(item => item.SortOrder).ToListAsync());
    private static void Apply(Customer customer, CustomerRequest request) { customer.OrganizationId = request.OrganizationId; customer.FirstName = request.FirstName.Trim(); customer.LastName = request.LastName.Trim(); customer.Company = request.Company.Trim(); customer.Email = request.Email.Trim().ToLowerInvariant(); customer.Phone = request.Phone.Trim(); customer.Address = request.Address.Trim(); customer.City = request.City.Trim(); customer.State = request.State.Trim(); customer.Country = request.Country.Trim(); customer.LeadSource = request.LeadSource.Trim(); customer.Status = request.Status.Trim(); customer.Tags = request.Tags.Trim(); }
}
