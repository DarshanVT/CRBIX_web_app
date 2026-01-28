import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiShoppingCart, HiStar, HiClock } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ReminderPopup = ({ 
  isOpen, 
  course, 
  onDismiss, 
  onPurchase,
  onDismissPermanently 
}) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(10); // 30 seconds to auto-dismiss

  // Auto-dismiss timer
  useEffect(() => {
    if (!isOpen || !course) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onDismiss(course.id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, course, onDismiss]);

  // Reset timer when popup opens
  useEffect(() => {
    if (isOpen && course) {
      setTimeLeft(30);
    }
  }, [isOpen, course]);

  if (!isOpen || !course) return null;

  const handlePurchaseClick = () => {
    onPurchase(course.id);
    navigate(`/course/${course.id}`);
  };

  const handleViewDetails = () => {
    onDismiss(course.id);
    navigate(`/course/${course.id}`);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-start justify-end p-4 pointer-events-none"
      >
        <motion.div
          initial={{ opacity: 0, y: -20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -20, x: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative pointer-events-auto w-full max-w-md"
        >
          {/* Main Popup Card */}
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header with auto-dismiss timer */}
            <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white text centre">
                    Course Reminder
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => onDismiss(course.id)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                aria-label="Close reminder"
              >
                <HiX className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  {course.image ? (
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <HiStar className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-gray-800 dark:text-white mb-1 line-clamp-2">
                    {course.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    You favorited this course! Ready to start learning?
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                      Favorited
                    </span>
                    <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full">
                      Not Purchased
                    </span>
                    {course.price && (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                        ₹{course.price}
                      </span>
                    )}
                  </div>
                </div>
              </div>

            
              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handlePurchaseClick}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <HiShoppingCart className="w-5 h-5" />
                  Purchase Now
                </button>

                <button
                  onClick={handleViewDetails}
                  className="w-full py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  View Course Details
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => onDismissPermanently(course.id)}
                    className="flex-1 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors border border-gray-300 dark:border-gray-700 rounded-lg"
                  >
                    Don't remind again
                  </button>
                  
                </div>
              </div>
            </div>  
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-2 -right-2 w-24 h-24 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5 rounded-full blur-xl -z-10" />
          <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-r from-yellow-500/10 to-pink-500/10 dark:from-yellow-500/5 dark:to-pink-500/5 rounded-full blur-xl -z-10" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReminderPopup;