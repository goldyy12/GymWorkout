import { useState, useEffect, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import api from "../Api";
import { type Exercise, type Workout } from "../types/exercise";

const toLocalDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const toLocalDateTimeInput = (date: Date): string => {
  const key = toLocalDateKey(date);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${key}T${hours}:${minutes}`;
};

export default function Homepage() {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const [showCreateWorkout, setShowCreateWorkout] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // workout form
  const [workoutName, setWorkoutName] = useState("");
  const [workoutDescription, setWorkoutDescription] = useState("");
  const [workoutDateTime, setWorkoutDateTime] = useState<string>(
    toLocalDateTimeInput(new Date()),
  );

  const [exerciseForms, setExerciseForms] = useState<
    Record<
      number,
      {
        name: string;
        sets: number;
        reps: number;
        show: boolean;
        weight: number | null;
      }
    >
  >({});

  const getForm = (workoutId: number) =>
    exerciseForms[workoutId] ?? {
      name: "",
      sets: 3,
      reps: 10,
      show: true,
      weight: null,
    };

  useEffect(() => {
    const fetchWorkouts = async () => {
      setIsFetching(true);

      try {
        const res = await api.get("/workout");
        setWorkouts(res.data);
      } catch {
        console.error("Failed to fetch workouts.");
      } finally {
        setIsFetching(false);
      }
    };
    fetchWorkouts();
  }, []);

  const formattedDate = toLocalDateKey(selectedDate);

  const currentDayWorkouts = useMemo(() => {
    return workouts.filter(
      (w) => toLocalDateKey(new Date(w.dateTime)) === formattedDate,
    );
  }, [workouts, formattedDate]);

  const workoutIds = currentDayWorkouts.map((w) => w.id).join(",");

  useEffect(() => {
    if (!workoutIds) return;

    const fetchAllExercisesForDay = async () => {
      setIsFetching(true);
      try {
        const promises = workoutIds
          .split(",")
          .map((id) =>
            api.get(`/workouts/${id}/exercises`).then((res) => res.data),
          );
        const results = await Promise.all(promises);
        setExercises(results.flat());
      } catch {
        console.error("Failed to fetch exercises.");
      } finally {
        setIsFetching(false);
      }
    };

    fetchAllExercisesForDay();
  }, [workoutIds]);
  const deleteExercise = async (exerciseId: number, workoutId: number) => {
    setIsSaving(true);

    try {
      await api.delete(`/workouts/${workoutId}/exercises/${exerciseId}`);
      setExercises((prev) => prev.filter((ex) => ex.id !== exerciseId));
    } catch {
      console.error("Failed to delete exercise.");
    } finally {
      setIsSaving(false);
    }
  };

  const workoutsByDate = useMemo(() => {
    const map: Record<string, Workout[]> = {};
    workouts.forEach((w) => {
      const key = toLocalDateKey(new Date(w.dateTime));
      if (!map[key]) map[key] = [];
      map[key].push(w);
    });
    return map;
  }, [workouts]);

  const exercisesByWorkoutId = useMemo(() => {
    const map: Record<number, Exercise[]> = {};
    exercises.forEach((ex) => {
      if (!map[ex.workoutId]) map[ex.workoutId] = [];
      map[ex.workoutId].push(ex);
    });
    return map;
  }, [exercises]);

  const handleDateChange = (val: Date) => {
    setSelectedDate(val);
    setWorkoutDateTime(toLocalDateTimeInput(val));
  };

  const handleCreateWorkout = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        name: workoutName,
        description: workoutDescription,
        dateTime: workoutDateTime,
      };
      const res = await api.post("/workout", payload);
      const newWorkout: Workout =
        res.data && res.data.id ? res.data : { ...payload, id: Date.now() };
      setWorkouts((prev) => [...prev, newWorkout]);

      setWorkoutName("");
      setWorkoutDescription("");
      setWorkoutDateTime(toLocalDateTimeInput(selectedDate));
      setShowCreateWorkout(false);
    } catch {
      console.error("Failed to create workout.");
    } finally {
      setIsSaving(false);
    }
  };
  const calculateOneRepMax = (weight: number, reps: number): number => {
    weight = Number(weight);
    reps = Number(reps);
    if (reps === 1) return weight;
    return Math.round(weight * (1 + reps / 30));
  };
  const patchForm = (
    workoutId: number,
    patch: Partial<{
      name: string;
      sets: number;
      reps: number;
      show: boolean;
      weight: number | null;
    }>,
  ) =>
    setExerciseForms((prev) => ({
      ...prev,
      [workoutId]: { ...getForm(workoutId), ...patch },
    }));

  const handleCreateExerciseInternal = async (
    e: React.SubmitEvent<HTMLFormElement>,
    workoutId: number,
  ) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const form = getForm(workoutId);
      const payload = {
        name: form.name,
        sets: form.sets,
        reps: form.reps,
        weight: form.weight,
      };
      patchForm(workoutId, { name: "", sets: 3, reps: 10, weight: null });
      const res = await api.post(`/workouts/${workoutId}/exercises`, payload);

      setExercises((prev) => [...prev, res.data]);

      // Reset exercise form
    } catch {
      console.error("Failed to create exercise.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-center border-b border-slate-800 pb-4">
          <h1 className="text-3xl font-black text-emerald-400 tracking-tight">
            GymWorkout Tracker
          </h1>
          <span className="text-sm font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-md border border-slate-800">
            <a href="/userstats" className="hover:text-emerald-400">
              View Stats
            </a>
          </span>
          <span className="text-sm font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-md border border-slate-800">
            Active Date: {formattedDate}
          </span>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl h-fit">
            <h2 className="text-lg font-bold text-slate-200 mb-4">
              Select Workout Date
            </h2>
            <div className="custom-calendar-wrapper w-full text-slate-900 max-w-md ">
              <Calendar
                value={selectedDate}
                onChange={(val) => handleDateChange(val as Date)}
                tileContent={({ date }) => {
                  const dateStr = toLocalDateKey(date);
                  const dayWorkouts = workoutsByDate[dateStr] || [];
                  if (dayWorkouts.length === 0) return null;
                  return (
                    <div className="mt-1">
                      {dayWorkouts.map((w) => (
                        <p
                          key={w.id}
                          className="text-[10px] text-emerald-400 font-bold leading-tight wrap-break-words text-center mt-0.5"
                        >
                          {w.name}
                        </p>
                      ))}
                    </div>
                  );
                }}
              />
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-4">
            {showCreateWorkout ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-slate-200">
                    Log a New Workout
                  </h2>
                  <button
                    onClick={() => setShowCreateWorkout(false)}
                    className="text-xs text-slate-400 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleCreateWorkout} className="space-y-4">
                  <div>
                    <label
                      htmlFor="workoutName"
                      className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1"
                    >
                      Workout Name
                    </label>
                    <input
                      id="workoutName"
                      type="text"
                      required
                      value={workoutName}
                      onChange={(e) => setWorkoutName(e.target.value)}
                      placeholder="e.g., Push Day"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="workoutDateTime"
                      className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1"
                    >
                      Date &amp; Time
                    </label>
                    <input
                      id="workoutDateTime"
                      type="datetime-local"
                      required
                      value={workoutDateTime}
                      onChange={(e) => setWorkoutDateTime(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="workoutDescription"
                      className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1"
                    >
                      Description
                    </label>
                    <textarea
                      id="workoutDescription"
                      rows={3}
                      value={workoutDescription}
                      onChange={(e) => setWorkoutDescription(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 px-4 rounded-lg"
                  >
                    {isSaving ? "Saving..." : "Create Workout"}
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setShowCreateWorkout(true)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 px-4 rounded-lg self-start"
                >
                  + Create New Workout
                </button>

                {/* WORKOUT LIST */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
                  <h3 className="text-xl font-bold mb-4 text-slate-200">
                    Workouts for {formattedDate}
                  </h3>

                  {isFetching && !showCreateWorkout ? (
                    <p className="text-slate-500 italic">Loading…</p>
                  ) : currentDayWorkouts.length > 0 ? (
                    <div className="space-y-4">
                      {currentDayWorkouts.map((w) => {
                        // Grab exercises specific to this card's workout id
                        const workoutExercises =
                          exercisesByWorkoutId[w.id] || [];

                        return (
                          <div
                            key={w.id}
                            className="p-4 bg-slate-950 border border-slate-800 rounded-lg"
                          >
                            <h4 className="font-bold text-emerald-400 text-lg">
                              {w.name}
                            </h4>
                            {w.description && (
                              <p className="text-slate-400 mt-1 text-sm">
                                {w.description}
                              </p>
                            )}
                            <span className="text-xs text-slate-500 mt-2 block font-mono">
                              {w.dateTime?.split("T")[1]?.slice(0, 5) ??
                                "All Day"}
                            </span>

                            {/* ALWAYS VISIBLE EXERCISES SECTION */}
                            <div className="mt-3 pt-3 border-t border-slate-800">
                              {workoutExercises.length > 0 ? (
                                <ul className="space-y-1 mb-4">
                                  {workoutExercises.map((ex: Exercise) => (
                                    <li
                                      key={ex.id}
                                      className="text-sm text-slate-300 flex gap-4"
                                    >
                                      <span className="text-emerald-400 font-medium">
                                        {ex.name}
                                      </span>
                                      <span className="text-slate-500">
                                        {ex.sets} sets × {ex.reps} reps
                                      </span>
                                      <span className="text-slate-500">
                                        {ex.weight !== null
                                          ? `${ex.weight} kg`
                                          : "Bodyweight"}
                                      </span>

                                      <span className="text-amber-400 font-mono text-xs">
                                        1RM:{" "}
                                        {ex.weight !== null
                                          ? calculateOneRepMax(
                                              ex.weight,
                                              ex.reps,
                                            )
                                          : "N/A"}{" "}
                                        kg
                                      </span>
                                      <button
                                        onClick={() =>
                                          deleteExercise(ex.id, ex.workoutId)
                                        }
                                        disabled={isSaving}
                                        className="text-xs text-amber-500 hover:text-amber-600"
                                      >
                                        Delete
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-slate-500 text-sm italic mb-4">
                                  No exercises logged yet.
                                </p>
                              )}

                              {getForm(w.id).show ? (
                                <form
                                  onSubmit={(e) =>
                                    handleCreateExerciseInternal(e, w.id)
                                  }
                                  className="space-y-3"
                                >
                                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Add Exercise
                                  </p>

                                  <input
                                    type="text"
                                    required
                                    value={getForm(w.id).name}
                                    onChange={(e) =>
                                      patchForm(w.id, { name: e.target.value })
                                    }
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                                  />

                                  <div className="flex gap-3">
                                    <div className="flex-1 flex flex-col gap-1">
                                      <label className="text-xs text-slate-400">
                                        Sets
                                      </label>
                                      <input
                                        type="number"
                                        min={1}
                                        value={getForm(w.id).sets}
                                        onChange={(e) =>
                                          patchForm(w.id, {
                                            sets: Number(e.target.value),
                                          })
                                        }
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                                      />
                                    </div>
                                    <div className="flex-1 flex flex-col gap-1">
                                      <label className="text-xs text-slate-400">
                                        Reps
                                      </label>
                                      <input
                                        type="number"
                                        min={1}
                                        value={getForm(w.id).reps}
                                        onChange={(e) =>
                                          patchForm(w.id, {
                                            reps: Number(e.target.value),
                                          })
                                        }
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                                      />
                                    </div>
                                    <div className="flex-1 flex flex-col gap-1">
                                      <label className="text-xs text-slate-400">
                                        Weight (kg)
                                      </label>
                                      <input
                                        type="number"
                                        min={0}
                                        value={getForm(w.id).weight ?? ""}
                                        onChange={(e) =>
                                          patchForm(w.id, {
                                            weight:
                                              e.target.value === ""
                                                ? null
                                                : Number(e.target.value),
                                          })
                                        }
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-amber-400"
                                      />
                                    </div>
                                  </div>

                                  <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full bg-emerald-500 text-slate-950 font-bold py-2 rounded-lg"
                                  >
                                    {isSaving ? "Adding..." : "+ Add Exercise"}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      patchForm(w.id, { show: false })
                                    }
                                    className="text-xs text-slate-400 bg-amber-500 hover:bg-amber-600 hover:text-slate-100 px-2 py-1 rounded-md"
                                  >
                                    Hide Form
                                  </button>
                                </form>
                              ) : (
                                <button
                                  onClick={() =>
                                    patchForm(w.id, { show: true })
                                  }
                                  className="text-xs text-emerald-400 hover:underline bg-slate-900 px-2 py-1 rounded-md"
                                >
                                  Show Add Exercise Form
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic">
                      No workouts logged for this day.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
