import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // ✅ MUST MATCH MODEL NAME
  },
  score: Number,
});

export default mongoose.model("Score", scoreSchema);