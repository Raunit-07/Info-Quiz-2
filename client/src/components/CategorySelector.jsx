import React from "react";

const CategorySelector = ({ selectedCategory, setSelectedCategory }) => {
  const categories = ["Science", "Math", "History", "Tech"];

  return (
    <div style={{ marginBottom: "25px" }}>
      <h3 style={{ marginBottom: "10px" }}>Select Category</h3>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "12px 18px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              background:
                selectedCategory === cat
                  ? "linear-gradient(135deg,#ec4899,#f43f5e)"
                  : "rgba(255,255,255,0.1)",
              color: "#fff",
              fontWeight: "600",
              transition: "0.3s",
              transform:
                selectedCategory === cat ? "scale(1.05)" : "scale(1)",
            }}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;