using LocalMindAI.Api.Data;
using LocalMindAI.Api.DTOs;
using LocalMindAI.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LocalMindAI.Api.Services;

public sealed class OrganizationService(ApplicationDbContext context) : IOrganizationService
{
    public async Task<OrganizationDto> GetAsync(CancellationToken cancellationToken = default) { var entity = await context.Organizations.OrderBy(item => item.Id).FirstOrDefaultAsync(cancellationToken); if (entity is null) { entity = new Organization { Name = "Organization", DisplayName = "Organization" }; context.Organizations.Add(entity); await context.SaveChangesAsync(cancellationToken); } return Map(entity); }
    public async Task<OrganizationDto> CreateAsync(OrganizationDto input, CancellationToken cancellationToken = default) { var entity = await context.Organizations.OrderBy(item => item.Id).FirstOrDefaultAsync(cancellationToken) ?? new Organization(); Apply(entity, input); if (entity.Id == 0) context.Organizations.Add(entity); await context.SaveChangesAsync(cancellationToken); return Map(entity); }
    public async Task<OrganizationDto> UpdateAsync(OrganizationDto input, CancellationToken cancellationToken = default) => await CreateAsync(input, cancellationToken);
    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default) { var entity = await context.Organizations.FindAsync([id], cancellationToken); if (entity is null) return false; context.Organizations.Remove(entity); await context.SaveChangesAsync(cancellationToken); return true; }
    private static OrganizationDto Map(Organization item) => new() { Name = item.Name, DisplayName = item.DisplayName, LogoUrl = item.LogoUrl, Website = item.Website, Email = item.Email, Phone = item.Phone, Address = item.Address, City = item.City, State = item.State, Country = item.Country, Timezone = item.Timezone, Currency = item.Currency, Language = item.Language };
    private static void Apply(Organization item, OrganizationDto input) { item.Name = input.Name.Trim(); item.DisplayName = input.DisplayName.Trim(); item.Website = input.Website?.Trim(); item.Email = input.Email?.Trim(); item.Phone = input.Phone?.Trim(); item.Address = input.Address?.Trim(); item.City = input.City?.Trim(); item.State = input.State?.Trim(); item.Country = input.Country?.Trim(); item.Timezone = input.Timezone.Trim(); item.Currency = input.Currency.Trim().ToUpperInvariant(); item.Language = input.Language.Trim(); }
}
