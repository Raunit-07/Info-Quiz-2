import Score from "../models/Score.js";
import questionsData from "../data/questions.js";

// @desc    Get questions by category and difficulty
// @route   GET /api/quiz/questions
// @access  Public (or Protected if preferred)
export const getQuestions = (req, res, next) => {
  try {
    let { category, difficulty } = req.query;

    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }

    // Normalize category
    category = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

    if (!questionsData[category]) {
      return res.status(400).json({ error: "Invalid category" });
    }

    let questions = questionsData[category];

    if (difficulty) {
      questions = questions.filter(
        (q) => q.difficulty.toLowerCase() === difficulty.toLowerCase()
      );
    }

    res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Submit quiz score
// @route   POST /api/quiz/submit
// @access  Private
export const submitQuiz = async (req, res, next) => {
  try {
    const { score, category, difficulty } = req.body;

    if (typeof score !== "number") {
      return res.status(400).json({ error: "Valid score is required" });
    }

    if (!category || !difficulty) {
      return res.status(400).json({ error: "Category and difficulty are required" });
    }

    // Create score entry in MongoDB
    const newScore = await Score.create({
      userId: req.user.id,
      score,
      category,
      difficulty,
    });

    res.status(201).json({
      success: true,
      data: newScore,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get leaderboard
// @route   GET /api/quiz/leaderboard
// @access  Public
export const getLeaderboard = async (req, res, next) => {
  try {
    const { category, difficulty } = req.query;
    const query = {};

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    const scores = await Score.find(query)
      .populate("userId", "username")
      .sort({ score: -1, createdAt: -1 })
      .limit(50)
      .lean();

    const formatted = scores.map((s) => ({
      username: s.userId?.username || "Unknown User",
      score: s.score,
      category: s.category,
      difficulty: s.difficulty,
      date: s.createdAt,
    }));

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (err) {
    next(err);
  }
};