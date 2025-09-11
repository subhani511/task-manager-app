// server.js
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

/* =======================
   CORS CONFIGURATION (env-driven)
   ======================= */
const getWhitelist = () => {
  const raw = process.env.FRONTEND_ORIGINS || process.env.FRONTEND_URL || "";
  // allow comma-separated origins (trim spaces)
  const list = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // ensure localhost dev is allowed
  if (!list.includes("http://localhost:5173")) {
    list.unshift("http://localhost:5173");
  }
  return list;
};

const whitelist = getWhitelist();

const corsOptions = {
  origin: (origin, callback) => {
    // allow non-browser requests (curl, Postman) where origin is undefined
    if (!origin) return callback(null, true);

    // exact whitelist match
    if (whitelist.includes(origin)) return callback(null, true);

    // allow any Vercel preview domain (*.vercel.app)
    try {
      const url = new URL(origin);
      if (url.hostname.endsWith(".vercel.app")) return callback(null, true);
    } catch (e) {
      // ignore parse errors
    }

    console.warn("Blocked by CORS:", origin);
    return callback(new Error("Not allowed by CORS: " + origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

/* =======================
   ROUTES
   ======================= */
app.get("/", (req, res) =>
  res.json({ ok: true, env: process.env.NODE_ENV || "development" })
);

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Error handler (should be last)
app.use(errorHandler);

/* =======================
   SERVER START
   ======================= */
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("MongoDB connected to DB:", mongoose.connection.name);
    app.listen(PORT, () =>
      console.log(
        `Server started on port ${PORT} ✅ (NODE_ENV=${process.env.NODE_ENV})`
      )
    );
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();
