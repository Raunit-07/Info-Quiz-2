import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  score: Number,

  // ✅ ADD THESE
  category: String,
  difficulty: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Score", scoreSchema);