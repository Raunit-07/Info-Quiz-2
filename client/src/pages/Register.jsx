import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../App.css';

export default function Register() {
  const navigate = useNavigate();
  const { isAuthenticated, signIn, loading: authLoading } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [strength, setStrength] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/quiz');
    }
  }, [isAuthenticated, navigate]);

  const checkStrength = (pass) => {
    if (pass.length < 6) return 'Weak';
    if (pass.match(/[A-Z]/) && pass.match(/[0-9]/)) return 'Strong';
    return 'Medium';
  };

  const handleRegister = async () => {
  setError('');

  if (!username || !password || !confirm) {
    setError('All fields are required');
    return;
  }

  if (password !== confirm) {
    setError('Passwords do not match');
    return;
  }

  try {
    setLoading(true);

    console.log("Sending request...");

    const res = await api.post('/auth/register', { username, password });

    console.log("Response:", res.data);

    signIn(res.data.token);
    navigate('/quiz');
  } catch (err) {
    console.log("ERROR:", err.response?.data || err.message);
    const errorMessage = err.response?.data?.error || err.response?.data || 'Registration failed. Try again.';
    setError(typeof errorMessage === 'string' ? errorMessage : 'Registration failed. Try again.');
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
          <h3 className="back" onClick={() => navigate('/')}>← Registration</h3>

          <h2>Create a new account</h2>

          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setStrength(checkStrength(e.target.value));
            }}
          />

          {password && (
            <p className={`strength ${strength.toLowerCase()}`}>{strength}</p>
          )}

          <input
            type="password"
            placeholder="Repeat Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          {confirm && password !== confirm && (
            <p className="error">Passwords do not match</p>
          )}

          {error && <p className="error">{error}</p>}

          <button className="login-btn" onClick={handleRegister} disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>

          <p className="toggle">
            Already have an account?
            <span onClick={() => navigate('/')}> Login</span>
          </p>
        </div>
      )}
    </div>
  );
}
