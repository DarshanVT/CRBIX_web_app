import axios from "axios";

/**
 * Central Axios instance (LOCAL BACKEND)
 */
const api = axios.create({
  baseURL: "https://cdaxx-backend.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ ADD THIS INTERCEPTOR - It automatically adds the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API ERROR ", error.response || error.message);
    return Promise.reject(error);
  }
);

export default api;