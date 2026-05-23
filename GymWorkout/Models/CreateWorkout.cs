using System.ComponentModel.DataAnnotations;

namespace GymWorkout.Models
{
    public class CreateWorkoutDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public DateTime DateTime { get; set; } = DateTime.UtcNow;

        [Required]
        public string Description { get; set; } = string.Empty;
        
    }
}