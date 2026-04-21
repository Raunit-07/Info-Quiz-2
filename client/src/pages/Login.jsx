import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../App.css';
import logo from '../assets/logo.png';

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
  const hasVisited = localStorage.getItem("hasVisited");

  if (!hasVisited) {
    localStorage.setItem("hasVisited", "true");
    navigate("/register");
  }
}, []);
  const { isAuthenticated, signIn, loading: authLoading } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // 🔥 NEW: Wake backend (VERY IMPORTANT)
  useEffect(() => {
    fetch("https://quiz-backend-yg1i.onrender.com/api/health")
      .then(() => console.log("Backend awake"))
      .catch(() => console.log("Waking backend..."));
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      setError('All fields are required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const res = await api.post('/api/auth/login', {   // ✅ FIXED (no double /api)
        username,
        password,
      });

      signIn(res.data.token);
      navigate('/dashboard');

    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data ||
        'Login failed. Please try again.';

      setError(
        typeof errorMessage === 'string'
          ? errorMessage
          : 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {authLoading ? (
        <div className="login-card">
          <h2>Checking authentication...</h2>
          <p>Please wait while we verify your credentials.</p>
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
          />

          <div className="input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>

          <button className="login-btn" onClick={handleLogin} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {error && <p className="error">{error}</p>}

          <p className="toggle">
            New user?
            <span onClick={() => navigate('/register')}> Register</span>
          </p>
        </div>
      )}
    </div>
  );
}