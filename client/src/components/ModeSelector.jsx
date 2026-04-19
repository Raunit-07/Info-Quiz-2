const ModeSelector = ({ selectedMode, setSelectedMode }) => {
  const modes = ["easy", "medium", "hard"];

  return (
    <div style={{ marginBottom: "25px" }}>
      <h3 style={{ marginBottom: "10px" }}>Select Mode</h3>

      <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
        {modes.map((mode) => (
          <button
            key={mode}
            onClick={() => setSelectedMode(mode)}
            style={{
              padding: "12px 20px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              background:
                selectedMode === mode
                  ? "linear-gradient(135deg,#6366f1,#8b5cf6)"
                  : "rgba(255,255,255,0.1)",
              color: "#fff",
              fontWeight: "600",
              transition: "0.3s",
              transform:
                selectedMode === mode ? "scale(1.05)" : "scale(1)",
            }}
          >
            {mode.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
};