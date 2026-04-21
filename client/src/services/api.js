import axios from "axios";

// ✅ Correct base URL (NO /api here)
const BASE_URL =
  process.env.REACT_APP_API_URL ||
  "https://quiz-backend-yg1i.onrender.com/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

/* =========================
   ✅ REQUEST INTERCEPTOR
========================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   ✅ RESPONSE INTERCEPTOR
========================= */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response || error.message);

    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.replace("/login");
    }

    if (error.code === "ECONNABORTED") {
      alert("Server is slow (Render free tier). Try again.");
    }

    // ✅ FIXED HERE
    if (!error.response && error.code !== "ECONNABORTED") {
      console.warn("Network issue");
    }

    return Promise.reject(error);
  }
);