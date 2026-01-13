// src/api/certificates.api.js
import api from "./api";

/**
 * Get user's certificates (frontend-generated based on completed courses)
 * This is a frontend-only implementation
 */
export const getUserCertificates = async () => {
  try {
    // First, get user's enrolled courses
    const response = await api.get('/user/courses');
    const courses = response.data.courses || response.data;
    
    // Filter courses with 100% completion and generate certificates
    const completedCourses = courses.filter(course => 
      course.progressPercentage === 100 || course.progressPercent === 1
    );
    
    // Generate certificate data for each completed course
    const certificates = completedCourses.map(course => ({
      id: course.id,
      courseId: course.id,
      courseTitle: course.title,
      userName: "User Name", // Will be fetched from profile
      issueDate: new Date().toISOString().split('T')[0],
      certificateId: `CERT-${course.id}-${Date.now()}`,
      instructor: course.instructor || "CDaX Instructor",
      thumbnailUrl: course.thumbnailUrl,
      progressPercentage: course.progressPercentage || (course.progressPercent * 100)
    }));
    
    return certificates;
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return [];
  }
};