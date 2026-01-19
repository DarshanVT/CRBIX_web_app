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

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);

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
        // FIX: Use isSubscribed field from API response
        purchased: c.isSubscribed === true,
        // Show "Enrolled" badge for purchased courses, otherwise show discount or bestseller
        badge: c.isSubscribed ? "Enrolled" : (c.hasDiscount ? `Save ${Math.round(c.discountPercentage || 0)}%` : "Bestseller"),
        author: c.instructor ?? "CDax Professionals",
        modules: c.modules ?? [],
        description: c.description ?? "",
        // Add additional fields that might be useful
        level: c.level,
        duration: c.formattedDuration,
        category: c.category,
      }));
      setCourses(mapped);
      setLoading(false);
    };

    loadCourses();
  }, [isAuthenticated, user?.id]);

  // Enroll / Open course
const handleEnroll = (course) => {
  if (!isAuthenticated) {
    openLogin();
    return;
  }

  // Already purchased → open course
  if (course.purchased) {
    navigate(`/course/${course.id}`);
    return;
  }

  // Not purchased → go to course details / cart
  navigate(`/course/${course.id}`);
};

  if (loading) {
    return <div className="text-center py-20">Loading courses...</div>;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-3">
        Skills to transform your career and life
      </h2>
      <p className="text-gray-600 mb-10">
        From critical skills to technical topics, explore top courses.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {courses.map((course, index) => (
          <CourseCard
            key={course.id}
            course={{
              ...course,
              image: course.image,
              onError: (e) =>
                (e.target.src =
                  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800"),
            }}
            index={index}
            onEnroll={() => handleEnroll(course)}
          />
        ))}
      </div>
    </section>
  );
}
