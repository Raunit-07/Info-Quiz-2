const questions = [
  {
    id: 1,
    question: 'Which HTML tag is used to create a hyperlink?',
    options: ['<a>', '<link>', '<href>', '<url>'],
    answer: '<a>',
  },
  {
    id: 2,
    question: 'Which CSS property is used to change text color?',
    options: ['font-color', 'color', 'text-color', 'foreground'],
    answer: 'color',
  },
  {
    id: 3,
    question: 'Which JavaScript method converts JSON to an object?',
    options: ['JSON.parse()', 'JSON.stringify()', 'JSON.convert()', 'JSON.toObject()'],
    answer: 'JSON.parse()',
  },
  {
    id: 4,
    question: 'Which HTML element is used for the largest heading?',
    options: ['<h6>', '<heading>', '<h1>', '<head>'],
    answer: '<h1>',
  },
  {
    id: 5,
    question: 'Which CSS property controls the spacing between elements?',
    options: ['padding', 'margin', 'spacing', 'border-spacing'],
    answer: 'margin',
  },
];

export const getQuestions = (req, res) => {
  try {
    const safeQuestions = questions.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
    }));

    res.status(200).json({
      success: true,
      data: safeQuestions,
    });
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
