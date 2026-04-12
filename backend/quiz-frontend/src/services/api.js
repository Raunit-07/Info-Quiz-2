import axios from "axios";

// ✅ Clean Base URL setup
const BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

// 👉 FINAL baseURL (IMPORTANT)
const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔍 Debug (optional but helpful)
console.log("API Base URL:", api.defaults.baseURL);

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

// ✅ RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response || error.message);

    // 🔐 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("quiz-progress");
      window.location.replace("/");
    }

    // ⏱️ Timeout
    if (error.code === "ECONNABORTED") {
      alert("Server is taking too long. Please try again.");
    }

    // 🌐 Backend down
    if (!error.response) {
      alert("Cannot connect to server. Check backend.");
    }

    return Promise.reject(error);
  }
);

export default api;