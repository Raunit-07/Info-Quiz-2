import { useState, useEffect } from "react";
import ModeSelector from "../components/ModeSelector";
import CategorySelector from "../components/CategorySelector";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const [mode, setMode] = useState(() => {
    return localStorage.getItem("quiz-mode") || null;
  });

  const [category, setCategory] = useState(() => {
    return localStorage.getItem("quiz-category") || null;
  });

  // ✅ Persist selections
  useEffect(() => {
    if (mode) localStorage.setItem("quiz-mode", mode);
  }, [mode]);

  useEffect(() => {
    if (category) localStorage.setItem("quiz-category", category);
  }, [category]);

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
    <div className="px-6 max-w-4xl mx-auto">
      <div className="pt-24">

        {/* Welcome */}
        <h1 className="text-3xl font-bold">Welcome back 👋</h1>
        <p className="opacity-70 mb-6">
          Ready to challenge your mind?
        </p>

        {/* Mode Selection */}
        <ModeSelector
          selectedMode={mode}
          setSelectedMode={setMode}
        />

        {/* Category Selection */}
        <CategorySelector
          selectedCategory={category}
          setSelectedCategory={setCategory}
        />

        {/* CTA */}
        <div className="mt-10 text-center">
          <button
            onClick={startQuiz}
            disabled={!mode || !category}
            className={`px-10 py-4 text-lg font-bold rounded-full transition-all duration-300
              ${
                mode && category
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-110 shadow-lg"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            🚀 Start Quiz
          </button>
        </div>

      </div>
    </div>
  );
}