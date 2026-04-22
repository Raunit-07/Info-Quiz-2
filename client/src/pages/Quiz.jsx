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

  /* 🔐 PROTECT */
  useEffect(() => {
    if (!location.state || !category || !mode) {
      navigate("/dashboard");
    }
  }, [location.state, category, mode, navigate]);

  /* 🚀 FETCH */
  useEffect(() => {
    if (!isAuthenticated || !category) return;

    const cacheKey = `${category}-${mode}`;
    const cached = localStorage.getItem(cacheKey);

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

        if (!fetched.length) {
          setTimeout(fetchQuestions, 2000);
          return;
        }

        fetched = shuffleArray(fetched).map((q) => ({
          ...q,
          options: shuffleArray(q.options),
        }));

        setQuestions(fetched);
        localStorage.setItem(cacheKey, JSON.stringify(fetched));
      } catch (err) {
        console.error(err);
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

  const handleNext = useCallback(() => {
    setSelected(null);
    setShowAnswer(false);
    setTime(QUESTION_TIME);
    setCurrent((prev) => prev + 1);
  }, []);

  const handleOptionClick = (opt) => {
    if (showAnswer) return;

    setSelected(opt);
    setShowAnswer(true);

    setTimeout(handleNext, 1200);
  };

  /* ⏳ LOADING */
  if (authLoading || loading) {
    return (
      <div className="quiz-bg center">
        <h2>🚀 Loading Quiz...</h2>
        <p>Server waking up (first load may take time)</p>
      </div>
    );
  }

  if (!questions.length) {
    return <h2 className="center">No questions 😕</h2>;
  }

  if (current >= questions.length) {
    return (
      <div className="quiz-bg center">
        <h1>🎉 Quiz Completed</h1>
        <button onClick={() => navigate("/leaderboard")}>
          View Leaderboard
        </button>
      </div>
    );
  }

  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className="quiz-bg">

      {/* HEADER */}
      <div className="quiz-header">
        <h2>{category} • {mode}</h2>

        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* TIMER CIRCLE */}
      <div className="timer-ring">
        <svg>
          <circle cx="40" cy="40" r="35" />
          <circle
            cx="40"
            cy="40"
            r="35"
            style={{
              strokeDashoffset: 220 - (time / QUESTION_TIME) * 220,
            }}
          />
        </svg>
        <span>{time}s</span>
      </div>

      {/* CARD */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="quiz-card"
        >
          <h3>{q.question}</h3>

          <div className="options">
            {q.options.map((opt, i) => {
              let status = "";

              if (showAnswer) {
                if (opt === q.answer) status = "correct";
                else if (opt === selected) status = "wrong";
              }

              return (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`option ${status}`}
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