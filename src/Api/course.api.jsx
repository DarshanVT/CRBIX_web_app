import api from "./api";

/* ==================== COURSES ==================== */

export const getCourses = async (userId = null) => {
  try {
    const params = {};
    if (userId) params.userId = userId;

    const res = await api.get("/courses", { params });
    return res.data?.data ?? [];
  } catch (err) {
    console.error("Failed to fetch courses:", err);
    return [];
  }
};

export const getCourseById = async (courseId, userId = null) => {
  try {
    const params = {};
    if (userId) params.userId = userId;

    const res = await api.get(`/courses/${courseId}`, { params });
    return res.data?.data ?? null;
  } catch (err) {
    console.error("Course fetch failed:", err);
    return null;
  }
};

export const getDashboardCourses = async (userId) => {
  try {
    const res = await api.get("/dashboard/courses", {
      params: { userId: userId },
    });
    return res.data?.data ?? [];
  } catch (err) {
    console.error("Dashboard fetch failed:", err);
    return [];
  }
};

/* ==================== CART ==================== */

export const getCart = async (userId) => {
  try {
    const res = await api.get(`/cart/${userId}`);
    return res.data ?? [];
  } catch (err) {
    console.error("Cart fetch failed:", err);
    return [];
  }
};

export const getCartSummary = async (userId) => {
  try {
    const res = await api.get(`/cart/${userId}/summary`);
    return res.data ?? null;
  } catch (err) {
    console.error("Cart summary failed:", err);
    return null;
  }
};

export const addToCart = async (userId, courseId) => {
  try {
    const res = await api.post(`/cart/${userId}/add/${courseId}`);
    return res.data;
  } catch (err) {
    console.error("Add to cart failed:", err);
    return null;
  }
};

export const removeFromCart = async (userId, courseId) => {
  try {
    await api.delete(`/cart/${userId}/remove/${courseId}`);
    return { success: true };
  } catch (err) {
    console.error("Remove from cart failed:", err);
    return { success: false };
  }
};

export const clearCart = async (userId) => {
  try {
    await api.delete(`/cart/${userId}/clear`);
    return { success: true };
  } catch (err) {
    console.error("Clear cart failed:", err);
    return { success: false };
  }
};

/* ==================== PURCHASE ==================== */

export const purchaseCourse = async (courseId) => {
  try {
    // Get userId from localStorage
    const userId = localStorage.getItem("user_id");

    if (!userId || userId === "null") {
      throw new Error("User ID not found. Please login again.");
    }

    const res = await api.post(`/purchase`, null, {
      params: {
        userId: userId,
        courseId: courseId,
      },
    });

    return {
      success: true,
      message: res.data?.message || "Purchase successful",
      data: res.data,
    };
  } catch (err) {
    console.error("Purchase failed:", err);
    return {
      success: false,
      message:
        err.response?.data?.message || "Purchase failed. Please try again.",
    };
  }
};

export const getPurchasedCourses = async (userId) => {
  try {
    const res = await api.get(`/courses/subscribed/${userId}`);
    return res.data?.data ?? [];
  } catch (err) {
    console.error("Get purchased courses failed:", err);
    return [];
  }
};

export const isCoursePurchased = async (courseId) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return false;

    const res = await api.get(`/courses/${courseId}`, {
      params: { userId: userId },
    });

    const courseData = res.data?.data;
    return courseData?.isPurchased || false;
  } catch (err) {
    console.error("Check purchase status failed:", err);
    return false;
  }
};

/* ==================== FAVORITES ==================== */

export const getFavorites = async () => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return [];

    const res = await api.get(`/favorites/${userId}`);
    return res.data ?? [];
  } catch (err) {
    console.error("Favorites fetch failed:", err);
    return [];
  }
};

export const addToFavorite = async (courseId) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) throw new Error("Please login first");

    const res = await api.post(`/favorites/${userId}/add/${courseId}`);
    return res.data;
  } catch (err) {
    console.error("Add to favorite failed:", err);
    return null;
  }
};

export const removeFromFavorites = async (courseId) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) throw new Error("Please login first");

    await api.delete(`/favorites/${userId}/remove/${courseId}`);
    return { success: true };
  } catch (err) {
    console.error("Remove from favorites failed:", err);
    return { success: false };
  }
};

/* ==================== PROGRESS & STREAK ==================== */

export const getCourseProgress = async (courseId) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return null;

    const res = await api.get(`/course/${courseId}/progress`, {
      params: { userId: userId },
    });
    return res.data;
  } catch (err) {
    console.error("Course progress failed:", err);
    return null;
  }
};

export const getUserOverallProgress = async () => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return null;

    const res = await api.get(`/user/${userId}/progress/overall`);
    return res.data;
  } catch (err) {
    console.error("Overall progress failed:", err);
    return null;
  }
};

export const getStreak = async (courseId = null) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return null;

    const params = { userId: userId };
    if (courseId) params.courseId = courseId;

    const res = await api.get(`/profile/streak`, { params: params });
    return res.data;
  } catch (err) {
    console.error("Streak fetch failed:", err);
    return null;
  }
};

export const getDashboardStats = async () => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return null;

    const res = await api.get(`/dashboard/stats`, {
      params: { userId: userId },
    });
    return res.data;
  } catch (err) {
    console.error("Dashboard stats failed:", err);
    return null;
  }
};

/* ==================== MODULE & VIDEO ==================== */

export const getModulesByCourse = async (courseId) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return null;

    const res = await api.get(`/modules/course/${courseId}`, {
      params: { userId: userId },
    });
    return res.data;
  } catch (err) {
    console.error("Get modules failed:", err);
    return null;
  }
};

export const getModuleById = async (moduleId) => {
  try {
    const res = await api.get(`/modules/${moduleId}`);
    return res.data;
  } catch (err) {
    console.error("Get module by ID failed:", err);
    return null;
  }
};

export const unlockNextModule = async (courseId, moduleId) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return false;

    const res = await api.post(`/modules/${moduleId}/unlock-next`, null, {
      params: {
        userId: userId,
        courseId: courseId,
      },
    });
    return res.data?.success || false;
  } catch (err) {
    console.error("Unlock module failed:", err);
    return false;
  }
};

export const unlockAssessment = async (moduleId) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return false;

    const res = await api.post(`/modules/${moduleId}/unlock-assessment`, null, {
      params: { userId: userId },
    });
    return res.data?.success || false;
  } catch (err) {
    console.error("Unlock assessment failed:", err);
    return false;
  }
};

/* ==================== VIDEO PROGRESS & COMPLETION ==================== */

export const updateVideoProgress = async (
  userId,
  videoId,
  watchedSeconds,
  lastPositionSeconds,
  forwardJumpsCount = 0
) => {
  try {
    const res = await api.post(`/videos/${videoId}/progress`, {
      userId,
      watchedSeconds,
      lastPositionSeconds,
      forwardJumpsCount,
    });

    return res.data;
  } catch (err) {
    console.error("Video progress update failed", err);
    return null;
  }
};

export const seekVideo = async (userId, videoId, seekPositionSeconds) => {
  try {
    const res = await api.post(`/videos/${videoId}/seek`, {
      userId,
      lastPositionSeconds: seekPositionSeconds,
      forwardJump: true,
    });

    return { success: res.data?.success ?? true };
  } catch (err) {
    console.error("Video seek failed:", err);
    return { success: false };
  }
};

export const completeVideo = async (userId, courseId, moduleId, videoId) => {
  try {
    const res = await api.post(`/videos/${videoId}/complete`, null, {
      params: {
        userId,
        courseId,
        moduleId,
      },
    });

    return { success: res.data?.success ?? true };
  } catch (err) {
    console.error("Video completion failed:", err);
    return { success: false };
  }
};

/* ==================== ASSESSMENT ==================== */

export const getAssessmentStatus = async (assessmentId) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return null;

    const res = await api.get("/course/assessment/status", {
      params: { userId, assessmentId },
    });

    return res.data?.data ?? null;
  } catch (err) {
    console.error("Assessment status fetch failed:", err);
    return null;
  }
};

export const canAttemptAssessment = async (assessmentId) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return false;

    const res = await api.get("/course/assessment/can-attempt", {
      params: {
        userId,
        assessmentId,
      },
    });

    return res.data?.canAttempt ?? false;
  } catch (err) {
    console.error("Assessment canAttempt failed:", err);
    return false;
  }
};

export const getAssessmentQuestions = async (assessmentId) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return null;

    const res = await api.get("/course/assessment/questions", {
      params: { userId, assessmentId },
    });

    return res.data?.data ?? null;
  } catch (err) {
    console.error("Assessment questions fetch failed:", err);
    return null;
  }
};

export const submitAssessment = async (assessmentId, answers) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return null;

    const res = await api.post(
      "/course/assessment/submit",
      answers,
      { params: { userId, assessmentId } }
    );

    return res.data?.data ?? res.data;
  } catch (err) {
    console.error("Assessment submit failed:", err);
    return null;
  }
};

// NEW: Get assessments by module
export const getModuleAssessments = async (moduleId) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return [];

    const res = await api.get(`/modules/${moduleId}/assessments`, {
      params: { userId }
    });
    return res.data || [];
  } catch (err) {
    console.error("Get module assessments failed:", err);
    return [];
  }
};

// NEW: Get assessment details
export const getAssessmentDetails = async (assessmentId) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return null;

    const res = await api.get(`/assessments/${assessmentId}`, {
      params: { userId }
    });
    return res.data;
  } catch (err) {
    console.error("Get assessment details failed:", err);
    return null;
  }
};

// NEW: Check module completion
export const checkModuleCompletion = async (moduleId) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return false;

    const res = await api.get(`/modules/${moduleId}/completion`, {
      params: { userId }
    });
    return res.data?.completed || false;
  } catch (err) {
    console.error("Check module completion failed:", err);
    return false;
  }
};

// NEW: Check assessment unlock
export const checkAssessmentUnlock = async (moduleId) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return false;

    const res = await api.get(`/course/assessment/can-attempt`, {
      params: {
        userId,
        assessmentId: moduleId
      }
    });
    return res.data?.canAttempt || false;
  } catch (err) {
    console.error("Check assessment unlock failed:", err);
    return false;
  }
};

// NEW: Submit assessment answer
export const submitAssessmentAnswer = async (assessmentId, answers) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return null;

    const res = await api.post(`/course/assessment/submit`, answers, {
      params: { userId, assessmentId }
    });
    return res.data;
  } catch (err) {
    console.error("Submit assessment failed:", err);
    return null;
  }
};

// NEW: Unlock next module if available
export const unlockNextModuleIfAvailable = async (courseId, completedModuleId) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return false;

    const res = await api.post(`/modules/${completedModuleId}/unlock-next`, null, {
      params: {
        userId,
        courseId
      }
    });
    return res.data?.success || false;
  } catch (err) {
    console.error("Unlock next module failed:", err);
    return false;
  }
};

// NEW: Get videos by module
export const getVideosByModule = async (moduleId) => {
  try {
    const res = await api.get(`/modules/${moduleId}/videos`);
    return res.data || [];
  } catch (err) {
    console.error("Get videos by module failed:", err);
    return [];
  }
};

/* ==================== PROFILE ==================== */

export const getProfile = async () => {
  try {
    const res = await api.get("/auth/profile/me");
    return res.data?.user ?? null;
  } catch (err) {
    console.error("Profile fetch failed:", err);
    return null;
  }
};

/* ==================== CHECKOUT ==================== */

export const checkoutCart = async (checkoutData) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) throw new Error("Please login first");

    const res = await api.post(`/cart/${userId}/checkout`, checkoutData);
    return res.data;
  } catch (err) {
    console.error("Checkout failed:", err);
    return null;
  }
};

/* ==================== STREAK ==================== */

export const getStreakOverview = async () => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return null;

    const res = await api.get("/profile/streak", {
      params: { userId },
    });

    return res.data;
  } catch (err) {
    console.error("Streak overview failed:", err);
    return null;
  }
};

export const getStreakDayDetails = async (courseId, date) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return null;

    const res = await api.get(`/streak/day/${courseId}`, {
      params: {
        userId,
        date, 
      },
    });

    return res.data;
  } catch (err) {
    console.error("Streak day details failed:", err);
    return null;
  }
};

// NEW: Get month-based streak
export const getMonthStreak = async (courseId, year, month) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return null;

    const res = await api.get(`/streak/course/${courseId}/month`, {
      params: {
        userId,
        year,
        month
      }
    });
    return res.data;
  } catch (err) {
    console.error("Month streak fetch failed:", err);
    return null;
  }
};

// NEW: Get all courses with advanced search
export const advancedSearchCourses = async (searchParams) => {
  try {
    const userId = localStorage.getItem("user_id");
    const params = { ...searchParams };
    if (userId) params.userId = userId;

    const res = await api.get("/courses/advanced-search", { params });
    return res.data?.data ?? [];
  } catch (err) {
    console.error("Advanced search failed:", err);
    return [];
  }
};

// NEW: Get popular tags
export const getPopularTags = async () => {
  try {
    const res = await api.get("/courses/tags/popular");
    return res.data?.tags ?? [];
  } catch (err) {
    console.error("Get popular tags failed:", err);
    return [];
  }
};

// NEW: Get courses by tag
export const getCoursesByTag = async (tagName, userId = null) => {
  try {
    const params = {};
    if (userId) params.userId = userId;

    const res = await api.get(`/courses/tag/${tagName}`, { params });
    return res.data?.data ?? [];
  } catch (err) {
    console.error("Get courses by tag failed:", err);
    return [];
  }
};

// NEW: Get search suggestions
export const getSearchSuggestions = async (query) => {
  try {
    const res = await api.get("/courses/search/suggestions", {
      params: { query }
    });
    return res.data?.suggestions ?? [];
  } catch (err) {
    console.error("Get search suggestions failed:", err);
    return [];
  }
};

// NEW: Unlock video for user
export const unlockVideoForUser = async (userId, courseId, moduleId, videoId) => {
  try {
    const res = await api.post(`/videos/${videoId}/unlock`, null, {
      params: {
        userId,
        courseId,
        moduleId
      }
    });
    return res.data?.success || false;
  } catch (err) {
    console.error("Unlock video failed:", err);
    return false;
  }
};

// NEW: Check if module is unlocked
export const isModuleUnlocked = async (moduleId) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return false;

    const res = await api.get(`/modules/${moduleId}/unlocked`, {
      params: { userId }
    });
    return res.data?.unlocked || false;
  } catch (err) {
    console.error("Check module unlock failed:", err);
    return false;
  }
};

// NEW: Get user video progress
export const getUserVideoProgress = async (videoId) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return null;

    const res = await api.get(`/videos/${videoId}/user-progress`, {
      params: { userId }
    });
    return res.data;
  } catch (err) {
    console.error("Get user video progress failed:", err);
    return null;
  }
};

// NEW: Mark video as watched
export const markVideoAsWatched = async (videoId, watchedSeconds) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return false;

    const res = await api.post(`/videos/${videoId}/mark-watched`, null, {
      params: {
        userId,
        watchedSeconds
      }
    });
    return res.data?.success || false;
  } catch (err) {
    console.error("Mark video as watched failed:", err);
    return false;
  }
};

export default {
  getCourses,
  getCourseById,
  getDashboardCourses,
  getCart,
  getCartSummary,
  addToCart,
  removeFromCart,
  clearCart,
  purchaseCourse,
  getPurchasedCourses,
  isCoursePurchased,
  getFavorites,
  addToFavorite,
  removeFromFavorites,
  getCourseProgress,
  getUserOverallProgress,
  getStreak,
  getDashboardStats,
  getModulesByCourse,
  getModuleById,
  unlockNextModule,
  unlockAssessment,
  updateVideoProgress,
  seekVideo,
  completeVideo,
  getAssessmentStatus,
  canAttemptAssessment,
  getAssessmentQuestions,
  submitAssessment,
  getModuleAssessments,
  getAssessmentDetails,
  checkModuleCompletion,
  checkAssessmentUnlock,
  submitAssessmentAnswer,
  unlockNextModuleIfAvailable,
  getVideosByModule,
  getProfile,
  checkoutCart,
  getStreakOverview,
  getStreakDayDetails,
  getMonthStreak,
  advancedSearchCourses,
  getPopularTags,
  getCoursesByTag,
  getSearchSuggestions,
  unlockVideoForUser,
  isModuleUnlocked,
  getUserVideoProgress,
  markVideoAsWatched
};