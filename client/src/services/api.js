import axios from "axios";

// ✅ FORCE CORRECT BASE URL (NO MISMATCH)
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://quiz-backend-yg1i.onrender.com/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ⚠️ Global error handling
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data ||
      error.message ||
      "Something went wrong";

    console.error("API Error:", errorMessage);

    // 🔒 Auto logout on 401
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;