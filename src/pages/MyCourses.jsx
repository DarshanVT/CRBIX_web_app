import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardCourses } from "../Api/course.api";
import { useAuth } from "../components/Login/AuthContext";

export default function MyCourses() {
  const { user, isAuthenticated, openLogin } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    setLoading(true);

    getDashboardCourses(user.id)
      .then((allCourses) => {
        const enrolled = allCourses.filter(
          (c) => c.isSubscribed === true
        );
        setCourses(enrolled);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isAuthenticated, user?.id]);

  /* ================= STATES ================= */

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

  /* ================= UI ================= */

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Courses</h1>

      <div className="space-y-4">
        {courses.map((course) => {
          const progress =
            course.progressPercentage ??
            course.progressPercent ??
            0;

          return (
            <div
              key={course.id}
              onClick={() =>
                navigate(`/course/${course.id}`)
              }
              className="w-full bg-white rounded-xl shadow p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition"
            >
              {/* Thumbnail */}
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                className="w-36 h-20 object-cover rounded-lg"
              />

              {/* Middle content */}
              <div className="flex-1">
                <h3 className="font-semibold text-sm">
                  {course.title}
                </h3>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-blue-600 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    {progress}% completed
                  </p>
                </div>
              </div>

              {/* Right side */}
              <span className="text-sm text-blue-600 font-medium">
                Continue →
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
