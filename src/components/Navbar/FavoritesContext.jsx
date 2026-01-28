import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
} from "../../Api/favoriteApi";
import { isCoursePurchased } from "../../Api/course.api";
import { useAuth } from "../Login/AuthContext";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth(); 
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Reminder related states
  const [showReminder, setShowReminder] = useState(false);
  const [reminderCourse, setReminderCourse] = useState(null);
  const [reminderTimer, setReminderTimer] = useState(null);
  const [dismissedReminders, setDismissedReminders] = useState(new Set());
  const [lastReminderTime, setLastReminderTime] = useState(0);
  const [reminderCheckInterval, setReminderCheckInterval] = useState(10000); // 5 minutes = 300000ms

  // ================= LOAD FAVORITES =================
  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      setFavorites([]);
      return;
    }

    const loadFavorites = async () => {
      try {
        setLoading(true);
        const data = await getUserFavorites(user.id);
        setFavorites(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load favorites", err);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [isAuthenticated, user?.id]);

  // ================= REMINDER LOGIC =================
  const findCourseForReminder = useCallback(async () => {
    if (!isAuthenticated || !user?.id || favorites.length === 0) {
      return null;
    }

    // Filter out favorited courses that haven't been reminded recently
    const now = Date.now();
    
    // Check if enough time has passed since last reminder (5 minutes)
    if (now - lastReminderTime < reminderCheckInterval) {
      return null;
    }

    // Find a favorited course that hasn't been dismissed recently
    for (const favorite of favorites) {
      const courseId = favorite.courseId || favorite.id;
      
      // Skip if this reminder was dismissed recently (within last 24 hours)
      const lastDismissedTime = localStorage.getItem(`reminder_dismissed_${courseId}`);
      if (lastDismissedTime) {
        const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        if (now - parseInt(lastDismissedTime) < twentyFourHours) {
          continue;
        }
      }

      // Check if course is already purchased
      try {
        const isPurchased = await isCoursePurchased(courseId);
        
        if (!isPurchased) {
          return {
            id: courseId,
            title: favorite.title || favorite.courseTitle || "Your Favorited Course",
            price: favorite.price,
            image: favorite.image || favorite.thumbnailUrl,
            // Add more course details if available
          };
        }
      } catch (error) {
        console.error("Error checking purchase status:", error);
        // Continue to next course if there's an error
        continue;
      }
    }
    
    return null;
  }, [favorites, isAuthenticated, user?.id, lastReminderTime, reminderCheckInterval]);

  // ================= START REMINDER TIMER =================
  useEffect(() => {
    if (!isAuthenticated || favorites.length === 0) {
      return;
    }

    // Clear any existing timer
    if (reminderTimer) {
      clearInterval(reminderTimer);
    }

    // Start new timer to check every 5 minutes
    const timer = setInterval(async () => {
      const course = await findCourseForReminder();
      if (course) {
        setReminderCourse(course);
        setShowReminder(true);
        setLastReminderTime(Date.now());
        
        // Store that we showed this reminder
        localStorage.setItem(`reminder_shown_${course.id}`, Date.now().toString());
      }
    }, reminderCheckInterval);

    setReminderTimer(timer);

    // Cleanup on unmount
    return () => {
      if (reminderTimer) {
        clearInterval(reminderTimer);
      }
    };
  }, [isAuthenticated, favorites.length, findCourseForReminder, reminderCheckInterval]);

  // ================= HANDLE REMINDER DISMISS =================
  const handleDismissReminder = useCallback((courseId, permanently = false) => {
    setShowReminder(false);
    
    if (courseId) {
      if (permanently) {
        // Store dismissal time for 24 hours
        localStorage.setItem(`reminder_dismissed_${courseId}`, Date.now().toString());
      } else {
        // Store temporary dismissal (will show again in 5 minutes)
        localStorage.setItem(`reminder_shown_${courseId}`, Date.now().toString());
      }
    }
    
    // Reset reminder course
    setTimeout(() => {
      setReminderCourse(null);
    }, 300);
  }, []);

  // ================= HANDLE REMINDER PURCHASE CLICK =================
  const handleReminderPurchaseClick = useCallback((courseId) => {
    // Navigate to course page
    setShowReminder(false);
    
    // Store that user clicked to purchase
    localStorage.setItem(`reminder_purchase_clicked_${courseId}`, Date.now().toString());
    
    // You can add navigation logic here
    // Example: navigate(`/course/${courseId}`);
    console.log(`Navigate to purchase course: ${courseId}`);
    
    // Reset reminder course
    setTimeout(() => {
      setReminderCourse(null);
    }, 300);
  }, []);

  // ================= TOGGLE FAVORITE =================
  const toggleFavorite = async (courseId) => {
    if (!isAuthenticated || !user?.id) return;

    const exists = favorites.some(
      (fav) => fav.courseId === courseId
    );

    try {
      if (exists) {
        await removeFromFavorites(user.id, courseId);
        setFavorites((prev) =>
          prev.filter((fav) => fav.courseId !== courseId)
        );
        
        // Clear reminder dismissals when unfavorited
        localStorage.removeItem(`reminder_dismissed_${courseId}`);
        localStorage.removeItem(`reminder_shown_${courseId}`);
      } else {
        const response = await addToFavorites(user.id, courseId);

        // backend wrapper handling
        if (response?.alreadyFavorited) return;

        if (response?.favorite) {
          setFavorites((prev) => [...prev, response.favorite]);
          
          // Clear any previous dismissals for this course when re-favorited
          localStorage.removeItem(`reminder_dismissed_${courseId}`);
        }
      }
    } catch (err) {
      console.error("Favorite toggle failed", err);
    }
  };

  // ================= REMINDER SETTINGS =================
  const updateReminderInterval = (minutes) => {
    const newInterval = minutes * 60 * 1000; // Convert minutes to milliseconds
    setReminderCheckInterval(newInterval);
    
    // Store preference
    localStorage.setItem('reminder_interval', newInterval.toString());
    
    // Restart timer with new interval
    if (reminderTimer) {
      clearInterval(reminderTimer);
    }
  };

  // Load reminder interval preference on mount
  useEffect(() => {
    const savedInterval = localStorage.getItem('reminder_interval');
    if (savedInterval) {
      setReminderCheckInterval(parseInt(savedInterval));
    }
  }, []);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        loading,
        // Reminder related
        showReminder,
        reminderCourse,
        handleDismissReminder,
        handleReminderPurchaseClick,
        updateReminderInterval,
        reminderCheckInterval,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);