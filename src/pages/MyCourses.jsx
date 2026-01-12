import { useEffect, useState } from "react";

import CourseCard from "../components/Courses/CourseCard";
import { getSubscribedCourses } from "../Api/course.api";
import { useAuth } from "../components/Login/AuthContext";

export default function MyCourses() {
  const { user, isAuthenticated, openLogin } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    getSubscribedCourses(user.id)
      .then(res => {
        // same as Flutter
        const enriched = res.data.map(c => ({
          ...c,
          isPurchased: true,
        }));
        setCourses(enriched);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isAuthenticated, user?.id]);

  if (!isAuthenticated) {
    return (
      <div className="p-10 text-center">
        <button onClick={openLogin} className="btn-primary">
          Login to view your courses
        </button>
      </div>
    );
  }

  if (loading) return <p className="p-10">Loading...</p>;

  if (!courses.length) {
    return (
      <div className="p-10 text-center text-gray-500">
        You haven’t purchased any courses yet.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Courses</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
