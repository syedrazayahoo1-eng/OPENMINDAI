using LocalMindAI.Api.Data;
using LocalMindAI.Api.DTOs;
using LocalMindAI.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LocalMindAI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(ApplicationDbContext context, IConfiguration configuration)
{
    _context = context;
    _configuration = configuration;
}

    [HttpPost("register")]
    public IActionResult Register(RegisterRequest request)
    {
        var user = new User
        {
            FullName = request.FullName,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            CompanyName = request.CompanyName,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        _context.SaveChanges();

        return Ok(new
        {
            Message = "User registered successfully!"
        });
    }

    [HttpPost("login")]
    public IActionResult Login(LoginRequest request)
    {
        var user = _context.Users.FirstOrDefault(x => x.Email == request.Email);

        if (user == null)
        {
            return BadRequest(new
            {
                Message = "Invalid email or password."
            });
        }

        bool passwordCorrect = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);

        if (!passwordCorrect)
        {
            return BadRequest(new
            {
                Message = "Invalid email or password."
            });
        }

       var claims = new[]
{
    new Claim(JwtRegisteredClaimNames.Sub, user.Email),
    new Claim(JwtRegisteredClaimNames.Email, user.Email),
    new Claim("FullName", user.FullName)
};

var key = new SymmetricSecurityKey(
    Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));

var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

var token = new JwtSecurityToken(
    issuer: _configuration["Jwt:Issuer"],
    audience: _configuration["Jwt:Audience"],
    claims: claims,
    expires: DateTime.UtcNow.AddMinutes(
        Convert.ToDouble(_configuration["Jwt:ExpiryInMinutes"])),
    signingCredentials: creds
);

var jwt = new JwtSecurityTokenHandler().WriteToken(token);

return Ok(new
{
    message = "Login successful!",
    token = jwt,
    user = new
    {
        fullName = user.FullName,
        email = user.Email,
        companyName = user.CompanyName
    }
});
}
[Authorize]
[HttpGet("profile")]
public IActionResult Profile()
{
    var email = User.FindFirst(JwtRegisteredClaimNames.Email)?.Value;
    var fullName = User.FindFirst("FullName")?.Value;

    return Ok(new
    {
        Message = "You are authenticated!",
        Email = email,
        FullName = fullName
    });
}
}