import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Leaderboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = localStorage.getItem("username") || "";

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get("/quiz/leaderboard");

      const sorted = (res.data.data || []).sort(
        (a, b) => b.score - a.score
      );

      setData(sorted);
    } catch (err) {
      console.error("Leaderboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* 🔥 LIVE UPDATE */
  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="center">
        <h2>Loading leaderboard...</h2>
      </div>
    );
  }

  const top3 = data.slice(0, 3);

  const getMedal = (rank) => {
    return ["🥇", "🥈", "🥉"][rank] || "";
  };

  const chartData = data.slice(0, 10).map((item) => ({
    username: item.userId?.username || "User",
    score: item.score,
  }));

  return (
    <div className="leaderboard-page">
      <Navbar />

      <h1 className="title">🏆 Leaderboard</h1>

      {/* 📊 CHART (FIXED HEIGHT ISSUE) */}
      <div
        style={{
          width: "90%",
          maxWidth: "700px",
          height: "300px",
          margin: "20px auto",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="username" stroke="#fff" />
            <Tooltip />
            <Bar dataKey="score" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🏆 TOP 3 */}
      <div className="podium">
        {top3.map((user, i) => {
          const username = user.userId?.username || "User";

          return (
            <motion.div
              key={i}
              className="podium-card"
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.2 }}
            >
              <div className="medal">{getMedal(i)}</div>

              <div className="avatar">
                {username.charAt(0).toUpperCase()}
              </div>

              <h3>{username}</h3>
              <p>{user.score} pts</p>
            </motion.div>
          );
        })}
      </div>

      {/* 📊 FULL LIST */}
      <div className="list">
        {data.map((user, index) => {
          const username = user.userId?.username || "User";
          const isCurrent = username === currentUser;

          return (
            <motion.div
              key={index}
              className={`row ${isCurrent ? "active" : ""}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className="rank-num">#{index + 1}</span>
              <span className="name">{username}</span>
              <span className="score">{user.score} pts</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}