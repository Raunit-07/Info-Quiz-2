import axios from "axios";

// ✅ Base URL (safe fallback)
const API_URL = process.env.REACT_APP_API_URL || null;

const getBaseURL = () => {
  if (API_URL) return `${API_URL.replace(/\/$/, '')}/api`;
  if (process.env.NODE_ENV === 'production') return '/api';
  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000, // 🔥 prevent infinite loading (10s)
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ REQUEST INTERCEPTOR (attach token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// ✅ RESPONSE INTERCEPTOR (handle errors globally)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response || error.message);

    // 🔥 Token expired / unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("quiz-progress");

      // Better than reload → keeps SPA behavior
      window.location.replace("/");
    }

    // 🔥 Timeout / server down
    if (error.code === "ECONNABORTED") {
      alert("Server is taking too long. Please try again.");
    }

    // 🔥 Network error (backend not running)
    if (!error.response) {
      alert("Cannot connect to server. Check backend.");
    }

    return Promise.reject(error);
  }
);

export default api;