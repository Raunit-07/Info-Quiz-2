import { useState, useEffect } from "react";
import ModeSelector from "../components/ModeSelector";
import CategorySelector from "../components/CategorySelector";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // ✅ ADD THIS

export default function Dashboard() {
  const navigate = useNavigate();

  const [mode, setMode] = useState(null);
  const [category, setCategory] = useState(null);

  /* 🔥 WAKE BACKEND */
  useEffect(() => {
    fetch("https://quiz-backend-yg1i.onrender.com/api/health")
      .then(() => console.log("Backend awake"))
      .catch(() => console.log("Waking backend..."));
  }, []);

  /* 🧹 CLEAR OLD DATA */
  useEffect(() => {
    localStorage.removeItem("quiz-mode");
    localStorage.removeItem("quiz-category");
  }, []);

  useEffect(() => {
    if (mode) localStorage.setItem("quiz-mode", mode);
  }, [mode]);

  useEffect(() => {
    if (category) localStorage.setItem("quiz-category", category);
  }, [category]);

  /* 🚀 PRELOAD QUESTIONS (KEY FIX) */
  useEffect(() => {
    if (!mode || !category) return;

    const preload = async () => {
      try {
        console.log("Preloading quiz...");

        const res = await api.get(
          `/quiz/questions?category=${category}&difficulty=${mode}`
        );

        const questions = res.data.questions || [];

        if (questions.length) {
          localStorage.setItem(
            `${category}-${mode}`,
            JSON.stringify(questions)
          );
          console.log("⚡ Questions cached");
        }
      } catch (err) {
        console.log("Preload failed (will fetch later)");
      }
    };

    preload();
  }, [mode, category]);

  const startQuiz = () => {
    if (!mode || !category) {
      alert("Please select both mode and category");
      return;
    }

    navigate("/quiz", {
      state: { mode, category },
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.glow1}></div>
      <div style={styles.glow2}></div>

      <div style={styles.card}>
        <h1 style={styles.title}>Welcome back 👋</h1>
        <p style={styles.subtitle}>Ready to challenge your mind?</p>

        <div style={styles.divider}></div>

        <ModeSelector
          selectedMode={mode}
          setSelectedMode={setMode}
        />

        <CategorySelector
          selectedCategory={category}
          setSelectedCategory={setCategory}
        />

        <button
          onClick={startQuiz}
          disabled={!mode || !category}
          style={{
            ...styles.button,
            opacity: mode && category ? 1 : 0.5,
          }}
        >
          🚀 Start Quiz
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    background: "#0f172a",
    overflow: "hidden",
    padding: "20px",
  },

  // 🌟 glowing background
  glow1: {
    position: "absolute",
    width: "400px",
    height: "400px",
    background: "radial-gradient(circle, #6366f1, transparent)",
    top: "-100px",
    left: "-100px",
    filter: "blur(120px)",
  },
  glow2: {
    position: "absolute",
    width: "400px",
    height: "400px",
    background: "radial-gradient(circle, #ec4899, transparent)",
    bottom: "-100px",
    right: "-100px",
    filter: "blur(120px)",
  },

  // 🧊 glass card
  card: {
    position: "relative",
    backdropFilter: "blur(20px)",
    background: "rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "40px",
    width: "100%",
    maxWidth: "650px",
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
    color: "#fff",
  },

  title: {
    fontSize: "30px",
    fontWeight: "700",
    marginBottom: "10px",
    letterSpacing: "0.5px",
  },

  subtitle: {
    color: "#cbd5f5",
    marginBottom: "25px",
    fontSize: "15px",
  },

  divider: {
    height: "1px",
    background: "rgba(255,255,255,0.1)",
    marginBottom: "25px",
  },

  button: {
    marginTop: "35px",
    padding: "16px 35px",
    fontSize: "18px",
    borderRadius: "999px",
    border: "none",
    background: "linear-gradient(135deg, #6366f1, #ec4899)",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 10px 25px rgba(99,102,241,0.5)",
  },
};