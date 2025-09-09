import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE + "/api", // always add /api once
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
