// In MyCourses.jsx, update the useEffect and add useCallback:
import React, { useState, useEffect, useCallback } from 'react';
import CourseContent from '../components/Courses/CourseContent';
import CourseCard from '../components/Courses/CourseCard';
import { useAuth } from '../components/Login/AuthContext';
import * as courseApi from '../Api/course.api';

const MyCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserCourses = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      // Use getPurchasedCourses from your API
      const data = await courseApi.getPurchasedCourses(user.id);
      setCourses(data);
    } catch (error) {
      console.error('Error fetching user courses:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserCourses();
  }, [fetchUserCourses]);

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
  };

  if (selectedCourse && user) {
    return (
      <CourseContent 
        courseId={selectedCourse.id} 
      />
    );
  }

  return (
    <div className="my-courses-page">
      <h1>My Learning</h1>
      
      {loading ? (
        <div className="loading">Loading your courses...</div>
      ) : courses.length === 0 ? (
        <div className="no-courses">
          <p>You haven't enrolled in any courses yet.</p>
          <a href="/courses">Browse Courses</a>
        </div>
      ) : (
        <>
          <div className="course-grid">
            {courses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                onClick={() => handleCourseClick(course)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MyCourses;