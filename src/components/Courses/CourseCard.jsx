import { useState, useEffect, useRef } from "react";
import { Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../Navbar/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Login/AuthContext";
import { HiHeart } from "react-icons/hi";
import { useFavorites } from "../Navbar/FavoritesContext";

export default function CourseCard({ course }) {
  const { isAuthenticated, openLogin } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const cardRef = useRef(null);

  const [isHoverOpen, setIsHoverOpen] = useState(false);
  const [hoverLeft, setHoverLeft] = useState(false);

  /* ---------------- FAVORITES ---------------- */
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorite = favorites.some(
    (fav) => fav.courseId === course.id
  );

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) return openLogin();
    toggleFavorite(course.id);
  };

  /* ---------------- PURCHASE STATE ---------------- */
  const isPurchased =
    Boolean(course.purchased) || Boolean(course.isPurchased);

  /* ---------------- IMAGE SAFE ---------------- */
  const image =
    course.image ||
    course.thumbnailUrl ||
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800";

  /* ---------------- ADD TO CART ---------------- */
  const handlePrimaryAction = (e) => {
    e.stopPropagation();

    if (!isAuthenticated) return openLogin();

    if (isPurchased) {
      navigate(`/course/${course.id}`);
      return;
    }

    addToCart({
      id: course.id,
      title: course.title,
      price: course.price ?? 0,
      image,
    });

    navigate("/cart");
  };

  /* ---------------- HOVER POSITION ---------------- */
  useEffect(() => {
    const handleResize = () => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      setHoverLeft(rect.right + 360 > window.innerWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () =>
      window.removeEventListener("resize", handleResize);
  }, []);

  /* ---------------- RENDER ---------------- */
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
        className="w-[260px] bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl cursor-pointer"
        onClick={() => navigate(`/course/${course.id}`)}
      >
        <div className="relative overflow-hidden">
          <img
            src={image}
            alt={course.title}
            className="h-[160px] w-full object-cover transition-transform duration-500 hover:scale-110"
          />

          {/* FAVORITE */}
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-3 right-3 p-1 rounded-full transition-colors ${
              isFavorite
                ? "text-red-500"
                : "text-gray-300 hover:text-red-500"
            }`}
          >
            <HiHeart size={22} />
          </button>

          {/* PURCHASED BADGE */}
          {isPurchased && (
            <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded">
              Purchased
            </span>
          )}
        </div>

        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-sm line-clamp-2 hover:text-blue-600">
            {course.title}
          </h3>

          <p className="text-xs text-gray-500">
            {course.instructor || course.author || "CDax"}
          </p>

          <div className="flex items-center gap-1 text-xs">
            <span className="font-semibold text-yellow-600">
              {course.rating ?? 4.5}
            </span>
            <Star size={14} fill="#fbbf24" stroke="none" />
            <span className="text-gray-400">
              ({course.reviews ?? "1k+"})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">
              ₹{course.price ?? 0}
            </span>
            {course.originalPrice && (
              <span className="text-xs line-through text-gray-400">
                ₹{course.originalPrice}
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* ================= HOVER CARD ================= */}
      <AnimatePresence>
        {isHoverOpen && (
          <motion.div
            initial={{ opacity: 0, x: hoverLeft ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: hoverLeft ? -20 : 20 }}
            className={`absolute top-0 ${
              hoverLeft ? "right-full -mr-4" : "left-full ml-4"
            } z-50 w-[340px] bg-white rounded-xl shadow-2xl p-4`}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={image}
              alt={course.title}
              className="w-full h-40 object-cover rounded-md mb-3"
            />

            <h4 className="font-bold text-sm mb-2 line-clamp-2">
              {course.title}
            </h4>

            <p className="text-xs text-gray-600 mb-3">
              {course.level || "All Levels"} • Lifetime access
            </p>

            <p className="text-sm text-gray-700 mb-4 line-clamp-3">
              {course.description ||
                "Learn with industry experts and real-world projects."}
            </p>

            <button
              onClick={handlePrimaryAction}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
            >
              {isPurchased ? "Start Learning" : "Add to Cart"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
