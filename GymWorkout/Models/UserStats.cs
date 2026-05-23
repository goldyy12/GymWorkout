namespace GymWorkout.Models
{
    public class UserStats
    {
        public int Id { get; set; }
        public int Height { get; set; } // in cm
        public int Weight { get; set; } // in kg
        public int Age { get; set; }
        public User User { get; set; } // Navigation property to User
        public int UserId { get; set; } // Foreign key to User

    }
}
