import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login.js";

import Register from "./pages/Register.js";

import Homepage from "./pages/Homepage.js";
import UserStats from "./pages/UserStats.js";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/homepage" element={<Homepage />} />
      <Route path="/userstats" element={<UserStats />} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
