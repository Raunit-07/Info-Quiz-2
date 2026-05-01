import axios from "axios";

const api = axios.create({
  // Use relative path in production (since Express serves the build)
  // or localhost in development
  baseURL: process.env.NODE_ENV === "production" 
    ? "/api" 
    : "http://localhost:5000/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ⚠️ Handle global response errors
api.interceptors.response.use(
  (res) => res,
  (error) => {
    // If unauthorized (expired token), clear local storage and redirect
    if (error.response?.status === 401) {
      localStorage.clear();
      if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
        window.location.replace("/login");
      }
    }
    
    // Ensure we always return a clean error message from JSON if possible
    const message = error.response?.data?.error || error.response?.data || error.message;
    console.error("API Error:", message);
    
    return Promise.reject(error);
  }
);

export default api;