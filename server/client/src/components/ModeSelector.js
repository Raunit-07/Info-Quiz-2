import React from "react";

const ModeSelector = ({ onSelect }) => {
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h3>Select Quiz Mode</h3>

      <button onClick={() => onSelect("easy")}>Easy</button>
      <button onClick={() => onSelect("medium")}>Medium</button>
      <button onClick={() => onSelect("hard")}>Hard</button>
    </div>
  );
};

export default ModeSelector;