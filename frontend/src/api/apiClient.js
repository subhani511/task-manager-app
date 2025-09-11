import axios from "axios";
import { getAccessToken, setAccessToken, clearAccessToken } from "../lib/auth";

const API_BASE =
  (import.meta.env.VITE_API_BASE || "http://localhost:5000") + "/api";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const url = config?.url || "";
  const skipAuth =
    url.includes("/auth/login") || url.includes("/auth/register");
  if (!skipAuth) {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    const url = original?.url || "";
    const skipAuth =
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/refresh");

    if (err.response?.status === 401 && !original?._retry && !skipAuth) {
      original._retry = true;
      try {
        const r = await api.post("/auth/refresh");
        const newAccess = r.data?.accessToken;
        if (newAccess) {
          setAccessToken(newAccess);
          original.headers = original.headers || {};
          original.headers.Authorization = `Bearer ${newAccess}`;
          return api(original);
        }
      } catch (e) {
        clearAccessToken();
        window.location.replace("/login");
      }
    }
    return Promise.reject(err);
  }
);

export default api;
