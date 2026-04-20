import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // ⏳ Wait until auth state is checked
  if (loading) {
    return <div className="center">Loading...</div>;
  }

  const token = localStorage.getItem("token");

  // ❌ If NO token OR auth false → go to login
  if (!token || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ✅ If valid → allow access
  return children;
}