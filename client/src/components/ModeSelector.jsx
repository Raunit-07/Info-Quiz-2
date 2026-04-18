import React from "react";

const ModeSelector = ({ selectedMode, setSelectedMode }) => {
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h3>Select Quiz Mode</h3>

      <button onClick={() => setSelectedMode("easy")}>
        Easy
      </button>

      <button onClick={() => setSelectedMode("medium")}>
        Medium
      </button>

      <button onClick={() => setSelectedMode("hard")}>
        Hard
      </button>
    </div>
  );
};

export default ModeSelector;