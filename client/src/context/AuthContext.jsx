import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ IMPORTANT

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate(); // ✅ use React routing

  /* =========================
     ✅ CHECK TOKEN ON LOAD
  ========================= */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && token !== "undefined" && token !== "null") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    setLoading(false);
  }, []);

  /* =========================
     ✅ LOGIN
  ========================= */
  const signIn = (token) => {
    if (token) {
      localStorage.setItem("token", token);
      setIsAuthenticated(true);

      // ✅ redirect after login
      navigate("/dashboard");
    }
  };

  /* =========================
     ✅ LOGOUT (FIXED PROPERLY)
  ========================= */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("quiz-progress");

    setIsAuthenticated(false);

    // ✅ clean SPA redirect
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, signIn, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* =========================
   ✅ CUSTOM HOOK
========================= */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}