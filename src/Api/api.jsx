import axios from "axios";

/**
 * Central Axios instance (LOCAL BACKEND)
 */
const api = axios.create({
  baseURL: "https://cdaxx-app-yz51.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API ERROR ", error.response || error.message);
    return Promise.reject(error);
  }
);

export default api;
