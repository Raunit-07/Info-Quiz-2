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

  // ✅ HIGHEST SCORE PER USER (WITHIN A FILTERED SET)
  const getUniqueHighestScores = (arr) => {
    const map = new Map();

    arr.forEach((item) => {
      const username =
        item?.username ||
        item?.userId?.username ||
        "unknown";

      if (!map.has(username) || item.score > map.get(username).score) {
        map.set(username, item);
      }
    });

    return Array.from(map.values()).sort((a, b) => b.score - a.score);
  };

  // ✅ FILTER BY CATEGORY + MODE (EXCLUDING PODIUM USERS)
  const filterCategoryData = (cat, difficulty, podiumUsers = []) => {
    const podiumUsernames = new Set(
      podiumUsers.map((u) => u?.username?.toLowerCase())
    );

    const filtered = data.filter((item) => {
      const username =
        item?.username ||
        item?.userId?.username ||
        "unknown";

      const itemCategory = item?.category?.toLowerCase();
      const itemDifficulty = item?.difficulty?.toLowerCase();

      return (
        itemCategory === cat.toLowerCase() &&
        itemDifficulty === difficulty.toLowerCase() &&
        !podiumUsernames.has(username.toLowerCase())
      );
    });

    return getUniqueHighestScores(filtered).slice(0, 5);
  };

  // ✅ MEDAL FUNCTION
  const getMedal = (rank) => {
    if (rank === 0) return "🥇";
    if (rank === 1) return "🥈";
    if (rank === 2) return "🥉";
    return "";
  };

  // ✅ CHART DATA (TOP 10 FOR MODE)
  const getChartData = (modeData) => {
    return modeData.slice(0, 10).map((item) => ({
      username: item?.username || "User",
      score: typeof item?.score === "number" ? item.score : 0,
    }));
  };

  /* ================= FETCH ================= */

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get("/quiz/leaderboard");
      setData(res.data?.data || []);
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

  // ✅ 1. FILTER BY MODE FIRST
  const modeData = getUniqueHighestScores(
    data.filter((item) => item.difficulty === selectedMode)
  );

  // ✅ 2. GET TOP 3 FOR PODIUM
  const top3 = modeData.slice(0, 3);

  // ✅ 3. CHART DATA
  const chartData = getChartData(modeData);

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
          const username = user?.username || "User";

          return (
            <motion.div
              key={i}
              className={`podium-card ${i === 0 ? "first" : ""}`}
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
              <span className="cat-tag">{user.category}</span>
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
        {["Coding", "Sports", "Tech"].map((cat) => {
          const filtered = filterCategoryData(cat, selectedMode, top3);

          return (
            <div key={cat} className="category-card">
              <h2>{cat}</h2>

              {filtered.length === 0 ? (
                <p>No data</p>
              ) : (
                filtered.map((user, i) => {
                  const username = user?.username || "User";

                  return (
                    <div key={i} className="category-row">
                      <span className="rank">#{i + 1}</span>
                      <span className="user">{username}</span>
                      <span className="score">{user?.score || 0} pts</span>
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