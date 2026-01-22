import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://cdaxx-backend.onrender.com/api";

export const videoApi = {
  markVideoAsCompleted: async (data) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/video/complete`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error marking video as completed:", error);
      throw error;
    }
  },

  updateVideoProgress: async (data) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${API_BASE_URL}/video/progress`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating video progress:", error);
      throw error;
    }
  },

  getVideoProgress: async (videoId, userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/video/progress/${videoId}/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching video progress:", error);
      throw error;
    }
  },
};