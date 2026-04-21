import axios from "axios";

const api = axios.create({
  baseURL: "https://quiz-backend-yg1i.onrender.com/api", // ✅ FIXED
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

// 🔐 Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ⚠️ Handle errors
api.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error("API Error:", error.response || error.message);

    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.replace("/login");
    }

    return Promise.reject(error);
  }
);