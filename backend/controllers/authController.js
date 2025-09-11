// backend/controllers/authController.js
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// helper: sign access token (short-lived)
const signAccessToken = (payload) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";
  return jwt.sign(payload, secret, { expiresIn });
};

// helper: sign refresh token (longer-lived)
const signRefreshToken = (payload) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";
  return jwt.sign(payload, secret, { expiresIn });
};

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "Missing fields" });

  const exists = await User.findOne({ email });
  if (exists)
    return res.status(400).json({ message: "Email already registered" });

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  const user = await User.create({ name, email, password: hashed });

  if (!process.env.JWT_SECRET) {
    console.error("register: JWT_SECRET is not set in env");
    return res.status(500).json({ message: "Server configuration error" });
  }

  // Issue tokens (same behaviour as login -> auto authenticate on register)
  const accessToken = signAccessToken({ id: user._id, type: "access" });
  const refreshToken = signRefreshToken({ id: user._id, type: "refresh" });

  const cookieName = process.env.COOKIE_NAME || "task_auth_refresh";
  const isProd = process.env.NODE_ENV === "production";

  res.cookie(cookieName, refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/api/auth/refresh",
  });

  // Return accessToken and minimal user info
  res.status(201).json({
    accessToken,
    user: { id: user._id, name: user.name, email: user.email },
  });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Missing fields" });

  // if you set password select:false in model, ensure to select it explicitly here
  const user = await User.findOne({ email }).select("+password");
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  if (!process.env.JWT_SECRET) {
    console.error("login: JWT_SECRET is not set in env");
    return res.status(500).json({ message: "Server configuration error" });
  }

  // create tokens
  const accessToken = signAccessToken({ id: user._id, type: "access" });
  const refreshToken = signRefreshToken({ id: user._id, type: "refresh" });

  const cookieName = process.env.COOKIE_NAME || "task_auth_refresh";
  const isProd = process.env.NODE_ENV === "production";

  // set refresh token as httpOnly cookie (used only by /refresh)
  res.cookie(cookieName, refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/api/auth/refresh",
  });

  // return short-lived access token and user info
  res.json({
    accessToken,
    user: { id: user._id, name: user.name, email: user.email },
  });
});

// POST /api/auth/refresh
export const refresh = asyncHandler(async (req, res) => {
  const cookieName = process.env.COOKIE_NAME || "task_auth_refresh";
  const token = req.cookies?.[cookieName];

  if (!token) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload || payload.type !== "refresh") {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const userId = payload.id;

    const newAccessToken = signAccessToken({ id: userId, type: "access" });

    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error("refresh token error:", err.message);
    return res.status(401).json({ message: "Invalid refresh token" });
  }
});

// POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  const cookieName = process.env.COOKIE_NAME || "task_auth_refresh";
  res.cookie(cookieName, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    expires: new Date(0),
    path: "/api/auth/refresh",
  });
  res.json({ message: "Logged out" });
});

// GET /api/auth/me
export const me = asyncHandler(async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  res.json(req.user);
});
