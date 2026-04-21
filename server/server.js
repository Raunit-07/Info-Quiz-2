import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import path from "path";

import User from "./models/User.js";
import Score from "./models/Score.js";

dotenv.config();

const app = express();

/* =========================
   ✅ MIDDLEWARE
========================= */
app.use(cors({ origin: "*" }));
app.use(express.json());

/* =========================
   ✅ MONGODB CONNECTION (ONLY ONCE)
========================= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

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
   ✅ GET QUESTIONS API (VERY IMPORTANT)
========================= */
app.get("/api/quiz/questions", (req, res) => {
  const { category, difficulty } = req.query;

  if (!category || !questionsData[category]) {
    return res.status(400).json({ error: "Invalid category" });
  }

  let questions = questionsData[category];

  if (difficulty) {
    questions = questions.filter(q => q.difficulty === difficulty);
  }

  res.json({ questions });
});

/* =========================
   ✅ AUTH ROUTES
========================= */
app.post("/api/auth/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ error: "User exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({ username, password: hashed });

    // ✅ RETURN TOKEN (IMPORTANT)
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ token });

  } catch {
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });

  } catch {
    res.status(500).json({ error: "Login failed" });
  }
});

/* =========================
   ✅ TOKEN MIDDLEWARE
========================= */
function verifyToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "No token" });

  const token = header.split(" ")[1];

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

/* =========================
   ✅ QUIZ SUBMIT
========================= */
app.post("/api/quiz/submit", verifyToken, async (req, res) => {
  const { score } = req.body;

  try {
    await Score.create({
      userId: req.user.id,
      score
    });

    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed" });
  }
});

/* =========================
   ✅ LEADERBOARD
========================= */
app.get("/api/quiz/leaderboard", async (req, res) => {
  try {
    const data = await Score.find()
      .sort({ score: -1 })
      .limit(10)
      .populate("userId", "username");

    res.json({ data });
  } catch {
    res.status(500).json({ error: "Failed" });
  }
});

/* =========================
   ✅ HEALTH CHECK
========================= */
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

/* =========================
   ✅ ROOT TEST
========================= */
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});



/* =========================
   ✅ START SERVER (LAST)
========================= */
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running on", PORT);
});

/* =========================
   ✅ SERVE FRONTEND (FIXED POSITION)
========================= */
const __dirname = new URL('.', import.meta.url).pathname;

app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});