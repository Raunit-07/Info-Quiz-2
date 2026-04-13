import axios from "axios";



const api = axios.create({
  baseURL: "https://quiz-app-backend.onrender.com/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});


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