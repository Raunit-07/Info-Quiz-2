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

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        error: "Answers must be a valid array",
      });
    }

    let score = 0;

    for (const ans of answers) {
      if (!ans.questionId) continue;

      const question = await Question.findById(ans.questionId);

      if (question && ans.selectedOption === question.answer) {
        score++;
      }
    }

    res.status(200).json({
      success: true,
      score,
      total: answers.length,
    });

  } catch (err) {
    console.error("Submit error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const sql = `
      SELECT users.username, scores.score
      FROM scores
      JOIN users ON users.id = scores.user_id
      ORDER BY scores.score DESC
      LIMIT 50
    `;

    db.query(sql, [], (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
      }

      res.status(200).json({
        success: true,
        data: rows,
      });
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};