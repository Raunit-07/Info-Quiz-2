import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

export default function Leaderboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get("/quiz/leaderboard");
        setData(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <h2 className="center">Loading...</h2>;

  const top3 = data.slice(0, 3);
  const rest = data.slice(3);

  return (
    <div className="leaderboard-page">
      <Navbar />

      <h1 className="title">🏆 Leaderboard</h1>

      {/* 🏆 TOP 3 PODIUM */}
      <div className="podium">
        {top3.map((user, i) => (
          <motion.div
            key={i}
            className={`podium-card rank-${i}`}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.2 }}
          >
            <div className="rank">{i + 1}</div>

            <div className="avatar">
              {user.userId?.username?.charAt(0).toUpperCase()}
            </div>

            <h3>{user.userId?.username}</h3>
            <p>{user.score} pts</p>

            {/* 🔥 Fire for #1 */}
            {i === 0 && <div className="fire">🔥🔥🔥</div>}
          </motion.div>
        ))}
      </div>

      {/* 📊 LIST */}
      <div className="list">
        {rest.map((user, index) => (
          <motion.div
            key={index}
            className="row"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <span>{index + 4}</span>
            <span>{user.userId?.username}</span>
            <span>{user.score} pts</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}