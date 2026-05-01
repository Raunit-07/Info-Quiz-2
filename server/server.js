import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./db.js";
import authRoutes from "./routes/auth.js";
import quizRoutes from "./routes/quiz.js";
import errorHandler from "./middleware/errorMiddleware.js";

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running smoothly" });
});

// Production: Serve static files from React build
const buildPath = path.join(__dirname, "../client/build");
app.use(express.static(buildPath));

// Fallback for React SPA (Client-side routing)
app.get("*", (req, res) => {
  if (req.url.startsWith("/api")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  res.sendFile(path.join(buildPath, "index.html"));
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});