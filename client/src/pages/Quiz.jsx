import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function Quiz() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const { category, mode } = location.state || {};
  const QUESTION_TIME = 15;

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [time, setTime] = useState(QUESTION_TIME);
  const [loading, setLoading] = useState(true);

  const timerRef = useRef(null);

  /* 🔐 PROTECT ROUTE */
  useEffect(() => {
    if (!location.state || !category || !mode) {
      navigate("/dashboard");
    }
  }, [location.state, category, mode, navigate]);

  /* 🚀 FETCH QUESTIONS (FIXED) */
  useEffect(() => {
    if (!isAuthenticated || !category) return;

    const cacheKey = `${category}-${mode}`;
    const cached = localStorage.getItem(cacheKey);

    // ⚡ INSTANT LOAD FROM CACHE
    if (cached) {
      setQuestions(JSON.parse(cached));
      setLoading(false);
      return;
    }

    const fetchQuestions = async () => {
      try {
        setLoading(true);

        const res = await api.get(
          `/quiz/questions?category=${category}&difficulty=${mode}`
        );

        let fetched = res.data.questions || [];

        // 🔁 RETRY IF EMPTY
        if (!fetched.length) {
          console.warn("Retrying...");
          setTimeout(fetchQuestions, 2000);
          return;
        }

        fetched = shuffleArray(fetched).map((q) => ({
          ...q,
          options: shuffleArray(q.options),
        }));

        setQuestions(fetched);

        // 💾 CACHE SAVE
        localStorage.setItem(cacheKey, JSON.stringify(fetched));

      } catch (err) {
        console.error("Fetch error:", err);

        // 🔁 RETRY ON ERROR
        setTimeout(fetchQuestions, 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [isAuthenticated, category, mode]);

  /* ⏱ TIMER */
  useEffect(() => {
    clearInterval(timerRef.current);

    if (!questions.length) return;

    timerRef.current = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          handleNext();
          return QUESTION_TIME;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [current, questions.length]);

  /* ➡ NEXT */
  const handleNext = useCallback(() => {
    setSelected(null);
    setShowAnswer(false);
    setTime(QUESTION_TIME);
    setCurrent((prev) => prev + 1);
  }, []);

  /* 🎯 CLICK */
  const handleOptionClick = (opt) => {
    if (showAnswer) return;

    setSelected(opt);
    setShowAnswer(true);

    setTimeout(handleNext, 1200);
  };

  /* ⏳ LOADING UI */
  if (authLoading || loading) {
    return (
      <div className="center">
        <h2>🚀 Loading questions...</h2>
        <p>First time may take 10–20s (Render server waking up)</p>
      </div>
    );
  }

  /* ❌ NO QUESTIONS */
  if (!questions.length) {
    return <h2 className="center">No questions 😕</h2>;
  }

  /* 🎉 END */
  if (current >= questions.length) {
    return (
      <div className="center">
        <h1>🎉 Quiz Completed</h1>
        <button onClick={() => navigate("/leaderboard")}>
          View Leaderboard
        </button>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="quiz-container">

      {/* HEADER */}
      <div className="quiz-header">
        <h2>{category} • {mode}</h2>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${((current + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* TIMER */}
      <div className="timer">{time}s</div>

      {/* CARD */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -200, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="card"
        >
          <h3>{q.question}</h3>

          <div className="options">
            {q.options.map((opt, i) => {
              let className = "option";

              if (showAnswer) {
                if (opt === q.answer) className += " correct";
                else if (opt === selected) className += " wrong";
              }

              return (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.95 }}
                  className={className}
                  onClick={() => handleOptionClick(opt)}
                >
                  {opt}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <p className="question-count">
        {current + 1} / {questions.length}
      </p>
    </div>
  );
}