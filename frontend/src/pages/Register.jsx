import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/apiClient";
import { setAccessToken } from "../lib/auth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/register", { name, email, password });

      const token = res.data?.accessToken || res.data?.token;
      if (token) {
        setAccessToken(token);
        localStorage.setItem(
          "user",
          JSON.stringify(res.data.user || { name, email })
        );
        nav("/board");
      } else {
        nav("/login");
      }

      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-8">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      <form onSubmit={submit} className="space-y-4">
        <input
          type="text"
          className="w-full border px-3 py-2 rounded"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          className="w-full border px-3 py-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full border px-3 py-2 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <div className="text-red-600">{error}</div>}
        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Register
          </button>
          <Link to="/login" className="text-sm text-gray-600 hover:underline">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
