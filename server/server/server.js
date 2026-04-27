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
   ✅ MONGODB CONNECTION
========================= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

/* =========================
   ✅ QUESTIONS DATA
========================= */
const questionsData = {
  // ======================= TECH =======================
  Tech: [
    // EASY (1–10)
    { id: 1, difficulty: "easy", question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Text Machine Language", "Hyper Tool Multi Language", "None"], answer: "Hyper Text Markup Language" },
    { id: 2, difficulty: "easy", question: "Which tag is used for paragraph?", options: ["<p>", "<para>", "<text>", "<h1>"], answer: "<p>" },
    { id: 3, difficulty: "easy", question: "Which language runs in browser?", options: ["Python", "Java", "JavaScript", "C++"], answer: "JavaScript" },
    { id: 4, difficulty: "easy", question: "Which CSS property changes background color?", options: ["bgcolor", "background-color", "color", "background"], answer: "background-color" },
    { id: 5, difficulty: "easy", question: "Which tag is for image?", options: ["<img>", "<image>", "<pic>", "<src>"], answer: "<img>" },
    { id: 6, difficulty: "easy", question: "Which tag creates a button?", options: ["<btn>", "<button>", "<click>", "<input>"], answer: "<button>" },
    { id: 7, difficulty: "easy", question: "Which is used for styling?", options: ["HTML", "CSS", "JS", "Python"], answer: "CSS" },
    { id: 8, difficulty: "easy", question: "Which symbol is used for comments in JS?", options: ["//", "##", "<!-- -->", "**"], answer: "//" },
    { id: 9, difficulty: "easy", question: "Which tag is used for link?", options: ["<a>", "<link>", "<href>", "<url>"], answer: "<a>" },
    { id: 10, difficulty: "easy", question: "Which CSS property controls text size?", options: ["font-size", "text-size", "size", "font"], answer: "font-size" },

    // MEDIUM (11–20)
    { id: 11, difficulty: "medium", question: "Which JS method converts JSON to object?", options: ["JSON.parse()", "JSON.stringify()", "JSON.convert()", "JSON.toObject()"], answer: "JSON.parse()" },
    { id: 12, difficulty: "medium", question: "Which CSS property makes text bold?", options: ["font-weight", "bold", "text-bold", "font-style"], answer: "font-weight" },
    { id: 13, difficulty: "medium", question: "Which operator is strict equality?", options: ["==", "===", "!=", "="], answer: "===" },
    { id: 14, difficulty: "medium", question: "Which method adds element at end of array?", options: ["push()", "pop()", "shift()", "unshift()"], answer: "push()" },
    { id: 15, difficulty: "medium", question: "Which tag is largest heading?", options: ["<h1>", "<h6>", "<head>", "<heading>"], answer: "<h1>" },
    { id: 16, difficulty: "medium", question: "Which property changes text color?", options: ["color", "text-color", "font-color", "foreground"], answer: "color" },
    { id: 17, difficulty: "medium", question: "Which CSS property controls spacing?", options: ["margin", "padding", "gap", "spacing"], answer: "margin" },
    { id: 18, difficulty: "medium", question: "Which tag is for input field?", options: ["<input>", "<form>", "<field>", "<textbox>"], answer: "<input>" },
    { id: 19, difficulty: "medium", question: "Which attribute defines link destination?", options: ["href", "src", "link", "target"], answer: "href" },
    { id: 20, difficulty: "medium", question: "Which layout uses flexbox?", options: ["display:flex", "display:grid", "flexbox:true", "layout:flex"], answer: "display:flex" },

    // HARD (21–30)
    { id: 21, difficulty: "hard", question: "Time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], answer: "O(log n)" },
    { id: 22, difficulty: "hard", question: "What is closure in JS?", options: ["Function inside function with outer scope access", "Loop", "Object", "Event"], answer: "Function inside function with outer scope access" },
    { id: 23, difficulty: "hard", question: "Which hook handles side effects?", options: ["useState", "useEffect", "useMemo", "useRef"], answer: "useEffect" },
    { id: 24, difficulty: "hard", question: "What does DOM stand for?", options: ["Document Object Model", "Data Object Model", "Digital Object Model", "None"], answer: "Document Object Model" },
    { id: 25, difficulty: "hard", question: "Which CSS property enables grid?", options: ["display:grid", "grid:true", "layout:grid", "grid-enable"], answer: "display:grid" },
    { id: 26, difficulty: "hard", question: "Which JS feature handles async code?", options: ["Promises", "Loops", "Closures", "Events"], answer: "Promises" },
    { id: 27, difficulty: "hard", question: "Which protocol is used for web?", options: ["HTTP", "FTP", "SMTP", "TCP"], answer: "HTTP" },
    { id: 28, difficulty: "hard", question: "Which tag is used for metadata?", options: ["<meta>", "<head>", "<data>", "<info>"], answer: "<meta>" },
    { id: 29, difficulty: "hard", question: "Which CSS unit is relative?", options: ["px", "em", "cm", "mm"], answer: "em" },
    { id: 30, difficulty: "hard", question: "Which method converts object to JSON?", options: ["JSON.stringify()", "JSON.parse()", "JSON.convert()", "JSON.make()"], answer: "JSON.stringify()" },
  ],

  // ======================= SPORTS =======================
  Sports: [
    // EASY
    { id: 1, difficulty: "easy", question: "How many players in football team?", options: ["9", "10", "11", "12"], answer: "11" },
    { id: 2, difficulty: "easy", question: "Which sport uses bat and ball?", options: ["Cricket", "Football", "Tennis", "Hockey"], answer: "Cricket" },
    { id: 3, difficulty: "easy", question: "Which sport uses racket?", options: ["Tennis", "Football", "Cricket", "Hockey"], answer: "Tennis" },
    { id: 4, difficulty: "easy", question: "Which country hosts IPL?", options: ["India", "USA", "UK", "Australia"], answer: "India" },
    { id: 5, difficulty: "easy", question: "Olympics held every?", options: ["2 years", "3 years", "4 years", "5 years"], answer: "4 years" },
    { id: 6, difficulty: "easy", question: "Which sport uses shuttlecock?", options: ["Badminton", "Tennis", "Squash", "Table Tennis"], answer: "Badminton" },
    { id: 7, difficulty: "easy", question: "How many rings in Olympics?", options: ["5", "6", "4", "7"], answer: "5" },
    { id: 8, difficulty: "easy", question: "Which sport is played at Wimbledon?", options: ["Tennis", "Cricket", "Football", "Hockey"], answer: "Tennis" },
    { id: 9, difficulty: "easy", question: "Which country invented cricket?", options: ["England", "India", "Australia", "USA"], answer: "England" },
    { id: 10, difficulty: "easy", question: "How many players in basketball?", options: ["5", "6", "7", "8"], answer: "5" },

    // MEDIUM
    { id: 11, difficulty: "medium", question: "Who won 2011 Cricket World Cup?", options: ["India", "Australia", "England", "Pakistan"], answer: "India" },
    { id: 12, difficulty: "medium", question: "What is marathon length?", options: ["42.195 km", "40 km", "45 km", "50 km"], answer: "42.195 km" },
    { id: 13, difficulty: "medium", question: "Who is God of Cricket?", options: ["Sachin Tendulkar", "Kohli", "Dhoni", "Ponting"], answer: "Sachin Tendulkar" },
    { id: 14, difficulty: "medium", question: "Which sport uses 'love'?", options: ["Tennis", "Football", "Cricket", "Hockey"], answer: "Tennis" },
    { id: 15, difficulty: "medium", question: "Which country has most Olympic gold?", options: ["USA", "China", "UK", "Russia"], answer: "USA" },
    { id: 16, difficulty: "medium", question: "Fastest 100m runner?", options: ["Usain Bolt", "Blake", "Gatlin", "Powell"], answer: "Usain Bolt" },
    { id: 17, difficulty: "medium", question: "Which sport uses net and hoop?", options: ["Basketball", "Football", "Tennis", "Cricket"], answer: "Basketball" },
    { id: 18, difficulty: "medium", question: "Ballon d'Or is for?", options: ["Football", "Cricket", "Tennis", "Hockey"], answer: "Football" },
    { id: 19, difficulty: "medium", question: "Which country won FIFA 2018?", options: ["France", "Germany", "Brazil", "Argentina"], answer: "France" },
    { id: 20, difficulty: "medium", question: "IPL started in?", options: ["2008", "2010", "2005", "2012"], answer: "2008" },

    // HARD
    { id: 21, difficulty: "hard", question: "Most goals in football history?", options: ["Ronaldo", "Messi", "Pele", "Maradona"], answer: "Ronaldo" },
    { id: 22, difficulty: "hard", question: "Most Ballon d'Or?", options: ["Messi", "Ronaldo", "Neymar", "Mbappe"], answer: "Messi" },
    { id: 23, difficulty: "hard", question: "First Olympic games modern year?", options: ["1896", "1900", "1880", "1912"], answer: "1896" },
    { id: 24, difficulty: "hard", question: "Cricket pitch length?", options: ["22 yards", "20 yards", "25 yards", "18 yards"], answer: "22 yards" },
    { id: 25, difficulty: "hard", question: "Most IPL titles team?", options: ["Mumbai Indians", "CSK", "RCB", "KKR"], answer: "Mumbai Indians" },
    { id: 26, difficulty: "hard", question: "Which country hosts Wimbledon?", options: ["UK", "USA", "France", "Australia"], answer: "UK" },
    { id: 27, difficulty: "hard", question: "First Cricket World Cup winner?", options: ["West Indies", "India", "Australia", "England"], answer: "West Indies" },
    { id: 28, difficulty: "hard", question: "Tennis Grand Slams count?", options: ["4", "3", "5", "6"], answer: "4" },
    { id: 29, difficulty: "hard", question: "Olympics symbol colors count?", options: ["5", "6", "7", "4"], answer: "5" },
    { id: 30, difficulty: "hard", question: "Which sport uses pommel horse?", options: ["Gymnastics", "Athletics", "Wrestling", "Boxing"], answer: "Gymnastics" },
  ],

  // ======================= CODING =======================
  Coding: [
    // EASY
    { id: 1, difficulty: "easy", question: "Which language is for web apps?", options: ["JavaScript", "C++", "Java", "Python"], answer: "JavaScript" },
    { id: 2, difficulty: "easy", question: "FIFO structure?", options: ["Queue", "Stack", "Tree", "Graph"], answer: "Queue" },
    { id: 3, difficulty: "easy", question: "LIFO structure?", options: ["Stack", "Queue", "Array", "Graph"], answer: "Stack" },
    { id: 4, difficulty: "easy", question: "Keyword for function?", options: ["function", "def", "func", "method"], answer: "function" },
    { id: 5, difficulty: "easy", question: "Which is not language?", options: ["HTML", "Python", "Java", "C++"], answer: "HTML" },
    { id: 6, difficulty: "easy", question: "Which company made Java?", options: ["Sun Microsystems", "Google", "Microsoft", "IBM"], answer: "Sun Microsystems" },
    { id: 7, difficulty: "easy", question: "Used for comments?", options: ["//", "##", "<!-- -->", "**"], answer: "//" },
    { id: 8, difficulty: "easy", question: "Which is fastest?", options: ["C++", "Python", "Java", "JS"], answer: "C++" },
    { id: 9, difficulty: "easy", question: "Loop repeats?", options: ["Code", "Variable", "Function", "Array"], answer: "Code" },
    { id: 10, difficulty: "easy", question: "Variable stores?", options: ["Data", "Code", "Loop", "Function"], answer: "Data" },

    // MEDIUM
    { id: 11, difficulty: "medium", question: "Big-O used for?", options: ["Time complexity", "UI", "Syntax", "Memory"], answer: "Time complexity" },
    { id: 12, difficulty: "medium", question: "Which sorting fastest avg?", options: ["QuickSort", "Bubble", "Insertion", "Selection"], answer: "QuickSort" },
    { id: 13, difficulty: "medium", question: "Recursion means?", options: ["Function calling itself", "Loop", "Condition", "Variable"], answer: "Function calling itself" },
    { id: 14, difficulty: "medium", question: "BFS uses?", options: ["Queue", "Stack", "Array", "Heap"], answer: "Queue" },
    { id: 15, difficulty: "medium", question: "DFS uses?", options: ["Stack", "Queue", "Heap", "Graph"], answer: "Stack" },
    { id: 16, difficulty: "medium", question: "Hashing means?", options: ["Data mapping", "Sorting", "Searching", "Loop"], answer: "Data mapping" },
    { id: 17, difficulty: "medium", question: "Binary tree max children?", options: ["2", "3", "4", "1"], answer: "2" },
    { id: 18, difficulty: "medium", question: "Array index starts?", options: ["0", "1", "-1", "2"], answer: "0" },
    { id: 19, difficulty: "medium", question: "Compiler does?", options: ["Translate code", "Run code", "Store data", "Debug"], answer: "Translate code" },
    { id: 20, difficulty: "medium", question: "Stack overflow happens when?", options: ["Memory full", "Loop", "Compile", "Syntax"], answer: "Memory full" },

    // HARD
    { id: 21, difficulty: "hard", question: "Worst case QuickSort?", options: ["O(n²)", "O(n log n)", "O(n)", "O(1)"], answer: "O(n²)" },
    { id: 22, difficulty: "hard", question: "Merge sort complexity?", options: ["O(n log n)", "O(n²)", "O(log n)", "O(n)"], answer: "O(n log n)" },
    { id: 23, difficulty: "hard", question: "Heap used in?", options: ["Priority Queue", "Stack", "Array", "Graph"], answer: "Priority Queue" },
    { id: 24, difficulty: "hard", question: "Which DS for recursion?", options: ["Stack", "Queue", "Tree", "Graph"], answer: "Stack" },
    { id: 25, difficulty: "hard", question: "Binary search requires?", options: ["Sorted array", "Unsorted", "Tree", "Graph"], answer: "Sorted array" },
    { id: 26, difficulty: "hard", question: "Space complexity means?", options: ["Memory usage", "Time", "Speed", "Syntax"], answer: "Memory usage" },
    { id: 27, difficulty: "hard", question: "Linked list stores?", options: ["Nodes", "Arrays", "Graphs", "Stacks"], answer: "Nodes" },
    { id: 28, difficulty: "hard", question: "Graph edge connects?", options: ["Vertices", "Arrays", "Stacks", "Queues"], answer: "Vertices" },
    { id: 29, difficulty: "hard", question: "Dynamic programming is?", options: ["Optimization technique", "Loop", "DS", "Language"], answer: "Optimization technique" },
    { id: 30, difficulty: "hard", question: "Greedy algorithm does?", options: ["Local optimal choice", "Global brute force", "Random", "Loop"], answer: "Local optimal choice" },
  ],
};

/* =========================
   ✅ GET QUESTIONS API (FIXED)
========================= */
app.get("/api/quiz/questions", (req, res) => {
  const { category, difficulty } = req.query;

  // 🔥 ADD HERE
  console.log("CATEGORY:", category);
  console.log("DIFFICULTY:", difficulty);
  console.log("AVAILABLE:", Object.keys(questionsData));

  if (!category || !questionsData[category]) {
    return res.status(400).json({ error: "Invalid category" });
  }

  let questions = questionsData[category];

  if (difficulty) {
    questions = questions.filter(
      (q) => q.difficulty.toLowerCase() === difficulty.toLowerCase()
    );
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
  const { score, category, difficulty } = req.body;

  if (typeof score !== "number") {
    return res.status(400).json({ error: "Invalid score" });
  }

  try {
    await Score.create({
  userId: req.user.id,
  score,
  category,
  difficulty,
});

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed" });
  }
});

/* =========================
   ✅ LEADERBOARD (ADVANCED)
========================= */

// 🏆 1. OVERALL
app.get("/api/quiz/leaderboard", async (req, res) => {
  try {
    const data = await Score.find()
      .sort({ score: -1 })
      .populate("userId", "username");

    res.json({ data });
  } catch {
    res.status(500).json({ error: "Failed" });
  }
});

// 🎯 2. MODE BASED
app.get("/api/quiz/leaderboard/mode/:difficulty", async (req, res) => {
  try {
    const { difficulty } = req.params;

    const data = await Score.find({ difficulty })
      .sort({ score: -1 })
      .populate("userId", "username");

    res.json({ data });
  } catch {
    res.status(500).json({ error: "Failed" });
  }
});

// 📚 3. CATEGORY BASED
app.get("/api/quiz/leaderboard/category/:category", async (req, res) => {
  try {
    const { category } = req.params;

    const data = await Score.find({ category })
      .sort({ score: -1 })
      .populate("userId", "username");

    res.json({ data });
  } catch {
    res.status(500).json({ error: "Failed" });
  }
});

// 🔍 4. FILTER (BEST ONE)
app.get("/api/quiz/leaderboard/filter", async (req, res) => {
  try {
    const { category, difficulty } = req.query;

    const query = {};

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    const data = await Score.find(query)
      .sort({ score: -1 })
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
   ✅ ROOT
========================= */
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* =========================
   ✅ SERVE FRONTEND (LAST)
========================= */
const __dirname = new URL(".", import.meta.url).pathname;

app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

/* =========================
   ✅ START SERVER
========================= */
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running on", PORT);
});