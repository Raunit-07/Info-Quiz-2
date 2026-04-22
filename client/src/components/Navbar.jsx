import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div style={styles.nav}>
      <h2 style={styles.logo}>🧠 InfoQuiz</h2>

      <div style={styles.actions}>
        <button onClick={() => navigate("/dashboard")} style={styles.link}>
          Dashboard
        </button>

        <button onClick={() => navigate("/leaderboard")} style={styles.link}>
          Leaderboard
        </button>

        <button onClick={logout} style={styles.logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(10px)",
  },
  logo: { color: "#fff" },
  actions: { display: "flex", gap: "15px" },
  link: {
    background: "transparent",
    border: "none",
    color: "#fff",
    cursor: "pointer",
  },
  logout: {
    background: "#ff4d4d",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    color: "#fff",
    cursor: "pointer",
  },
};