import CourseCard from "./CourseCard";
import { useAuth } from "../Login/AuthContext";
import { useEffect, useState } from "react";
import { getCourses} from "../../Api/course.api";
import { useNavigate } from "react-router-dom";

export default function CourseGridSection() {
  const { user, isAuthenticated, openLogin } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getCourses(
          isAuthenticated ? user?.id : null
        );

        const mapped = (data || []).map((c) => ({
          id: c.id,
          title: c.title,
          image: c.thumbnailUrl
            ? c.thumbnailUrl.startsWith("http")
              ? c.thumbnailUrl
              : `https://cdaxx-backend.onrender.com/${c.thumbnailUrl.replace(/^\/?/, "")}`
            : "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800",
          price: c.effectivePrice || c.price,
          originalPrice: c.hasDiscount ? c.price : null,
          rating: c.rating ?? 4.6,
          reviews: (c.totalRatings?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")) ?? "2,500",
          purchased: c.isSubscribed === true,
          badge: c.isSubscribed ? "Enrolled" : (c.hasDiscount ? `Save ${Math.round(c.discountPercentage || 0)}%` : "Bestseller"),
          author: c.instructor ?? "CDax Professionals",
          modules: c.modules ?? [],
          description: c.description ?? "",
          level: c.level,
          duration: c.formattedDuration,
          category: c.category,
        }));
        setCourses(mapped);
      } catch (err) {
        console.error("Error loading courses:", err);
        setError("Failed to load courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [isAuthenticated, user?.id]);

  const handleEnroll = (course) => {
    if (!isAuthenticated) {
      openLogin();
      return;
    }

    if (course.purchased) {
      navigate(`/course/${course.id}`);
      return;
    }

    navigate(`/course/${course.id}`);
  };

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-700 h-40 md:h-48 rounded-t-xl"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center py-10">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
      <div className="mb-6 md:mb-10">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-900 dark:text-white font-bold mb-2 md:mb-3">
          Skills to transform your career and life
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          From critical skills to technical topics, explore top courses.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onEnroll={() => handleEnroll(course)}
          />
        ))}
      </div>

      {courses.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No courses available at the moment.</p>
        </div>
      )}
    </section>
  );
}