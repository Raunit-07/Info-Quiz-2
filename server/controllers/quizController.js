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
    const { answers = [], category, difficulty } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({ error: "Answers must be array" });
    }

    let score = 0;

    for (const ans of answers) {
      const question = await Question.findById(ans.questionId);

      if (question && ans.selectedOption === question.answer) {
        score++;
      }
    }

    // ✅ SAVE (only if auth exists)
    if (req.user?.id) {
      await Score.create({
        userId: req.user.id,
        score,
        category,
        difficulty,
      });
    }

    res.status(200).json({
      success: true,
      score,
      total: answers.length,
    });

  } catch (err) {
    console.error("❌ Submit Error:", err);
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
