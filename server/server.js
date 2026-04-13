import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../client/build'));
}


app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'All fields required' });
  }

  if (username.length < 3) {
    return res.status(400).json({ success: false, error: 'Username must be at least 3 characters' });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);

    db.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashed],
      (err) => {
        if (err) {
          if (err.message.includes('SQLITE_CONSTRAINT')) {
            return res.status(400).json({ success: false, error: 'Username already exists' });
          }
          return res.status(500).json({ success: false, error: 'Registration failed' });
        }

        res.status(201).json({ success: true, message: 'User registered successfully' });
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'All fields required' });
  }

  db.query('SELECT * FROM users WHERE username=?', [username], async (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Login failed' });
    }

    if (!rows || rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const user = rows[0];

    try {
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ success: true, token, user: { id: user.id, username: user.username } });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Login failed' });
    }
  });
});


function verifyToken(req, res, next) {
  const header = req.headers['authorization'];

  if (!header) return res.status(401).json({ error: 'No token' });

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}


const QUESTIONS = [
  {
    question: "What does HTML stand for?",
    options: ["Hyper Text Markup Language", "High Tech Language", "Home Tool Markup", "Hyperlinks"],
    answer: "Hyper Text Markup Language",
  },
  {
    question: "Which tag is used for links?",
    options: ["<a>", "<link>", "<href>", "<p>"],
    answer: "<a>",
  },
  {
    question: "CSS stands for?",
    options: ["Cascading Style Sheets", "Computer Style Sheet", "Creative Style", "Color Style"],
    answer: "Cascading Style Sheets",
  },
  {
    question: "Which CSS property changes text color?",
    options: ["color", "font", "background", "text-style"],
    answer: "color",
  },
  {
    question: "Which is JavaScript variable keyword?",
    options: ["var", "int", "string", "define"],
    answer: "var",
  },
  {
    question: "Which method prints in console?",
    options: ["console.log()", "print()", "echo()", "log()"],
    answer: "console.log()",
  },
  {
    question: "Which HTML tag for heading?",
    options: ["<h1>", "<p>", "<div>", "<span>"],
    answer: "<h1>",
  },
  {
    question: "Which CSS layout is flexible?",
    options: ["flexbox", "block", "inline", "static"],
    answer: "flexbox",
  },
  {
    question: "JS is used for?",
    options: ["Logic", "Styling", "Structure", "Database"],
    answer: "Logic",
  },
  {
    question: "Which tag for image?",
    options: ["<img>", "<image>", "<pic>", "<src>"],
    answer: "<img>",
  },
  {
    question: "Which property for background color?",
    options: ["background-color", "color", "bg", "background"],
    answer: "background-color",
  },
  {
    question: "Which operator is equality?",
    options: ["==", "=", "!=", "<>"],
    answer: "==",
  },
  {
    question: "Which symbol for id in CSS?",
    options: ["#", ".", "*", "&"],
    answer: "#",
  },
  {
    question: "Which JS function delays execution?",
    options: ["setTimeout", "delay()", "wait()", "sleep()"],
    answer: "setTimeout",
  },
  {
    question: "Which tag for paragraph?",
    options: ["<p>", "<h1>", "<div>", "<span>"],
    answer: "<p>",
  },
];

app.get('/api/quiz/questions', verifyToken, (req, res) => {
  const safe = QUESTIONS.map((q, idx) => ({
    id: idx + 1,
    question: q.question,
    options: q.options,
    answer: q.answer
  }));

  res.json({ success: true, data: safe });
});

app.post('/api/quiz/submit', verifyToken, (req, res) => {
  const { answers } = req.body;

  if (!Array.isArray(answers)) {
    return res.status(400).json({ success: false, error: 'Invalid submission' });
  }

  let score = 0;
  answers.forEach((ans, i) => {
    if (ans === QUESTIONS[i]?.answer) score++;
  });

  const totalQuestions = QUESTIONS.length;
  const percentage = Math.round((score / totalQuestions) * 100);

  db.query('SELECT * FROM scores WHERE user_id=?', [req.user.id], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Failed to submit' });
    }

    if (rows && rows.length > 0) {
      if (score > rows[0].score) {
        db.query('UPDATE scores SET score=? WHERE user_id=?', [score, req.user.id], () => {
          res.json({ success: true, score, total: totalQuestions, percentage });
        });
      } else {
        res.json({ success: true, score, total: totalQuestions, percentage });
      }
    } else {
      db.query('INSERT INTO scores (user_id, score) VALUES (?, ?)', [req.user.id, score], () => {
        res.json({ success: true, score, total: totalQuestions, percentage });
      });
    }
  });
});

app.get('/api/quiz/leaderboard', (req, res) => {
  db.query(
    `SELECT users.username, scores.score
     FROM users
     JOIN scores ON users.id = scores.user_id
     ORDER BY scores.score DESC
     LIMIT 10`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ success: false, error: 'Failed to fetch leaderboard' });
      }
      res.json({ success: true, data: rows || [] });
    }
  );
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', time: new Date().toISOString() });
});

// Serve React app for all non-API routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on", PORT);
});