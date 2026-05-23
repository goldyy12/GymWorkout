using System.ComponentModel.DataAnnotations;

namespace GymWorkout.Models
{
    public class RegisterDto
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
        public string Email { get; set; }
    }
}
