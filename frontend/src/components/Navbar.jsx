// src/components/NavBar.jsx  (Strong / Bold UI)
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/apiClient";
import { LogOut } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export default function Navbar() {
  const nav = useNavigate();
  const reduce = useReducedMotion();

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {}
    nav("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={reduce ? {} : { scale: 1.08, rotate: -2 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-md flex items-center justify-center text-white font-extrabold shadow-md"
          >
            TK
          </motion.div>
          <div>
            <div className="text-lg font-bold text-white tracking-tight">
              Task Manager App
            </div>
            <div className="text-xs text-white/70">Lightweight Kanban</div>
          </div>
        </Link>

        <div className="flex items-center gap-5">
          <Link
            to="/board"
            className="relative text-sm font-medium text-white/90 hover:text-white transition
                   after:content-[''] after:block after:h-0.5 after:bg-white after:scale-x-0
                   hover:after:scale-x-100 after:transition-transform after:origin-left"
          >
            Board
          </Link>

          <motion.button
            whileHover={reduce ? {} : { scale: 1.05 }}
            whileTap={reduce ? {} : { scale: 0.95 }}
            onClick={logout}
            className="flex items-center gap-2 text-sm font-semibold text-red-200 hover:text-red-400 transition"
          >
            <LogOut size={16} /> Logout
          </motion.button>
        </div>
      </div>
    </nav>
  );
}
