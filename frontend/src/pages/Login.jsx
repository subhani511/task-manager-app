// src/pages/Login.jsx  (Styling-only: Strong / Bold UI) — updated for prefill + redirect
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import api from "../api/apiClient";
import { setAccessToken } from "../lib/auth";
import { motion, useReducedMotion } from "framer-motion";

export default function Login() {
  const nav = useNavigate();
  const location = useLocation();
  const reduce = useReducedMotion();

  // Prefill email from navigation state (e.g., after registration)
  const initialEmail = location?.state?.email || "";
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Clean up the history state so the email doesn't persist if user navigates back
  useEffect(() => {
    if (initialEmail) {
      // replace current history entry without the email state
      window.history.replaceState({}, document.title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });

      const token = res.data?.accessToken || res.data?.token;
      if (token) {
        setAccessToken(token);
        localStorage.setItem(
          "user",
          JSON.stringify(res.data.user || { email })
        );
        // redirect to root (Board is now mounted at "/")
        nav("/");
      } else {
        setError("No token received from server");
      }

      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  const container = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.36, ease: "easeOut" },
    },
  };

  const inputFocus =
    "ring-2 ring-offset-1 ring-indigo-400 dark:ring-indigo-500/60 outline-none";

  return (
    <motion.div
      initial={reduce ? false : "hidden"}
      animate={reduce ? undefined : "visible"}
      variants={reduce ? {} : container}
      className="min-h-[70vh] flex items-center justify-center px-4"
    >
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 shadow-2xl">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-fuchsia-500 p-2 shadow-lg flex items-center justify-center mb-3">
              {/* simple icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Welcome back
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Sign in to continue to your Task Board
            </p>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Email
              </span>
              <motion.input
                whileFocus={reduce ? {} : { scale: 1.01 }}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`mt-2 w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm ${inputFocus}`}
                placeholder="you@example.com"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </span>
              <motion.input
                whileFocus={reduce ? {} : { scale: 1.01 }}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`mt-2 w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm ${inputFocus}`}
                placeholder="••••••••"
              />
            </label>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/30 p-2 rounded">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between gap-4">
              <motion.button
                whileHover={reduce ? {} : { scale: 1.03 }}
                whileTap={reduce ? {} : { scale: 0.98 }}
                type="submit"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold shadow-lg hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
                aria-label="Login"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12h14M12 5l7 7-7 7"
                  />
                </svg>
                Login
              </motion.button>

              <Link
                to="/register"
                className="text-sm text-slate-600 hover:underline dark:text-slate-300"
              >
                Register
              </Link>
            </div>
          </form>

          {/* Footer quick hint */}
          <div className="mt-6 text-center text-xs text-slate-400">
            <span>By continuing you agree to the app's terms.</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
