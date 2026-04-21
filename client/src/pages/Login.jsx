import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../App.css";
import logo from "../assets/logo.png";

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, signIn, loading: authLoading } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* =========================
     ✅ REDIRECT IF LOGGED IN
  ========================= */
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, authLoading, navigate]);

  /* =========================
     🔥 WAKE BACKEND (Render fix)
  ========================= */
  useEffect(() => {
    const wakeBackend = async () => {
      try {
        await fetch(
          "https://quiz-backend-yg1i.onrender.com/api/health"
        );
        console.log("Backend awake");
      } catch {
        console.log("Waking backend...");
      }
    };

    wakeBackend();
  }, []);

  /* =========================
     ✅ LOGIN HANDLER
  ========================= */
  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // ✅ CORRECT API PATH (NO DOUBLE /api)
      const res = await api.post("/auth/login", {
        username,
        password,
      });

      if (!res.data?.token) {
        throw new Error("Token not received");
      }

      // ✅ SAVE TOKEN
      signIn(res.data.token);

      // ✅ REDIRECT
      navigate("/dashboard");

    } catch (err) {
      console.error("Login error:", err);

      const msg =
        err.response?.data?.error ||
        err.response?.data ||
        err.message ||
        "Login failed. Please try again.";

      setError(typeof msg === "string" ? msg : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     ⌨️ ENTER KEY SUPPORT
  ========================= */
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="login-page">
      {authLoading ? (
        <div className="login-card">
          <h2>Checking authentication...</h2>
          <p>Please wait...</p>
        </div>
      ) : (
        <div className="login-card">
          <img src={logo} alt="logo" className="logo" />

          <h2>Welcome to Info Quiz</h2>

          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button
            className="login-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && <p className="error">{error}</p>}

          <p className="toggle">
            New user?
            <span onClick={() => navigate("/register")}> Register</span>
          </p>
        </div>
      )}
    </div>
  );
}