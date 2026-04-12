import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../App.css';
import logo from '../assets/logo.png';

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, signIn } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/quiz');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    if (!username || !password) {
      setError('All fields are required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const res = await api.post('/auth/login', {
        username,
        password,
      });

      signIn(res.data.token);
      navigate('/quiz');
    } catch (err) {
      setError(err.response?.data || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
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
    </div>
  );
}
