import api from "./api";


export const updateUserProfile = async (userId, payload) => {
  try {
    const res = await api.put(
      `/api/users/${userId}`,
      payload
    );
    return res.data;
  } catch (err) {
    console.error("Profile update failed", err);
    throw err;
  }
};

/* ================= SUBSCRIBED COURSES ================= */
export const getSubscribedCourses = async (userId) => {
  //  Guard: user not logged in
  if (!userId) {
    console.warn("getSubscribedCourses called without userId");
    return [];
  }

  try {
    const res = await api.get(`/api/courses/subscribed/${userId}`);
    return res.data ?? [];
  } catch (err) {
    console.error("Subscribed courses error", err);
    return [];
  }
};

/* ================= STREAK DATA ================= */
export const getCourseStreak = async (courseId, userId) => {
  // 🔒 Guard: user not logged in
  if (!userId || !courseId) {
    console.warn("getCourseStreak called without userId/courseId");
    return null;
  }

  try {
    const res = await api.get(
      `/api/streak/course/${courseId}`,
      { params: { userId } }
    );
    return res.data ?? null;
  } catch (err) {
    console.error("Streak fetch error", err);
    return null;
  }
};
