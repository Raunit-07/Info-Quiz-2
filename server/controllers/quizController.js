import Score from "../models/Score.js";
import questionsData from "../data/questions.js";

export const getQuestions = (req, res) => {
  try {
    let { category, difficulty } = req.query;

    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }

    // Normalize category (case-insensitive matching)
    const normalizedCategory = Object.keys(questionsData).find(
      (key) => key.toLowerCase() === category.toLowerCase()
    );

    if (!normalizedCategory) {
      return res.status(400).json({ error: "Invalid category" });
    }

    let questions = questionsData[normalizedCategory];

    if (difficulty) {
      questions = questions.filter(
        (q) => q.difficulty.toLowerCase() === difficulty.toLowerCase()
      );
    }

    res.status(200).json({
      success: true,
      questions: questions,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const submitQuiz = async (req, res, next) => {
  try {
    const { score, category, difficulty } = req.body;

    if (typeof score !== "number") {
      return res.status(400).json({ error: "Invalid score" });
    }

    // Save score to database
    await Score.create({
      userId: req.user.id,
      score,
      category: category || "General",
      difficulty: difficulty || "medium",
    });

    res.status(201).json({
      success: true,
      message: "Score saved successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const getLeaderboard = async (req, res, next) => {
  try {
    const leaderboard = await Score.find()
      .sort({ score: -1 })
      .limit(10)
      .populate("userId", "username")
      .lean();

    const formatted = (leaderboard || []).map((item) => ({
      username: item.userId?.username || "Unknown",
      score: item.score,
      category: item.category,
      difficulty: item.difficulty,
      date: item.createdAt,
    }));

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (err) {
    next(err);
  }
};