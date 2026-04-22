import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /* 🔐 CHECK TOKEN */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && token !== "undefined" && token !== "null") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    setLoading(false);
  }, []);

  /* ✅ LOGIN */
  const signIn = (token, username) => {
    if (!token) return;

    localStorage.setItem("token", token);

    if (username) {
      localStorage.setItem("username", username); // 🔥 IMPORTANT
    }

    setIsAuthenticated(true);

    navigate("/dashboard");
  };

  /* 🚪 LOGOUT */
  const logout = () => {
    localStorage.clear();

    setIsAuthenticated(false);

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

/* ✅ HOOK */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}