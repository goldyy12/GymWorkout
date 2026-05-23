using GymWorkout.Data;
using GymWorkout.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GymWorkout.Helpers;

namespace GymWorkout.Controllers
{
    [Route("api/workouts/{workoutId}/exercises")]
    [ApiController]
    [Authorize]
    public class ExerciseController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ExerciseController(AppDbContext context)
        {
            _context = context;
        }

        
        [HttpPost]
        public async Task<IActionResult> AddExerciseToWorkout(int workoutId, [FromBody] CreateExerciseDto dto)
        {
            int? userId = User.GetCurrentUserId();
            if (userId == null) return Unauthorized("Invalid user ID in token");

            var workout = await _context.Workouts
                .FirstOrDefaultAsync(w => w.Id == workoutId && w.UserId == userId.Value);

            if (workout == null)
                return NotFound("Workout not found");

            var exercise = new Exercise
            {
                Name = dto.Name,
                Sets = dto.Sets,
                Reps = dto.Reps,
                Weight = dto.Weight,
                WorkoutId = workoutId
            };

            _context.Exercises.Add(exercise);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                id = exercise.Id,
                name = exercise.Name,
                sets = exercise.Sets,
                reps = exercise.Reps,
                weight = exercise.Weight,
                workoutId = exercise.WorkoutId
            });
        }

        
        [HttpGet]
        public async Task<IActionResult> GetExercisesForWorkout(int workoutId)
        {
            int? userId = User.GetCurrentUserId();
            if (userId == null) return Unauthorized("Invalid user ID in token");

            var workout = await _context.Workouts
                .FirstOrDefaultAsync(w => w.Id == workoutId && w.UserId == userId.Value);

            if (workout == null)
                return NotFound("Workout not found");

            var exercises = await _context.Exercises
                .Where(e => e.WorkoutId == workoutId)
                .AsNoTracking()
                .ToListAsync();

            return Ok(exercises);
        }

        
        [HttpPut("{exerciseId}")]
        public async Task<IActionResult> UpdateExercise(int workoutId, int exerciseId, [FromBody] CreateExerciseDto dto)
        {
            int? userId = User.GetCurrentUserId();
            if (userId == null) return Unauthorized("Invalid user ID in token");

            var workout = await _context.Workouts
                .FirstOrDefaultAsync(w => w.Id == workoutId && w.UserId == userId.Value);
            if (workout == null)
                return NotFound("Workout not found");

            var exercise = await _context.Exercises
                .FirstOrDefaultAsync(e => e.Id == exerciseId && e.WorkoutId == workoutId);
            if (exercise == null)
                return NotFound("Exercise not found");

            exercise.Name = dto.Name;
            exercise.Sets = dto.Sets;
            exercise.Reps = dto.Reps;
            exercise.Weight = dto.Weight;

            await _context.SaveChangesAsync();

            
            return Ok(new
            {
                id = exercise.Id,
                name = exercise.Name,
                sets = exercise.Sets,
                reps = exercise.Reps,
                weight = exercise.Weight,
                workoutId = exercise.WorkoutId
            });
        }

        
        [HttpDelete("{exerciseId}")]
        public async Task<IActionResult> DeleteExercise(int workoutId, int exerciseId)
        {
            int? userId = User.GetCurrentUserId();
            if (userId == null) return Unauthorized("Invalid user ID in token");

            var workout = await _context.Workouts
                .FirstOrDefaultAsync(w => w.Id == workoutId && w.UserId == userId.Value);
            if (workout == null)
                return NotFound("Workout not found");

            var exercise = await _context.Exercises
                .FirstOrDefaultAsync(e => e.Id == exerciseId && e.WorkoutId == workoutId);
            if (exercise == null)
                return NotFound("Exercise not found");

            _context.Exercises.Remove(exercise);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}