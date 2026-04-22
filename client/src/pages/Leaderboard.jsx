import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Leaderboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = localStorage.getItem("username");

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get("/quiz/leaderboard");
      const sorted = (res.data.data || []).sort(
        (a, b) => b.score - a.score
      );
      setData(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 LIVE UPDATE every 5 sec
  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <h2 className="center">Loading...</h2>;

  const top3 = data.slice(0, 3);
  const rest = data.slice(3);

  const getMedal = (rank) => {
    if (rank === 0) return "🥇";
    if (rank === 1) return "🥈";
    if (rank === 2) return "🥉";
    return "";
  };
  const chartData = data.map((item) => ({
  username: item.userId?.username || "User",
    score: item.score,
  }));

  return (
    <div className="leaderboard-page">
      <Navbar />

      <h1 className="title">🏆 Leaderboard</h1>

      <div style={{ width: "100%", height: 250, marginBottom: "30px" }}>
      <ResponsiveContainer>
        <BarChart data={chartData}>
        <XAxis dataKey="username" stroke="#fff" />
        <Tooltip />
        <Bar dataKey="score" radius={[10, 10, 0, 0]} />
      </BarChart>
      </ResponsiveContainer>
    </div>


      {/* 🏆 TOP 3 */}
      <div className="podium">
        {top3.map((user, i) => (
          <motion.div
            key={i}
            className={`podium-card rank-${i}`}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.2 }}
          >
            <div className="medal">{getMedal(i)}</div>

            <div className="avatar">
              {user.userId?.username?.charAt(0).toUpperCase()}
            </div>

            <h3>{user.userId?.username}</h3>
            <p>{user.score} pts</p>

            {i === 0 && <div className="glow"></div>}
          </motion.div>
        ))}
      </div>

      {/* 📊 FULL LIST */}
      <div className="list">
        {data.map((user, index) => {
          const isCurrent = user.userId?.username === currentUser;

          return (
            <motion.div
              key={index}
              className={`row ${isCurrent ? "active" : ""}`}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <span className="rank-num">#{index + 1}</span>

              <span className="name">
                {user.userId?.username}
              </span>

              <span className="score">
                {user.score} pts
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}