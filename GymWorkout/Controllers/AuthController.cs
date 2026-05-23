using GymWorkout.Data;
using GymWorkout.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace GymWorkout.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        
        public async Task<IActionResult> RegisterAsync([FromBody] RegisterDto dto)
        {
            bool userExists = await _context.Users.AnyAsync(u => u.Username.ToLower() == dto.Username.ToLower());
            if (userExists)
            {
                return BadRequest("Username already exists");
            }

            string salt = BCrypt.Net.BCrypt.GenerateSalt(12);
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password, salt);

            User user = new User
            {
                Username = dto.Username,
                PasswordHash = hashedPassword,
                Email = dto.Email
            };

            _context.Users.Add(user);

            
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Registration successful!You can now log in." });
        }

        [HttpPost("login")]
        
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username.ToLower() == dto.Username.ToLower());
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                return Unauthorized("Invalid username or password");
            }

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Role, "User")
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
            );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new { token = jwt });
        }
    }
}
