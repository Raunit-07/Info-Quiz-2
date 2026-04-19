import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import LeaderboardRow from "../components/LeaderboardRow";
import TopThree from "../components/TopThree";

export default function Leaderboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get("/quiz/leaderboard");
        setData(res.data.data || []);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError("Unable to load leaderboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return <h2 style={styles.center}>Loading Leaderboard...</h2>;
  }

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.card}>
        <h1 style={styles.title}>🏆 Leaderboard</h1>

        {error ? (
          <p style={styles.error}>{error}</p>
        ) : data.length === 0 ? (
          <p style={styles.empty}>No data available</p>
        ) : (
          <>
            {/* 🔥 Top 3 */}
            <TopThree data={data} />

            {/* 🔥 Rest */}
            <div>
              {data.slice(3).map((user, index) => (
                <LeaderboardRow
                  key={index}
                  user={user}
                  index={index + 3}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* animation keyframes */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f172a",
    padding: "20px",
  },
  card: {
    maxWidth: "700px",
    margin: "auto",
    padding: "30px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(20px)",
    color: "#fff",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  center: {
    textAlign: "center",
    marginTop: "50px",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  empty: {
    textAlign: "center",
    opacity: 0.7,
  },
};