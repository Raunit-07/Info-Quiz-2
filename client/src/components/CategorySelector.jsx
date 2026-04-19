import React from "react";

const CategorySelector = ({ selectedCategory, setSelectedCategory }) => {
  const categories = ["Science", "Math", "History", "Tech"];

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Select Category</h3>

      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setSelectedCategory(cat)}
          style={{
            margin: "5px",
            padding: "10px 15px",
            background: selectedCategory === cat ? "#4CAF50" : "#ddd",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategorySelector;