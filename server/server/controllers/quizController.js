import Question from '../models/Question.js';

export const getQuestions = async (req, res) => {
  try {
    const { category, difficulty } = req.query;

    console.log("Query:", category, difficulty);

    const questions = await Question.find({
      category: new RegExp(`^${category}$`, "i"),
      difficulty: new RegExp(`^${difficulty}$`, "i"),
    }).select("_id question options"); // ❗ don't send answer to frontend

    if (!questions.length) {
      return res.status(200).json({
        success: false,
        message: "No questions found",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      data: questions,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


export const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({ error: 'Answers must be an array' });
    }

    // answers format:
    // [{ questionId, selectedOption }]

    let score = 0;

    for (const ans of answers) {
      const question = await Question.findById(ans.questionId);

      if (question && ans.selectedOption === question.answer) {
        score++;
      }
    }

    const result = score >= Math.ceil(answers.length / 2) ? 'Pass' : 'Fail';

    res.status(200).json({
      success: true,
      score,
      total: answers.length,
      result,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


export const getLeaderboard = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: [],
      message: 'Leaderboard not implemented yet',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};