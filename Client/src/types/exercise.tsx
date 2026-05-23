export interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: number;
  weight: number | null;
  workoutId: number;
}

export interface Workout {
  id: number;
  name: string;
  dateTime: string; // Formatting: YYYY-MM-DD
  exercises: Exercise[];
  description: string;
}
