import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getQuestions,
  submitQuiz,
  getLeaderboard,
} from "../controllers/quizController.js";

const router = express.Router(); // ✅ MUST BE FIRST

router.get("/questions", protect, getQuestions);
router.post("/submit", protect, submitQuiz);
router.get("/leaderboard", getLeaderboard); // ✅ IMPORTANT

export default router;