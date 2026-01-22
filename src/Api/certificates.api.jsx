import api from "./api";

export const getUserCertificates = async () => {
  try {
    const response = await api.get('/user/courses');
    const courses = response.data.courses || response.data;

    const completedCourses = courses.filter(course => 
      course.progressPercentage === 100 || course.progressPercent === 1
    );
 
    const certificates = completedCourses.map(course => ({
      id: course.id,
      courseId: course.id,
      courseTitle: course.title,
      userName: "User Name", 
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