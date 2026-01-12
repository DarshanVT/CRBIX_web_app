import api from "./api";

/**
 * FAVORITES API
 * Backend endpoints are working correctly!
 */

/**
 * Get all favorite courses of a user
 * GET /favorites/{userId}
 */
export const getUserFavorites = async (userId) => {
  try {
    const response = await api.get(`/favorites/${userId}`);
    return response.data || [];
  } catch (err) {
    console.error("Failed to fetch favorites:", err);
    throw err;
  }
};

/**
 * Add a course to favorites
 * POST /favorites/{userId}/add/{courseId}
 */
export const addToFavorites = async (userId, courseId) => {
  try {
    const response = await api.post(`/favorites/${userId}/add/${courseId}`);
    return response.data;
  } catch (err) {
    console.error("Failed to add favorite:", err);
    throw err;
  }
};

/**
 * Remove a course from favorites
 * DELETE /favorites/{userId}/remove/{courseId}
 */
export const removeFromFavorites = async (userId, courseId) => {
  try {
    await api.delete(`/favorites/${userId}/remove/${courseId}`);
    return { success: true };
  } catch (err) {
    console.error("Failed to remove favorite:", err);
    throw err;
  }
};

/**
 * Check if a course is already favorite
 * GET /favorites/{userId}/check/{courseId}
 */
export const checkIsFavorite = async (userId, courseId) => {
  try {
    const response = await api.get(`/favorites/${userId}/check/${courseId}`);
    return response.data || false;
  } catch (err) {
    console.error("Failed to check favorite:", err);
    return false;
  }
};

/**
 * Toggle favorite status
 * Helper function for frontend
 */
export const toggleFavorite = async (userId, courseId, isCurrentlyFavorite) => {
  try {
    if (isCurrentlyFavorite) {
      await removeFromFavorites(userId, courseId);
      return { success: true, isFavorite: false };
    } else {
      const result = await addToFavorites(userId, courseId);
      return { success: true, isFavorite: true, data: result };
    }
  } catch (err) {
    console.error("Failed to toggle favorite:", err);
    throw err;
  }
};