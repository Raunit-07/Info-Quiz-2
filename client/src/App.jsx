import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Quiz from "./pages/Quiz";
import Leaderboard from "./pages/Leaderboard";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ✅ Default route */}
          <Route
  path="/"
  element={
    localStorage.getItem("token")
      ? <Navigate to="/dashboard" />
      : <Navigate to="/login" />
  }
/>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ✅ Protected routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/quiz"
            element={
              <PrivateRoute>
                <Quiz />
              </PrivateRoute>
            }
          />

          <Route
            path="/leaderboard"
            element={
              <PrivateRoute>
                <Leaderboard />
              </PrivateRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}