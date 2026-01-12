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

/* ==================== ASSESSMENT ==================== */

export const canAttemptAssessment = async (assessmentId) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return false;

    const res = await api.get(`/course/assessment/can-attempt`, {
      params: { userId: userId, assessmentId: assessmentId },
    });
    return res.data?.canAttempt ?? false;
  } catch (err) {
    console.error("Assessment check failed:", err);
    return false;
  }
};

export const getAssessmentQuestions = async (assessmentId) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return null;

    const res = await api.get(`/course/assessment/questions`, {
      params: { userId: userId, assessmentId: assessmentId },
    });
    return res.data;
  } catch (err) {
    console.error("Assessment questions fetch failed:", err);
    return null;
  }
};

export const submitAssessment = async (assessmentId, answers) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return null;

    const res = await api.post(`/course/assessment/submit`, answers, {
      params: { userId: userId, assessmentId: assessmentId },
    });
    return res.data;
  } catch (err) {
    console.error("Assessment submit failed:", err);
    return null;
  }
};

/* ==================== VIDEO PROGRESS ==================== */

// 1️⃣ AUTO SAVE PROGRESS (play / pause / interval)
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

// 2️⃣ SEEK / FORWARD JUMP
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

// 3️⃣ VIDEO COMPLETE (ALREADY CONNECTED TO MODULE FLOW)
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


