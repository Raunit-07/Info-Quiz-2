import axios from "axios";

// ✅ Correct base URL (NO /api here)
const BASE_URL =
  process.env.REACT_APP_API_URL ||
  "https://quiz-backend-yg1i.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
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

    // 🔥 Token expired / unauthorized
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.replace("/login");
    }

    // 🔥 Timeout (Render free slow)
    if (error.code === "ECONNABORTED") {
      alert("Server is slow (Render free tier). Try again.");
    }

    // 🔥 Backend down / network issue
    if (!error.response) {
      alert("Backend not reachable. Please wait or refresh.");
    }

    return Promise.reject(error);
  }
);