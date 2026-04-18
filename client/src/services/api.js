import axios from "axios";

const BASE_URL =
  process.env.REACT_APP_API_URL || "https://quiz-backend-ygli.onrender.com";

const api = axios.create({
  baseURL: `${BASE_URL}/api`, // 🔥 important
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

    // 🔥 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("quiz-progress");
      window.location.replace("/");
    }

    // 🔥 Timeout (Render sleep)
    if (error.code === "ECONNABORTED") {
      alert("Server waking up... please try again.");
    }

    // 🔥 Network error
    if (!error.response) {
      alert("Backend not reachable. Refresh after few seconds.");
    }

    return Promise.reject(error);
  }
);