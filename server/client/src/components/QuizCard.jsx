export default function QuizCard({ questionData, onAnswer }) {
  return (
    <div className="quiz-card">
      <h2>{questionData.question}</h2>

      <div className="options">
        {questionData.options.map((opt, index) => (
          <button key={index} onClick={() => onAnswer(opt)}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}