import express from 'express';
import { getQuestions } from '../controllers/quizController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/questions', protect, getQuestions);

export default router;
