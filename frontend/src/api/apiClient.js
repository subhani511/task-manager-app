import axios from "axios";

let API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

if (!API_BASE.endsWith("/api")) {
  API_BASE = API_BASE.replace(/\/$/, "") + "/api";
}

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
