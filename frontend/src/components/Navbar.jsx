import React from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/apiClient";
import { LogOut } from "lucide-react";

export default function Navbar() {
  const nav = useNavigate();
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {}
    nav("/login");
  };

  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-400 flex items-center justify-center text-white font-bold">
            TK
          </div>
          <div>
            <div className="text-lg font-semibold">Task Manager App</div>
            <div className="text-xs text-slate-500">Lightweight Kanban</div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link to="/board" className="text-sm text-slate-700 hover:underline">
            Board
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm text-red-600 hover:text-red-500"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
