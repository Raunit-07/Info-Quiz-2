import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

/* ✅ FIX 1: ADD THIS FUNCTION */
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

  /* ✅ FIX 2: PROTECT ROUTE */
  useEffect(() => {
    if (!location.state) {
      navigate("/");
    }
  }, [location.state, navigate]);

  /* ✅ FETCH QUESTIONS */
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get(`/quiz/questions?category=${category}`);

        let fetched = res.data.data || [];

        if (!fetched.length) {
          setQuestions([]);
          setLoading(false);
          return;
        }

        // Shuffle questions
        fetched = shuffleArray(fetched);

        // Shuffle options
        fetched = fetched.map((q) => ({
          ...q,
          options: shuffleArray(q.options),
        }));

        if (mode === "quick") {
          fetched = fetched.slice(0, 5);
        }

        setQuestions(fetched);

        // Restore progress
        let saved = null;
        try {
          saved = JSON.parse(localStorage.getItem("quiz-progress"));
        } catch {
          saved = null;
        }

        if (saved && saved.category === category) {
          setCurrent(saved.current || 0);
          setAnswers(saved.answers || []);
        }

        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setLoading(false);
      }
    };

    if (isAuthenticated && category) {
      fetchQuestions();
    }
  }, [isAuthenticated, category, mode]); // ❌ removed shuffleArray

  /* ✅ NEXT */
  const handleNext = useCallback(() => {
    setSelected(null);
    setShowAnswer(false);
    setTime(QUESTION_TIME);
    setCurrent((prev) => prev + 1);
  }, []);

  /* ✅ TIMER */
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

  /* ✅ SAVE PROGRESS */
  useEffect(() => {
    localStorage.setItem(
      "quiz-progress",
      JSON.stringify({ current, answers, category })
    );
  }, [current, answers, category]);

  /* ✅ CLICK */
  const handleOptionClick = (opt) => {
    if (showAnswer) return;

    setSelected(opt);
    setShowAnswer(true);

    const updated = [...answers];
    updated[current] = opt;
    setAnswers(updated);

    setTimeout(handleNext, 2000);
  };

  /* ✅ SUBMIT */
  const handleSubmit = async () => {
    try {
      await api.post("/quiz/submit", {
        answers,
        category,
        mode,
      });

      localStorage.removeItem("quiz-progress");
      localStorage.removeItem("quiz-mode");
      localStorage.removeItem("quiz-category");

      navigate("/leaderboard");
    } catch (err) {
      console.error("Submit error:", err);
      logout();
    }
  };

  /* ✅ LOADING */
  if (authLoading || loading) {
    return <h2 className="center">Loading...</h2>;
  }

  /* ✅ NO QUESTIONS */
  if (!questions.length) {
    return <h2 className="center">No questions available 😕</h2>;
  }

  /* ✅ END */
  if (current >= questions.length) {
    return (
      <div className="submit-screen">
        <h2>🎯 Ready to Submit?</h2>
        <p>You completed {questions.length} questions</p>

        <button className="submit-btn" onClick={handleSubmit}>
          🚀 Submit Quiz
        </button>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="quiz-page">
      <div className="quiz-header">
        <h1>🚀 {category} ({mode})</h1>

        <div className="progress-container">
          <span>{current + 1} / {questions.length}</span>
          <div className="progress">
            <div
              className="progress-bar"
              style={{
                width: `${((current + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {mode !== "practice" && <div className="timer">{time}s</div>}
      </div>

      <div className={`quiz-card ${showAnswer ? "flip" : ""}`}>
        <div className="card-inner">
          <div className="card-front">
            <h2>{q.question}</h2>

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
          </div>

          <div className="card-back">
            <h3>Correct Answer</h3>
            <p>{q.answer}</p>
          </div>
        </div>
      </div>

      <div className="quiz-footer">
        Question {current + 1} of {questions.length}
      </div>
    </div>
  );
}