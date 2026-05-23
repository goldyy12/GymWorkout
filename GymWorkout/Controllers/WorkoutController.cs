using GymWorkout.Data;
using GymWorkout.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using GymWorkout.Helpers;

namespace GymWorkout.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class WorkoutController : ControllerBase
    {

        private readonly AppDbContext _context;

        public WorkoutController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetWorkouts([FromQuery] DateTime? date)
        {
            
            int? userId = User.GetCurrentUserId();
            if (userId == null) return Unauthorized("Invalid user ID in token");

            var query = _context.Workouts.Where(w => w.UserId == userId.Value);

            if (date.HasValue)
            {
                DateTime startDate = DateTime.SpecifyKind(date.Value.Date, DateTimeKind.Utc);
                DateTime endDate = startDate.AddDays(1);

                query = query.Where(w => w.DateTime >= startDate && w.DateTime < endDate);
            }

            var workouts = await query.AsNoTracking().ToListAsync();
            return Ok(workouts);
        }

        [HttpPost]
        public async Task<IActionResult> CreateWorkout([FromBody] CreateWorkoutDto dto)
        {
            int? userId = User.GetCurrentUserId();
            if (userId == null) return Unauthorized("Invalid user ID in token");

            var workout = new Workout
            {
                Name = dto.Name,
                DateTime = DateTime.SpecifyKind(dto.DateTime, DateTimeKind.Utc),
                Description = dto.Description,
                UserId = userId.Value
            };

            _context.Workouts.Add(workout);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetWorkouts), new { id = workout.Id }, workout);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateWorkout(int id, [FromBody] CreateWorkoutDto dto)
        {
            int? userId = User.GetCurrentUserId();
            if (userId == null) return Unauthorized("Invalid user ID in token");

            var workout = await _context.Workouts.FirstOrDefaultAsync(w => w.Id == id && w.UserId == userId.Value);
            if (workout == null) return NotFound("Workout not found");

            workout.Name = dto.Name;
            workout.DateTime = DateTime.SpecifyKind(dto.DateTime, DateTimeKind.Utc);
            workout.Description = dto.Description;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWorkout(int id)
        {
            int? userId = User.GetCurrentUserId();
            if (userId == null) return Unauthorized("Invalid user ID in token");

            var workout = await _context.Workouts.FirstOrDefaultAsync(w => w.Id == id && w.UserId == userId.Value);
            if (workout == null) return NotFound("Workout not found");

            _context.Workouts.Remove(workout);
            await _context.SaveChangesAsync();
            return NoContent();
        }

       
    }
}