// backend/utils/generateToken.js
import jwt from "jsonwebtoken";

export default function generateToken(payload) {
  if (!process.env.JWT_SECRET) {
    console.error("generateToken: JWT_SECRET is not set!");
    throw new Error("JWT_SECRET is required");
  }
  // returns signed token string
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}
