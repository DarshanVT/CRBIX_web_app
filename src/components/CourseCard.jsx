import { useState, useEffect, useRef } from "react";
import { Star, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { HiHeart } from "react-icons/hi";
import { useFavorites } from "./FavoritesContext";


export default function CourseCard({ course, index }) {
  const { openLogin, isAuthenticated } = useAuth();
  const [isHoverOpen, setIsHoverOpen] = useState(false);
  const [hoverLeft, setHoverLeft] = useState(false);
  const cardRef = useRef(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // FAVORITES STATE
    const { favorites, toggleFavorite } = useFavorites();
  const isFavorite = favorites.some((c) => c.id === course.id);

  // On component mount, check if this course is in favorites
  // useEffect(() => {
  //   const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  //   setIsFavorite(favorites.some((c) => c.id === course.id));
  // }, [course.id]);

  // Toggle favorite status
 const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) return openLogin();
    toggleFavorite(course);
  };

  // Hover position calculation
  useEffect(() => {
    const handleResize = () => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      setHoverLeft(rect.right + 360 + 16 > viewportWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative"
      onMouseEnter={() => setIsHoverOpen(true)}
      onMouseLeave={() => setIsHoverOpen(false)}
    >
      {/* ================= CARD ================= */}
      <motion.div
        whileHover={{ y: -6, scale: 1.03 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-[260px] sm:w-[220px] md:w-[240px] lg:w-[260px] bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl cursor-pointer relative"
        onClick={() => navigate(`/course/${course.id}`)}
      >
        {/* IMAGE */}
        <div className="relative overflow-hidden">
          <img
            src={course.image}
            alt={course.title}
            className="h-[160px] w-full object-cover transition-transform duration-500 hover:scale-110"
          />
          {course.badge && (
            <span className="absolute top-3 left-3 px-3 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-900">
              {course.badge}
            </span>
          )}

          {/* HEART ICON */}
<button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 p-1 rounded-full transition-colors ${
            isFavorite ? "text-red-500" : "text-gray-300 hover:text-red-500"
          }`}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <HiHeart size={22} />
        </button>
        </div>

        {/* CONTENT */}
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-sm line-clamp-2 hover:text-blue-600">
            {course.title}
          </h3>
          <p className="text-xs text-gray-500">{course.author}</p>
          <div className="flex items-center gap-1 text-xs">
            <span className="font-semibold text-yellow-600">{course.rating}</span>
            <Star size={14} fill="#fbbf24" stroke="none" />
            <span className="text-gray-400">({course.reviews})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">₹{course.price}</span>
            <span className="text-xs line-through text-gray-400">{course.originalPrice}</span>
          </div>
        </div>
      </motion.div>

      {/* ================= HOVER DETAILS ================= */}
      <AnimatePresence>
        {isHoverOpen && (
          <motion.div
            initial={{ opacity: 0, x: hoverLeft ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: hoverLeft ? -20 : 20 }}
            className={`absolute top-0 ${
              hoverLeft ? "right-full -mr-4" : "left-full ml-4"
            } z-50 w-[340px] sm:w-[300px] md:w-[320px] bg-white rounded-xl shadow-2xl p-4`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Hover Image */}
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-40 object-cover rounded-md mb-3"
            />

            <h4 className="font-bold text-sm mb-1 line-clamp-2">
              {course.title}
            </h4>

            <div className="flex items-center gap-2 text-xs mb-2">
              {course.badge && (
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-semibold">
                  {course.badge}
                </span>
              )}
              <span className="text-gray-500">
                {course.updated || "Updated recently"}
              </span>
            </div>

            <p className="text-xs text-gray-600 mb-2">
              {course.hours || "40+ hours"} • {course.level || "All Levels"} •
              Subtitles
            </p>

            <p className="text-sm text-gray-700 mb-3">
              {course.description ||
                "Master this course with real-world projects and practical learning."}
            </p>

            {/* What you'll learn */}
            {course.learnings && (
              <ul className="space-y-2 mb-4">
                {course.learnings.slice(0, 3).map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <Check size={16} className="text-green-600 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}

            <button
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
              onClick={(e) => {
                e.stopPropagation();

                if (!isAuthenticated) {
                  openLogin();
                  return;
                }

                addToCart(course);
                navigate("/cart");
              }}
            >
              Add to cart
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
