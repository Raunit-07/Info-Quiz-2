import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getQuestions,
  submitQuiz,
  getLeaderboard,
} from "../controllers/quizController.js";

const router = express.Router();

router.get("/questions", getQuestions);
router.post("/submit", protect, submitQuiz);
router.get("/leaderboard", getLeaderboard);

export default router;