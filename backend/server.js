import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

/* =======================
   CORS CONFIGURATION
   ======================= */
const whitelist = [
  "http://localhost:5173", // local dev
  "https://task-manager-app-as3e.vercel.app", // deployed frontend on Vercel
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.includes(origin)) {
      return callback(null, true);
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

// Error handler
app.use(errorHandler);

/* =======================
   SERVER START
   ======================= */
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () =>
      console.log(`Server started on port ${PORT} ✅✅✅`)
    );
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();
