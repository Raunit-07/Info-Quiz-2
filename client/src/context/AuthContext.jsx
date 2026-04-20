import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔥 Check token on app load
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && token !== "undefined" && token !== "null") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    setLoading(false);
  }, []);

  // ✅ Login
  const signIn = (token) => {
    if (token) {
      localStorage.setItem("token", token);
      setIsAuthenticated(true);
    }
  };

  // ✅ Logout (FIXED)
  const logout = () => {
    localStorage.clear(); // 🔥 clear everything
    setIsAuthenticated(false);

    // ❌ avoid full reload
    window.location.replace("/login");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, signIn, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}