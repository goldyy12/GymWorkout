using System.ComponentModel.DataAnnotations;

namespace GymWorkout.Models
{
    public class CreateExerciseDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        [Required]
        public int Sets { get; set; }
        [Required]
        public int Reps { get; set; }

        public int Weight { get; set; }
        
    }
}
