import api from "./api";

/* ==================== COURSES ==================== */

export const getCourses = async (userId) => {
  try {
    const res = await api.get("/api/courses", {
      params: userId ? { userId } : {},
    });
    return res.data?.data ?? [];
  } catch (err) {
    console.error("Failed to fetch courses:", err);
    return [];
  }
};

// Dashboard courses
export const getDashboardCourses = async (userId) => {
  try {
    const res = await api.get("/api/dashboard/courses", {
      params: { userId },
    });
    return res.data?.data ?? [];
  } catch (err) {
    console.error("Dashboard fetch failed:", err);
    return [];
  }
};

// MOST IMPORTANT API
export const getCourseById = async (courseId, userId) => {
  try {
    const res = await api.get(`/api/courses/${courseId}`, {
      params: userId ? { userId } : {}, // 👈 IMPORTANT
    });

    return res.data?.data ?? null;
  } catch (err) {
    console.error("Course fetch failed:", err);
    return null;
  }
};

/* ==================== PURCHASE ==================== */

export const purchaseCourse = async (userId, courseId) => {
  try {
    const res = await api.post("/api/purchase", null, {
      params: { userId, courseId },
    });
    return { success: true, message: res.data?.message };
  } catch (err) {
    console.error("Purchase failed:", err);
    return { success: false, message: "Purchase failed" };
  }
};

/* ==================== VIDEO PROGRESS ==================== */

// ✅ FIXED: backend-compatible video completion
export const completeVideo = async (
  userId,
  courseId,
  moduleId,
  videoId
) => {
  try {
    const res = await api.post(
      "/api/modules/" + moduleId + "/unlock-next",
      null,
      {
        params: {
          userId,
          courseId,
        },
      }
    );

    return { success: res.data?.success ?? true };
  } catch (err) {
    console.error("Video complete failed:", err);
    return { success: false };
  }
};

/* ==================== ASSESSMENT ==================== */

export const canAttemptAssessment = async (userId, assessmentId) => {
  try {
    const res = await api.get(
      "/api/course/assessment/can-attempt",
      { params: { userId, assessmentId } }
    );
    return res.data?.canAttempt ?? false;
  } catch (err) {
    console.error("Assessment check failed:", err);
    return false;
  }
};

export const getAssessmentQuestions = async (userId, assessmentId) => {
  try {
    const res = await api.get(
      "/api/course/assessment/questions",
      { params: { userId, assessmentId } }
    );
    return res.data;
  } catch (err) {
    console.error("Assessment questions fetch failed:", err);
    return null;
  }
};

export const submitAssessment = async (
  userId,
  assessmentId,
  answers
) => {
  try {
    const res = await api.post(
      "/api/course/assessment/submit",
      answers,
      { params: { userId, assessmentId } }
    );
    return res.data;
  } catch (err) {
    console.error("Assessment submit failed:", err);
    return null;
  }
};
