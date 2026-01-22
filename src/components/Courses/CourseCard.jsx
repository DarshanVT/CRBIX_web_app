import { useState, useEffect, useRef } from "react";
import { Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../Navbar/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Login/AuthContext";
import { HiHeart } from "react-icons/hi";
import { useFavorites } from "../Navbar/FavoritesContext";

export default function CourseCard({ course, onEnroll }) {
  const { isAuthenticated, openLogin } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const cardRef = useRef(null);

  const [isHoverOpen, setIsHoverOpen] = useState(false);
  const [hoverLeft, setHoverLeft] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  /* ---------------- HANDLE CLICK ---------------- */
  const handleCardClick = () => {
    // On mobile, go directly to course page
    if (window.innerWidth <= 768) {
      navigate(`/course/${course.id}`);
    } else {
      navigate(`/course/${course.id}`);
    }
  };

  /* ---------------- HOVER POSITION & MOBILE DETECTION ---------------- */
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };

    const handleResize = () => {
      checkMobile();
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      setHoverLeft(rect.right + 360 > window.innerWidth);
    };

    checkMobile();
    handleResize();
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ---------------- TOUCH HANDLERS FOR MOBILE ---------------- */
  useEffect(() => {
    const handleTouchOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setIsHoverOpen(false);
      }
    };

    if (isHoverOpen) {
      document.addEventListener("touchstart", handleTouchOutside);
    }

    return () => {
      document.removeEventListener("touchstart", handleTouchOutside);
    };
  }, [isHoverOpen]);

  /* ---------------- RENDER ---------------- */
  return (
    <div
      ref={cardRef}
      className="relative"
      onMouseEnter={() => !isMobile && setIsHoverOpen(true)}
      onMouseLeave={() => !isMobile && setIsHoverOpen(false)}
      onTouchStart={() => isMobile && setIsHoverOpen(!isHoverOpen)}
    >
      {/* ================= CARD ================= */}
      <motion.div
        whileHover={!isMobile ? { y: -6, scale: 1.03 } : {}}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-full max-w-[260px] mx-auto bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-xl dark:shadow-gray-900/50 cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="relative overflow-hidden">
          <img
            src={image}
            alt={course.title}
            className="h-36 sm:h-40 md:h-[160px] w-full object-cover transition-transform duration-500 hover:scale-110"
            loading="lazy"
          />

          {/* FAVORITE */}
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-1 rounded-full transition-colors ${
              isFavorite
                ? "text-red-500 bg-white/80 dark:bg-gray-900/80"
                : "text-gray-300 dark:text-gray-600 hover:text-red-500 bg-white/80 dark:bg-gray-900/80"
            }`}
          >
            <HiHeart size={18} className="sm:w-5 sm:h-5" />
          </button>

          {/* PURCHASED BADGE */}
          {isPurchased && (
            <span className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-1 sm:px-3 text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">
              Purchased
            </span>
          )}

          {/* DISCOUNT BADGE */}
          {course.originalPrice && !isPurchased && (
            <span className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded">
              Save {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}%
            </span>
          )}
        </div>

        <div className="p-3 sm:p-4 space-y-1.5 sm:space-y-2">
          <h3 className="font-semibold text-xs sm:text-sm line-clamp-2 text-gray-800 dark:text-gray-200">
            {course.title}
          </h3>

          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {course.instructor || course.author || "CDax"}
          </p>

          <div className="flex items-center gap-1 text-xs">
            <span className="font-semibold text-yellow-600 dark:text-yellow-500">
              {course.rating ?? 4.5}
            </span>
            <Star size={12} className="sm:w-3.5 sm:h-3.5" fill="#fbbf24" stroke="none" />
            <span className="text-gray-400 dark:text-gray-500">
              ({course.reviews ?? "1k+"})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-gray-800 dark:text-white">
                ₹{course.price ?? 0}
              </span>
              {course.originalPrice && (
                <span className="text-xs line-through text-gray-400 dark:text-gray-500">
                  ₹{course.originalPrice}
                </span>
              )}
            </div>

            {/* ADD TO CART BUTTON FOR MOBILE */}
            {!isPurchased && (
              <button
                onClick={handlePrimaryAction}
                className="sm:hidden px-3 py-1 text-xs bg-blue-600 text-white rounded-lg font-medium"
              >
                Add
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* ================= HOVER CARD (Desktop only) ================= */}
      {!isMobile && (
        <AnimatePresence>
          {isHoverOpen && (
            <motion.div
              initial={{ opacity: 0, x: hoverLeft ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: hoverLeft ? -20 : 20 }}
              className={`hidden lg:block absolute top-0 ${
                hoverLeft ? "right-full -mr-4" : "left-full ml-4"
              } z-50 w-[340px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl dark:shadow-gray-900/70 p-4 border border-gray-200 dark:border-gray-700`}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={image}
                alt={course.title}
                className="w-full h-40 object-cover rounded-md mb-3"
              />

              <h4 className="font-bold text-sm mb-2 line-clamp-2 text-gray-800 dark:text-white">
                {course.title}
              </h4>

              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-2">
                <span>{course.level || "All Levels"}</span>
                <span>•</span>
                <span>{course.duration || "Lifetime access"}</span>
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                {course.description ||
                  "Learn with industry experts and real-world projects."}
              </p>

              <div className="space-y-2">
                <button
                  onClick={handlePrimaryAction}
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition-colors"
                >
                  {isPurchased ? "Start Learning" : "Add to Cart"}
                </button>
                
                {!isPurchased && (
                  <button
                    onClick={() => navigate(`/course/${course.id}`)}
                    className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    View Details
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* ================= MOBILE OVERLAY (Touch devices) ================= */}
      {isMobile && isHoverOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={image}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <button
                onClick={() => setIsHoverOpen(false)}
                className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">
                {course.title}
              </h3>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <span className="flex items-center gap-1">
                  <Star size={16} fill="#fbbf24" />
                  {course.rating} ({course.reviews})
                </span>
                <span>•</span>
                <span>{course.level || "All Levels"}</span>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-6">
                {course.description || "No description available."}
              </p>

              <div className="space-y-3">
                <button
                  onClick={handlePrimaryAction}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
                >
                  {isPurchased ? "Start Learning" : "Add to Cart - ₹" + course.price}
                </button>
                
                <button
                  onClick={() => {
                    setIsHoverOpen(false);
                    navigate(`/course/${course.id}`);
                  }}
                  className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-medium"
                >
                  View Full Details
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}