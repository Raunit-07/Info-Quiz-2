import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function Quiz() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading: authLoading, logout } = useAuth();

  const { category, mode } = location.state || {};

  const QUESTION_TIME = 15;

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
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


  
  /* 🔥 FETCH QUESTIONS (FIXED) */
  useEffect(() => {
  const fetchQuestions = async () => {
    try {
      // ✅ FIX 1: map difficulty correctly
      const difficultyMap = {
        easy: "medium",
        medium: "medium",
        hard: "hard",
      };

      const realDifficulty = difficultyMap[mode] || "medium";

      console.log("Fetching:", category, realDifficulty);

      // ✅ API CALL
      const res = await api.get(
        `/quiz/questions?category=${category}&difficulty=${realDifficulty}`
      );

      console.log("API RESPONSE:", res.data);

      // ✅ FIX 2: correct response key
      let fetched = res.data.data || res.data.questions || [];

      // ✅ fallback safety (never empty)
      if (!fetched.length) {
        console.warn("No filtered questions, using fallback");
        fetched = res.data.data || [];
      }

      if (!fetched.length) {
        setQuestions([]);
        setLoading(false);
        return;
      }

      // ✅ shuffle questions
      fetched = shuffleArray(fetched);

      // ✅ shuffle options
      fetched = fetched.map((q) => ({
        ...q,
        options: shuffleArray(q.options),
      }));

      setQuestions(fetched);
      setLoading(false);

    } catch (err) {
      console.error("Fetch error:", err);
      setLoading(false);
    }
  };

  if (isAuthenticated && category) {
    fetchQuestions();
  }
}, [isAuthenticated, category, mode]);



  /* NEXT */
  const handleNext = useCallback(() => {
    setSelected(null);
    setShowAnswer(false);
    setTime(QUESTION_TIME);
    setCurrent((prev) => prev + 1);
  }, []);

  /* TIMER */
  useEffect(() => {
    clearInterval(timerRef.current);

    if (mode === "practice" || questions.length === 0) return;

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
  }, [current, questions.length, mode, handleNext]);

  /* CLICK */
  const handleOptionClick = (opt) => {
    if (showAnswer) return;

    setSelected(opt);
    setShowAnswer(true);

    const updated = [...answers];
    updated[current] = opt;
    setAnswers(updated);

    setTimeout(handleNext, 1500);
  };

  /* SUBMIT */
  const handleSubmit = async () => {
    try {
      await api.post("/quiz/submit", {
        answers,
        category,
        mode,
      });

      localStorage.removeItem("quiz-progress");

      navigate("/leaderboard");
    } catch (err) {
      console.error("Submit error:", err);
      logout();
    }
  };

  /* UI STATES */
  if (authLoading) return <h2 className="center">Loading...</h2>;
  if (!category || !mode) return <h2 className="center">Redirecting...</h2>;
  if (loading) return <h2 className="center">Loading questions...</h2>;

  if (!questions.length) {
    return <h2 className="center">No questions available 😕</h2>;
  }

  if (current >= questions.length) {
    return (
      <div className="submit-screen">
        <h2>🎯 Ready to Submit?</h2>
        <button className="submit-btn" onClick={handleSubmit}>
          🚀 Submit Quiz
        </button>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="quiz-page">
      <h2>{category} ({mode})</h2>

      <h3>{q.question}</h3>

      <div className="options">
        {q.options.map((opt, i) => {
          let status = "";

          if (showAnswer) {
            if (opt === q.answer) status = "correct";
            else if (opt === selected) status = "wrong";
          }

          return (
            <button
              key={i}
              className={`option-btn ${status}`}
              onClick={() => handleOptionClick(opt)}
              disabled={showAnswer}
            >
              {opt}
            </button>
          );
        })}
      </div>

      <p>
        Question {current + 1} / {questions.length}
      </p>
    </div>
  );
}