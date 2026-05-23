using System.ComponentModel.DataAnnotations;

namespace GymWorkout.Models
{
    public class User
    {
        [Key] 
        public int Id { get; set; }
        [Required]
        [MaxLength(50)]
        public string Username { get; set; }
        [Required]
        [MaxLength(100)]
        public string PasswordHash { get; set; }
        public string? Email { get; set; }

        public List<Workout> Workouts { get; set; } = new List<Workout>();
        public UserStats Stats { get; set; } // Navigation property to UserStats
    }
}
