import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  score: Number
});

export default mongoose.model("Score", scoreSchema);