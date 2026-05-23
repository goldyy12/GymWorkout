using GymWorkout.Models;
using Microsoft.EntityFrameworkCore;

namespace GymWorkout.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Models.User> Users { get; set; }
        public DbSet<Models.Workout> Workouts { get; set; }
        public DbSet<Models.Exercise> Exercises { get; set; }
        public DbSet<Models.UserStats> UserStats { get; set; }

        // Add this method below your DbSets to configure the indexes
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 1. Index the columns you use for searching and filtering in WorkoutController
            modelBuilder.Entity<Models.Workout>().HasIndex(w => w.UserId);
            modelBuilder.Entity<Models.Workout>().HasIndex(w => w.DateTime);

            // 2. Index the foreign key linking exercises to workouts for ExerciseController
            modelBuilder.Entity<Models.Exercise>().HasIndex(e => e.WorkoutId);
        }
    }
}