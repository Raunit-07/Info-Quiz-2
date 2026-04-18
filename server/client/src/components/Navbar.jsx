import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-left">
        <NavLink to="/quiz" className={({ isActive }) => isActive ? 'active' : ''}>
          Quiz
        </NavLink>
        <NavLink to="/leaderboard" className={({ isActive }) => isActive ? 'active' : ''}>
          Leaderboard
        </NavLink>
      </div>
      <button className="nav-logout" onClick={logout}>
        Logout
      </button>
    </nav>
  );
}
