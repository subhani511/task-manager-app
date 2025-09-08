import api from "../api/apiClient";

export async function checkAuth() {
  try {
    const res = await api.get("/auth/me");
    return res.data; // user object
  } catch (err) {
    return null;
  }
}
