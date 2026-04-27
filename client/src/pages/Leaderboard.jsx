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
  /* ================= STATE ================= */
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMode, setSelectedMode] = useState("medium");

  const currentUser = localStorage.getItem("username") || "";

  /* ================= HELPERS ================= */

  // ✅ REMOVE DUPLICATES (KEEP HIGHEST SCORE PER USER)
  const getUniqueUsers = (arr) => {
    const map = new Map();

    arr.forEach((item) => {
      const username = item?.userId?.username;

      if (!username) return;

      if (!map.has(username) || map.get(username).score < item.score) {
        map.set(username, item);
      }
    });

    return Array.from(map.values());
  };

  // ✅ FILTER BY CATEGORY + MODE
  const filterData = (category, difficulty) => {
    return data
      .filter(
        (item) =>
          item?.category === category &&
          item?.difficulty === difficulty
      )
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  };

  // ✅ MEDAL FUNCTION
  const getMedal = (rank) => {
    if (rank === 0) return "🥇";
    if (rank === 1) return "🥈";
    if (rank === 2) return "🥉";
    return "";
  };

  // ✅ CHART DATA
  const chartData = (data || [])
    .slice(0, 10)
    .map((item) => ({
      username: item?.userId?.username || "User",
      score: typeof item?.score === "number" ? item.score : 0,
    }));

  /* ================= FETCH ================= */

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get("/quiz/leaderboard");

      const sorted = (res.data?.data || []).sort(
        (a, b) => b.score - a.score
      );

      setData(getUniqueUsers(sorted));
    } catch (err) {
      console.error("Leaderboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= EFFECT ================= */

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 5000);
    return () => clearInterval(interval);
  }, []);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="center">
        <h2>Loading leaderboard...</h2>
      </div>
    );
  }

  const top3 = data.slice(0, 3);

  /* ================= UI ================= */

  return (
    <div className="leaderboard-page">
      <Navbar />

      <h1 className="title">🏆 Leaderboard</h1>

      {/* 📊 CHART */}
      <div style={{ width: "100%", height: 250, marginBottom: "30px" }}>
        {data.length > 0 && (
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <XAxis dataKey="username" stroke="#ccc" />
              <Tooltip />
              <Bar
                dataKey="score"
                fill="#22c55e"
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* 🏆 TOP 3 */}
      <div className="podium">
        {top3.map((user, i) => {
          const username = user?.userId?.username || "User";

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

      {/* 🎯 MODE SWITCH */}
      <div className="mode-switch">
        {["easy", "medium", "hard"].map((m) => (
          <button
            key={m}
            onClick={() => setSelectedMode(m)}
            className={selectedMode === m ? "active" : ""}
          >
            {m}
          </button>
        ))}
      </div>

      {/* 📦 CATEGORY GRID */}
      <div className="category-grid">
        {["coding", "sports", "tech"].map((cat) => {
          const filtered = filterData(cat, selectedMode);

          return (
            <div key={cat} className="category-card">
              <h2>{cat.toUpperCase()}</h2>

              {filtered.length === 0 ? (
                <p>No data</p>
              ) : (
                filtered.map((user, i) => {
                  const username =
                    user?.userId?.username || "User";

                  return (
                    <div key={i} className="category-row">
                      <span>#{i + 1}</span>
                      <span>{username}</span>
                      <span>{user.score} pts</span>
                    </div>
                  );
                })
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}