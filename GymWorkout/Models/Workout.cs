using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GymWorkout.Models
{
    public class Workout
    {
        [Key] public int Id { get; set; }
        [Required] public string Name { get; set; }
        [Required] public DateTime DateTime { get; set; } = DateTime.UtcNow;

        [Required] public string Description { get; set; }

        [ForeignKey("User")] public int UserId { get; set; }
         public User User { get; set; }

       public List<Exercise> Exercises { get; set; }
         
    }
}
