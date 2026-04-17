import Question from '../models/Question.js';

export const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({}, 'id question options');
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(answers)) {
      return res.status(400).json({ error: 'Answers must be an array' });
    }

    let score = 0;

    answers.forEach((answer, index) => {
      if (questions[index] && answer === questions[index].answer) {
        score++;
      }
    });

    const result = score >= 3 ? 'Pass' : 'Fail';

    // Mock response - no database
    res.status(201).json({
      success: true,
      score,
      result,
      message: `You scored ${score}/${questions.length}. Results not saved (no database).`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    // Mock leaderboard - no database
    res.status(200).json({
      success: true,
      data: [],
      message: 'Leaderboard not available (no database)',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
