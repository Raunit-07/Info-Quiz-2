import axios from "axios";

// ✅ Always point to deployed backend in production
const BASE_URL =
  process.env.REACT_APP_API_URL ||
  "https://quiz-backend-yg1i.onrender.com/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // थोड़ा बढ़ाया (Render free slow होता है)
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
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

/* =========================
   ✅ RESPONSE INTERCEPTOR
========================= */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response || error.message);

    // 🔥 Unauthorized (token expired)
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("quiz-progress");

      window.location.replace("/");
    }

    // 🔥 Timeout (Render free delay)
    if (error.code === "ECONNABORTED") {
      alert("Server is slow (free tier). Try again in a few seconds.");
    }

    // 🔥 Network error
    if (!error.response) {
      alert("Backend not reachable. Please wait or refresh.");
    }

    return Promise.reject(error);
  }
);