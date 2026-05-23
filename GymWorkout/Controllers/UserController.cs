using GymWorkout.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using GymWorkout.Models;
using GymWorkout.Helpers;
using Microsoft.EntityFrameworkCore;

namespace GymWorkout.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> UserStats([FromBody] CreateUserStatsDto dto)
        {
            int? userId = User.GetCurrentUserId();

            if (userId == null)
            {
                return Unauthorized("Invalid user ID in token");
            }

            var userStats = new UserStats
            {
                Age = dto.Age,
                Weight = dto.Weight,
                Height = dto.Height,
                UserId = userId.Value
            };

            _context.UserStats.Add(userStats);
            await _context.SaveChangesAsync();

            return Ok(userStats);
        }

        [HttpGet]
        public async Task<IActionResult> GetUserStats()
        {
            int? userId = User.GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized("Invalid user ID in token");
            }
            var userStats = await _context.UserStats
                .FirstOrDefaultAsync(us => us.UserId == userId.Value);
            return Ok(userStats ?? new UserStats { UserId = userId.Value });
        }
        [HttpPut]
        [HttpPut]
        public async Task<IActionResult> UpdateUserStats([FromBody] CreateUserStatsDto dto)
        {
            int? userId = User.GetCurrentUserId();
            if (userId == null)
                return Unauthorized("Invalid user ID in token");

            var userStats = await _context.UserStats
                .FirstOrDefaultAsync(us => us.UserId == userId.Value);

            if (userStats == null)
            {
                // No row yet — create it
                userStats = new UserStats
                {
                    UserId = userId.Value,
                    Age = dto.Age,
                    Weight = dto.Weight,
                    Height = dto.Height
                };
                _context.UserStats.Add(userStats);
            }
            else
            {
                // Row exists — update it
                userStats.Age = dto.Age;
                userStats.Weight = dto.Weight;
                userStats.Height = dto.Height;
            }

            await _context.SaveChangesAsync();
            return Ok(userStats);
        }
    }
}