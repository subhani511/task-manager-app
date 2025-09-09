import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/apiClient";
import { setAccessToken } from "../lib/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });

      // adjust this key depending on your backend response
      const token = res.data?.accessToken || res.data?.token;
      if (token) {
        setAccessToken(token);
        nav("/board"); // redirect after login
      } else {
        setError("No token received from server");
      }

      // clear form
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-8">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <form onSubmit={submit} className="space-y-4">
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
            Login
          </button>
          <Link
            to="/register"
            className="text-sm text-gray-600 hover:underline"
          >
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}
