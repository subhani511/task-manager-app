import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token && req.cookies) {
    const cookieName = process.env.COOKIE_NAME || "task_auth_refresh";
    token = req.cookies[cookieName];
  }

  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("protect decoded ->", { id: decoded.id, type: decoded.type });
    if (!decoded || !decoded.id || decoded.type !== "access") {
      return res.status(401).json({ message: "Token invalid" });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid" });
  }
});
