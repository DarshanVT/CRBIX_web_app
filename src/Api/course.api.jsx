// src/Api/course.api.js
import api from "./api";

/* -------------------- COURSES -------------------- */

export const getPublicCourses = async () => {
  try {
    const res = await api.get("/api/courses/public");
    return res.data;
  } catch (err) {
    console.error("Failed to fetch public courses:", err);
    return [];
  }
};

export const getCoursesForUser = async (userId) => {
  try {
    const res = await api.get("/api/courses", {
      params: { userId },
    });
    return res.data.data;
  } catch (err) {
    console.error("Failed to fetch user courses:", err);
    return [];
  }
};

export const getCourseById = async (courseId, userId) => {
  try {
    const res = await api.get(`/api/courses/${courseId}`, {
      params: { userId },
    });
    return res.data.data;
  } catch (err) {
    console.error("Failed to fetch course:", err);
    return null;
  }
};

/* -------------------- PURCHASE -------------------- */

export const purchaseCourse = async (userId, courseId) => {
  try {
    const res = await api.post("/api/purchase", null, {
      params: { userId, courseId },
    });
    return res.data;
  } catch (err) {
    console.error("Purchase failed:", err);
    return { message: "Purchase failed" };
  }
};

/* -------------------- VIDEO PROGRESS -------------------- */

export const unlockVideo = async (userId, videoId, courseId, moduleId) => {
  try {
    const res = await api.post(
      `/api/videos/${videoId}/unlock`,
      null,
      { params: { userId, courseId, moduleId } }
    );
    return res.data;
  } catch (err) {
    console.error("Unlock video failed:", err);
    return { success: false };
  }
};

export const completeVideo = async (userId, videoId, courseId, moduleId) => {
  try {
    const res = await api.post(
      `/api/videos/${videoId}/complete`,
      null,
      { params: { userId, courseId, moduleId } }
    );
    return res.data;
  } catch (err) {
    console.error("Complete video failed:", err);
    return { success: false };
  }
};
