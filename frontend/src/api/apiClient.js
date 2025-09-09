import axios from "axios";
import { getAccessToken, setAccessToken, clearAccessToken } from "../lib/auth";

const API_BASE =
  (import.meta.env.VITE_API_BASE || "http://localhost:5000") + "/api";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // keep for refresh / cookie-based flows
  headers: { "Content-Type": "application/json" },
});

// attach access token, but skip for login/register
api.interceptors.request.use((config) => {
  const skipAuth =
    config.url.includes("/auth/login") || config.url.includes("/auth/register");
  if (!skipAuth) {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// refresh on 401 and retry once (skip login/register)
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    const skipAuth =
      original?.url.includes("/auth/login") ||
      original?.url.includes("/auth/register");

    if (err.response?.status === 401 && !original?._retry && !skipAuth) {
      original._retry = true;
      try {
        const r = await api.post("/auth/refresh"); // cookie sent automatically
        const newAccess = r.data?.accessToken;
        if (newAccess) {
          setAccessToken(newAccess);
          original.headers.Authorization = `Bearer ${newAccess}`;
          return api(original);
        }
      } catch (e) {
        clearAccessToken();
      }
    }
    return Promise.reject(err);
  }
);

export default api;
