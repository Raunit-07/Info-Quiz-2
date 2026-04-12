import express from 'express';
import { getQuestions, submitQuiz, getLeaderboard } from '../controllers/quizController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/questions', protect, getQuestions);
router.post('/submit', protect, submitQuiz);
router.get('/leaderboard', getLeaderboard);

export default router;
