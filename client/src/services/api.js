import axios from "axios";

// ✅ PRODUCTION BACKEND URL
const BACKEND_URL = "https://quiz-backend-yg1i.onrender.com/api";

const api = axios.create({
  // Priority: 1. Env Var, 2. Hardcoded Production URL, 3. Relative fallback
  baseURL: process.env.REACT_APP_API_URL || BACKEND_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

// 🔐 Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ⚠️ Global error handling for responses
api.interceptors.response.use(
  (res) => res,
  (error) => {
    // Standardize error message extraction
    const errorMessage = 
      error.response?.data?.error || 
      error.response?.data || 
      error.message || 
      "Something went wrong";

    console.error("API Error:", errorMessage);

    // Auto logout on 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      if (window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  }
);