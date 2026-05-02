import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./db.js";

// Routes
import authRoutes from "./routes/auth.js";
import quizRoutes from "./routes/quiz.js";

// Initialize environment variables
dotenv.config();

// Connect to Database
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ==========================================
// ✅ 1. API ROUTES (Must be FIRST)
// ==========================================
app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running smoothly" });
});

// ==========================================
// ✅ 2. API 404 HANDLER (Catch-all for /api/*)
// ==========================================
app.all("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.originalUrl}`
  });
});

// ==========================================
// ✅ 3. STATIC FILES & SPA FALLBACK (Production Only)
// ==========================================
if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "../client/build");

  app.use(express.static(buildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

// ==========================================
// ✅ 4. GLOBAL ERROR HANDLER (Strict JSON)
// ==========================================
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    error: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});