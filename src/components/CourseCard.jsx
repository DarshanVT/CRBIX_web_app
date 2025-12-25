import { useState } from "react";
import { Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CourseCard({ course }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Card */}
      <motion.div
        whileHover={{ y: -8, scale: 1.05 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-[260px] bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl cursor-pointer group"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Image */}
        <div className="relative overflow-hidden">
          <img
            src={course.image}
            alt={course.title}
            className="h-[160px] w-full object-cover rounded-t-xl transform group-hover:scale-110 transition duration-500"
          />

          {course.badge && (
            <span
              className={`absolute top-3 left-3 px-3 py-1 rounded text-xs font-semibold ${
                course.badge === "Premium"
                  ? "bg-yellow-400 text-white"
                  : "bg-yellow-100 text-yellow-900"
              }`}
            >
              {course.badge}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 text-gray-800 group-hover:text-blue-600 transition">
            {course.title}
          </h3>

          <p className="text-xs text-gray-500">{course.author}</p>

          {/* Rating */}
          <div className="flex items-center gap-1 text-xs">
            <span className="font-semibold text-yellow-600">{course.rating}</span>
            <Star size={14} fill="#fbbf24" stroke="none" />
            <span className="text-gray-400">({course.reviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mt-1">
            <span className="font-bold text-sm text-gray-800">₹{course.price}</span>
            <span className="text-xs text-gray-400 line-through">{course.originalPrice}</span>
          </div>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-xl w-11/12 sm:w-3/4 md:w-1/2 p-6 relative"
              onClick={(e) => e.stopPropagation()} // Prevent modal close on inner click
            >
              {/* Close button */}
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-lg font-bold"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>

              {/* Course Image */}
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />

              {/* Course Details */}
              <h2 className="text-xl font-bold mb-2">{course.title}</h2>
              <p className="text-gray-600 mb-1">Author: {course.author}</p>
              <p className="text-yellow-500 font-semibold mb-1">
                Rating: {course.rating} ⭐ ({course.reviews})
              </p>
              <p className="text-gray-800 font-bold mb-2">
                Price: ₹{course.price}{" "}
                <span className="line-through text-gray-400">
                  {course.originalPrice}
                </span>
              </p>
              {course.badge && (
                <span className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
                  {course.badge}
                </span>
              )}

              {/* Enroll Button */}
              <button className="mt-4 w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition">
                Add To Cart
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
