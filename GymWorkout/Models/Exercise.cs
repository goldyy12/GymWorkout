namespace GymWorkout.Models
{
    public class Exercise
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Sets { get; set; }
        public int Reps { get; set; }
        public int WorkoutId { get; set; }
       public int Weight { get; set; }

        // Adding the '?' makes it optional during JSON creation/validation
        public Workout? Workout { get; set; }
    }
}