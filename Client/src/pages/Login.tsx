import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Api";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  // 1. Fixed the event type here to React.FormEvent
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", { username, password });
      const { token } = response.data;

      localStorage.setItem("token", token);
      navigate("/homepage");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login to Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-indigo-500 text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-indigo-500 text-gray-900"
              required
            />
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              Login
            </button>

            {/* 2. Changed type to "button" and added navigate route to prevent accidental form submission */}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="w-full bg-white text-gray-700 border border-gray-300 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
