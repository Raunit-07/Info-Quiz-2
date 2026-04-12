import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "../App.css";

export default function Quiz() {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading, logout } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [time, setTime] = useState(15);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  const timerRef = useRef(null);

  // 🔐 AUTH CHECK
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [authLoading, isAuthenticated, navigate]);

  // 📥 FETCH QUESTIONS
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get("/api/quiz/questions");
console.log("API RESPONSE:", res.data);  

        if (Array.isArray(res.data.data)) {
          setQuestions(res.data.data);
        } else {
          console.error("Invalid response:", res.data);
          setQuestions([]);
        }
        const saved = JSON.parse(localStorage.getItem("quiz-progress"));
        if (saved) {
          setCurrent(saved.current);
          setAnswers(saved.answers);
        }
      } catch (err) {
        console.error("Error fetching questions:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) fetchQuestions();
  }, [isAuthenticated, logout]);

  // ➡️ NEXT QUESTION
  const handleNext = useCallback(() => {
    setSelected(null);
    setShowAnswer(false);
    setTime(15);
    setCurrent((prev) => prev + 1);
  }, []);

  // ⏱ TIMER
  useEffect(() => {
    clearInterval(timerRef.current);

    if (result || questions.length === 0) return;

    timerRef.current = setInterval(() => {
      setTime((prev) => {
        if (prev === 1) {
          handleNext();
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [current, result, questions.length, handleNext]);

  // STOP TIMER AFTER RESULT
  useEffect(() => {
    if (result) clearInterval(timerRef.current);
  }, [result]);

  // 💾 SAVE PROGRESS
  useEffect(() => {
    localStorage.setItem(
      "quiz-progress",
      JSON.stringify({ current, answers })
    );
  }, [current, answers]);

  // 🎯 HANDLE ANSWER
const handleOptionClick = (opt) => {
  if (showAnswer) return; 

    setSelected(opt);
    setShowAnswer(true);

    const newAnswers = [...answers];
    newAnswers[current] = opt;
    setAnswers(newAnswers);

    setTimeout(() => {
  handleNext();
    }, 3500); // 3-4 sec pause
  };

  // 📤 SUBMIT QUIZ
  const handleSubmit = async () => {
    try {
      const res = await api.post("/api/quiz/submit", { answers });
      localStorage.removeItem("quiz-progress");
      // Redirect to leaderboard after quiz completion
      navigate("/leaderboard");
    } catch (err) {
      console.error("Submit error:", err);
      logout();
    }
  };

  // ⏳ LOADING
  if (authLoading || loading) {
    return <h2 className="center">Loading...</h2>;
  }

  // 📝 SUBMIT SCREEN
  if (current >= questions.length) {
    return (
      <div className="quiz-page">
        <Navbar />
        <div className="submit-screen">
          <h2>🎯 Ready to Submit?</h2>
          <p style={{ color: '#666', marginBottom: '30px' }}>
            You've completed all {questions.length} questions!
          </p>
          <button className="submit-btn" onClick={handleSubmit}>
            🚀 Submit Quiz
          </button>
          <button
            className="submit-btn"
            onClick={logout}
            style={{
              background: 'linear-gradient(135deg, #f87171, #ef4444)',
              marginTop: '15px'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  const q =
  Array.isArray(questions) && questions[current]
    ? questions[current]
    : { question: "No question available", options: [] };

  // 🎨 MAIN UI
 return (
  <div className="quiz-page">
    <Navbar />

    {/* Header Section */}
    <div className="quiz-header">
      <h1 className="quiz-title">🚀 Quiz Challenge</h1>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-label">
          <span>Progress</span>
          <span>{current + 1} / {questions.length}</span>
        </div>
        <div className="progress">
          <div
            className="progress-bar"
            style={{
              width: questions.length ? `${((current + 1) / questions.length) * 100}%` : "0%"
            }}
          ></div>
        </div>
      </div>

      {/* Timer */}
      <div className="timer-container">
        <div className="timer">{time}s</div>
      </div>
    </div>

    {/* Quiz Card */}
    <div className={`quiz-card ${showAnswer ? "flip" : ""}`}>
      <div className="card-inner">
        {/* FRONT */}
        <div className="card-front">
          <div className="question-box">
          <h2 className="question">{q.question}</h2>
        </div>

          <div className="options">
            {q.options.map((opt, index) => {
              const correct = q.answer;
              let statusClass = "";

              if (showAnswer) {
                if (opt === correct) statusClass = "correct";
                else if (opt === selected && selected !== correct) statusClass = "wrong";
              }

              return (
                <button
                  key={index}
                  className={`option-btn ${statusClass}`}
                  onClick={() => handleOptionClick(opt)}
                  disabled={showAnswer}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* BACK */}
        <div className="card-back">
          <h2>Answer</h2>
          <p className="correct-answer">{q.answer}</p>
        </div>
      </div>
    </div>

    {/* Footer */}
    <div className="quiz-footer">
      Question {current + 1} of {questions.length}
    </div>
  </div>
 );
}