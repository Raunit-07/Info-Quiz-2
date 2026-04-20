import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // ⏳ Wait until auth state is resolved
  if (loading) {
    return <div className="center">Loading...</div>;
  }

  // 🔐 Check both context + token (extra safe for production)
  const token = localStorage.getItem("token");

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Allow access
  return children;
}