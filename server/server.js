import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
import db from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || "secret123";

/* =========================
   ✅ CORS (FIXED)
========================= */
app.use(cors({
  origin: "*", // 🔥 allow all (fixes your issue instantly)
}));

/* =========================
   ✅ MIDDLEWARE
========================= */
app.use(express.json());

/* =========================
   ✅ QUESTIONS DATA
========================= */
const questionsData = {
  Tech: [
    {
      id: 1,
      difficulty: "medium",
      question: "Which HTML tag is used to create a hyperlink?",
      options: ["<a>", "<link>", "<href>", "<url>"],
      answer: "<a>",
    },
    {
      id: 2,
      difficulty: "medium",
      question: "Which CSS property is used to change text color?",
      options: ["font-color", "color", "text-color", "foreground"],
      answer: "color",
    },
    {
      id: 3,
      difficulty: "medium",
      question: "Which JavaScript method converts JSON to an object?",
      options: ["JSON.parse()", "JSON.stringify()", "JSON.convert()", "JSON.toObject()"],
      answer: "JSON.parse()",
    },
    {
      id: 4,
      difficulty: "medium",
      question: "Which HTML element is used for the largest heading?",
      options: ["<h6>", "<heading>", "<h1>", "<head>"],
      answer: "<h1>",
    },
    {
      id: 5,
      difficulty: "medium",
      question: "Which CSS property controls spacing between elements?",
      options: ["padding", "margin", "spacing", "border-spacing"],
      answer: "margin",
    },
    {
      id: 6,
      difficulty: "hard",
      question: "What is the time complexity of binary search?",
      options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
      answer: "O(log n)",
    },
    {
      id: 7,
      difficulty: "hard",
      question: "Which JavaScript feature allows asynchronous code execution?",
      options: ["Promises", "Loops", "Variables", "Closures"],
      answer: "Promises",
    },
    {
      id: 8,
      difficulty: "hard",
      question: "Which CSS property enables grid layout?",
      options: ["display: grid", "grid-layout", "flex", "block"],
      answer: "display: grid",
    },
    {
      id: 9,
      difficulty: "medium",
      question: "Which HTML tag is used to insert an image?",
      options: ["<image>", "<img>", "<src>", "<pic>"],
      answer: "<img>",
    },
    {
      id: 10,
      difficulty: "medium",
      question: "Which JS operator is used for strict equality?",
      options: ["==", "===", "!=", "="],
      answer: "===",
    },
    {
      id: 11,
      difficulty: "hard",
      question: "What does DOM stand for?",
      options: ["Document Object Model", "Data Object Model", "Digital Object Model", "Desktop Oriented Mode"],
      answer: "Document Object Model",
    },
    {
      id: 12,
      difficulty: "medium",
      question: "Which CSS property makes text bold?",
      options: ["font-style", "font-weight", "text-bold", "bold"],
      answer: "font-weight",
    },
    {
      id: 13,
      difficulty: "hard",
      question: "Which hook is used for side effects in React?",
      options: ["useState", "useEffect", "useRef", "useMemo"],
      answer: "useEffect",
    },
    {
      id: 14,
      difficulty: "medium",
      question: "Which JS method adds element at end of array?",
      options: ["push()", "pop()", "shift()", "unshift()"],
      answer: "push()",
    },
    {
      id: 15,
      difficulty: "hard",
      question: "What is closure in JavaScript?",
      options: [
        "Function inside function with access to outer scope",
        "Loop structure",
        "Object property",
        "Event handler",
      ],
      answer: "Function inside function with access to outer scope",
    },
  ],

  Sports: [
    {
      id: 1,
      difficulty: "medium",
      question: "How many players are in a football team?",
      options: ["9", "10", "11", "12"],
      answer: "11",
    },
    {
      id: 2,
      difficulty: "medium",
      question: "Which country won the 2011 Cricket World Cup?",
      options: ["India", "Australia", "England", "Pakistan"],
      answer: "India",
    },
    {
      id: 3,
      difficulty: "hard",
      question: "Who holds the record for most goals in football history?",
      options: ["Messi", "Ronaldo", "Pele", "Maradona"],
      answer: "Ronaldo",
    },
    {
      id: 4,
      difficulty: "medium",
      question: "In which sport is the term 'love' used?",
      options: ["Cricket", "Football", "Tennis", "Hockey"],
      answer: "Tennis",
    },
    {
      id: 5,
      difficulty: "hard",
      question: "Which country has won the most Olympic gold medals?",
      options: ["USA", "China", "Russia", "UK"],
      answer: "USA",
    },
    {
      id: 6,
      difficulty: "medium",
      question: "How many players in a basketball team?",
      options: ["5", "6", "7", "8"],
      answer: "5",
    },
    {
      id: 7,
      difficulty: "hard",
      question: "Who is known as the 'God of Cricket'?",
      options: ["Kohli", "Dhoni", "Sachin Tendulkar", "Ponting"],
      answer: "Sachin Tendulkar",
    },
    {
      id: 8,
      difficulty: "medium",
      question: "Which sport uses a shuttlecock?",
      options: ["Tennis", "Badminton", "Squash", "Table Tennis"],
      answer: "Badminton",
    },
    {
      id: 9,
      difficulty: "medium",
      question: "Which country invented cricket?",
      options: ["India", "England", "Australia", "South Africa"],
      answer: "England",
    },
    {
      id: 10,
      difficulty: "hard",
      question: "Which player has most FIFA Ballon d'Or awards?",
      options: ["Messi", "Ronaldo", "Neymar", "Mbappe"],
      answer: "Messi",
    },
    {
      id: 11,
      difficulty: "medium",
      question: "Which sport is played at Wimbledon?",
      options: ["Cricket", "Tennis", "Football", "Hockey"],
      answer: "Tennis",
    },
    {
      id: 12,
      difficulty: "hard",
      question: "What is the length of a marathon?",
      options: ["40 km", "42.195 km", "45 km", "50 km"],
      answer: "42.195 km",
    },
    {
      id: 13,
      difficulty: "medium",
      question: "How many rings are in the Olympic symbol?",
      options: ["4", "5", "6", "7"],
      answer: "5",
    },
    {
      id: 14,
      difficulty: "hard",
      question: "Who has the fastest 100m record?",
      options: ["Bolt", "Gatlin", "Blake", "Powell"],
      answer: "Bolt",
    },
    {
      id: 15,
      difficulty: "medium",
      question: "Which country hosts IPL?",
      options: ["India", "Australia", "England", "USA"],
      answer: "India",
    },
  ],

  Coding: [
    {
      id: 1,
      difficulty: "medium",
      question: "Which language is used for web apps?",
      options: ["Python", "JavaScript", "C++", "Java"],
      answer: "JavaScript",
    },
    {
      id: 2,
      difficulty: "hard",
      question: "What is Big-O notation used for?",
      options: ["Memory", "Time complexity", "UI design", "Syntax"],
      answer: "Time complexity",
    },
    {
      id: 3,
      difficulty: "medium",
      question: "Which data structure uses FIFO?",
      options: ["Stack", "Queue", "Tree", "Graph"],
      answer: "Queue",
    },
    {
      id: 4,
      difficulty: "hard",
      question: "Which sorting is fastest on average?",
      options: ["Bubble", "Selection", "QuickSort", "Insertion"],
      answer: "QuickSort",
    },
    {
      id: 5,
      difficulty: "medium",
      question: "Which keyword defines function in JS?",
      options: ["def", "func", "function", "method"],
      answer: "function",
    },
    {
      id: 6,
      difficulty: "hard",
      question: "What is recursion?",
      options: [
        "Function calling itself",
        "Looping structure",
        "Variable",
        "Condition",
      ],
      answer: "Function calling itself",
    },
    {
      id: 7,
      difficulty: "medium",
      question: "Which is not a programming language?",
      options: ["HTML", "Python", "Java", "C++"],
      answer: "HTML",
    },
    {
      id: 8,
      difficulty: "hard",
      question: "Which DS uses LIFO?",
      options: ["Queue", "Stack", "Tree", "Graph"],
      answer: "Stack",
    },
    {
      id: 9,
      difficulty: "medium",
      question: "Which company created Java?",
      options: ["Microsoft", "Sun Microsystems", "Google", "IBM"],
      answer: "Sun Microsystems",
    },
    {
      id: 10,
      difficulty: "hard",
      question: "What is hashing?",
      options: [
        "Data mapping",
        "Sorting",
        "Searching",
        "Looping",
      ],
      answer: "Data mapping",
    },
    {
      id: 11,
      difficulty: "medium",
      question: "Which symbol is used for comments in JS?",
      options: ["//", "##", "/* */", "<!-- -->"],
      answer: "//",
    },
    {
      id: 12,
      difficulty: "hard",
      question: "Which algorithm is used in BFS?",
      options: ["Queue", "Stack", "Array", "Heap"],
      answer: "Queue",
    },
    {
      id: 13,
      difficulty: "medium",
      question: "Which keyword creates object in JS?",
      options: ["new", "create", "object", "make"],
      answer: "new",
    },
    {
      id: 14,
      difficulty: "hard",
      question: "Which DS is used in recursion?",
      options: ["Queue", "Stack", "Array", "Graph"],
      answer: "Stack",
    },
    {
      id: 15,
      difficulty: "medium",
      question: "Which language is fastest?",
      options: ["Python", "Java", "C++", "JS"],
      answer: "C++",
    },
  ],
};

/* =========================
   ✅ AUTH ROUTES
========================= */
app.post("/api/auth/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "All fields required" });
  }

  if (username.length < 3) {
    return res.status(400).json({ error: "Username too short" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password too short" });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashed],
      (err) => {
        if (err) {
          if (err.message.includes("SQLITE_CONSTRAINT")) {
            return res.status(400).json({ error: "User already exists" });
          }
          return res.status(500).json({ error: "Registration failed" });
        }

        res.status(201).json({ success: true });
      }
    );
  } catch {
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username=?",
    [username],
    async (err, rows) => {
      if (err || !rows.length) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const user = rows[0];
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({ token });
    }
  );
});

/* =========================
   ✅ TOKEN MIDDLEWARE
========================= */
function verifyToken(req, res, next) {
  const header = req.headers["authorization"];
  if (!header) return res.status(401).json({ error: "No token" });

  const token = header.split(" ")[1];

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

/* =========================
   ✅ QUIZ ROUTES (FIXED)
========================= */
app.get("/api/quiz/questions", verifyToken, (req, res) => {
  const category = req.query.category;

  if (!category || !questionsData[category]) {
    return res.status(400).json({ error: "Invalid category" });
  }

  const data = questionsData[category];

  res.json({ success: true, data });
});

app.post("/api/quiz/submit", verifyToken, (req, res) => {
  const { answers, category } = req.body;

  if (!answers || !category || !questionsData[category]) {
    return res.status(400).json({ error: "Invalid submission" });
  }

  const questions = questionsData[category];

  let score = 0;
  answers.forEach((ans, i) => {
    if (ans === questions[i]?.answer) score++;
  });

  db.query(
    "INSERT INTO scores (user_id, score) VALUES (?, ?)",
    [req.user.id, score],
    () => {
      res.json({ success: true, score });
    }
  );
});

/* =========================
   ✅ LEADERBOARD
========================= */
app.get("/api/quiz/leaderboard", (req, res) => {
  db.query(
    `SELECT users.username, scores.score
     FROM users
     JOIN scores ON users.id = scores.user_id
     ORDER BY scores.score DESC
     LIMIT 10`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Failed" });
      }
      res.json({ data: rows });
    }
  );
});

/* =========================
   ✅ HEALTH CHECK
========================= */
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

/* =========================
   ✅ PRODUCTION STATIC
========================= */
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
}

/* =========================
   ✅ START SERVER
========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on", PORT));
});