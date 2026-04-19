import React from "react";

export default function LeaderboardRow({ user, index }) {
  return (
    <div style={{
      ...styles.row,
      animation: `fadeIn 0.5s ease ${index * 0.1}s forwards`,
      opacity: 0,
    }}>
      <span style={styles.rank}>#{index + 1}</span>
      <span style={styles.name}>{user.username}</span>
      <span style={styles.score}>{user.score}</span>
    </div>
  );
}

const styles = {
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 20px",
    borderRadius: "10px",
    marginBottom: "10px",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
  },
  rank: { fontWeight: "bold" },
  name: {},
  score: { fontWeight: "bold" },
};