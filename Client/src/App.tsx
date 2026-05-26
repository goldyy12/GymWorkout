import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import Homepage from "./pages/Homepage.js";
import UserStats from "./pages/UserStats.js";
import ProtectedRoute from "./context/protectedRoutes.js";
import { useAuth } from "./context/useAuth.js";

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <Navigate to="/homepage" replace /> : children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/homepage"
        element={
          <ProtectedRoute>
            <Homepage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/userstats"
        element={
          <ProtectedRoute>
            <UserStats />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
//
export default App;
