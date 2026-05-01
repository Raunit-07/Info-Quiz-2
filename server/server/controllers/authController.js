import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "fallback_secret",
    { expiresIn: "7d" }
  );
};

// ✅ REGISTER
export const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    // check existing user
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ LOGIN
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};