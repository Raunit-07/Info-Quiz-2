import React from "react";

export default function TopThree({ data }) {
  const top = data.slice(0, 3);

  return (
    <div style={styles.container}>
      {top.map((user, index) => {
        const medals = ["🥇", "🥈", "🥉"];

        return (
          <div key={index} style={{
            ...styles.card,
            transform: index === 0 ? "scale(1.1)" : "scale(1)"
          }}>
            <div style={styles.medal}>{medals[index]}</div>
            <h3>{user.username}</h3>
            <p>{user.score} pts</p>
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "30px",
  },
  card: {
    padding: "20px",
    borderRadius: "15px",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    textAlign: "center",
    minWidth: "120px",
    backdropFilter: "blur(10px)",
  },
  medal: {
    fontSize: "30px",
    marginBottom: "10px",
  },
};