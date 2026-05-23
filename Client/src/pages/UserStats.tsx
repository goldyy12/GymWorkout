import { useEffect, useState } from "react";
import api from "../Api";

export default function UserStats() {
  const [weight, setWeight] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [age, setAge] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const statsResponse = await api.get("/user");
        const statsData = statsResponse.data;

        setWeight(statsData.weight);
        setHeight(statsData.height);
        setAge(statsData.age);
      } catch (error) {
        console.error("Failed to fetch user stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  if (loading) {
    return <div>Loading stats...</div>;
  }
  const editUserStats = async () => {
    try {
      await api.put("/user", {
        weight: Number(weight),
        height: Number(height),
        age: Number(age),
      });
      alert("Stats updated successfully!");
    } catch (error) {
      console.error("Failed to update stats:", error);
      alert("Failed to update stats. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans">
      <h1 className="text-3xl font-black text-emerald-400 tracking-tight">
        User Stats
      </h1>

      <a href="/homepage" className="text-emerald-400 hover:text-emerald-300">
        ← Back to Homepage
      </a>
      <div className="mt-6 bg-slate-800 p-6 rounded-lg shadow-md">
        <p>Height: {height} cm </p>
        <p>Weight: {weight} kg</p>
        <p>Age: {age} years</p>
      </div>
      <button
        onClick={() => setEditing(!editing)}
        className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
      >
        {editing ? "Cancel" : "Edit Stats"}
      </button>
      {editing && (
        <div className="mt-4 bg-slate-800 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-bold text-slate-200 mb-4">
            Edit User Stats
          </h2>
          <div className="space-y-4">
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="height"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1"
                >
                  Height (cm)
                </label>
                <input
                  id="height"
                  type="number"
                  value={height?.toString() || ""}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="bg-slate-700 text-slate-300 placeholder:text-slate-500 border border-slate-600 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label
                  htmlFor="weight"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1"
                >
                  Weight (kg)
                </label>
                <input
                  id="weight"
                  type="number"
                  value={weight?.toString() || ""}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="bg-slate-700 text-slate-300 placeholder:text-slate-500 border border-slate-600 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label
                  htmlFor="age"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1"
                >
                  Age
                </label>
                <input
                  id="age"
                  type="number"
                  value={age?.toString() || ""}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="bg-slate-700 text-slate-300 placeholder:text-slate-500 border border-slate-600 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <button
                type="submit"
                className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
                onClick={(e) => {
                  e.preventDefault();
                  editUserStats();
                }}
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
