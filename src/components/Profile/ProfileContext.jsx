import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../Login/AuthContext";
import { getDashboardCourses } from "../../Api/course.api";
import api from "../../Api/api";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const [profile, setProfile] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // STREAK STATES (Month-based like Flutter)
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedCourseTitle, setSelectedCourseTitle] = useState(null);
  const [monthStreakData, setMonthStreakData] = useState(null);
  const [streakData, setStreakData] = useState(null); // For backward compatibility
  const [loadingStreak, setLoadingStreak] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthCache, setMonthCache] = useState({});
  const [streakError, setStreakError] = useState(null);

  const [loading, setLoading] = useState(false);

  const capitalize = (str = "") =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  /* ================= PROFILE + COURSES ================= */

  const fetchProfile = async () => {
    if (!isAuthenticated || !user) return;

    setLoading(true);

    const userId = user.id || user._id;

    setProfile({
      id: userId,
      name: `${capitalize(user.firstName)} ${capitalize(user.lastName)}`,
      email: user.email,
      phone: user.phoneNumber || "",
      subscribed: false,
    });

    const courses = await getDashboardCourses(userId);
    const enrolled = courses.filter((c) => c.isSubscribed === true);
    setEnrolledCourses(enrolled);

    if (enrolled.length > 0) {
      const firstCourse = enrolled[0];
      setSelectedCourseId(firstCourse.id);
      setSelectedCourseTitle(firstCourse.title);
    }

    setLoading(false);
  };

  const updateProfile = async (updatedProfile) => {
    try {
      setLoading(true);
      
      setProfile((prev) => ({
        ...prev,
        ...updatedProfile,
        avatar: updatedProfile.avatar || prev?.avatar,
      }));
      
    } catch (err) {
      console.error("UPDATE PROFILE ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= STREAK FUNCTIONS ================= */

  // For backward compatibility - 30-day streak
  const loadCourseStreak = async (courseId) => {
    const uid = user?.id || user?._id;
    if (!courseId || !uid) return;

    try {
      setLoadingStreak(true);

      const res = await api.get("/profile/streak", {
        params: {
          userId: uid,
          courseId: courseId,
        }
      });

      const apiDays = res.data?.last30Days || [];

      // MAP for quick lookup
      const dayMap = {};
      apiDays.forEach(d => {
        dayMap[d.date] = d;
      });

      // ALWAYS generate last 30 days
      const last30Days = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const isoDate = date.toISOString().split("T")[0];

        last30Days.push(
          dayMap[isoDate] || {
            date: isoDate,
            isActiveDay: false,
          }
        );
      }

      const data = {
        ...res.data,
        last30Days,
      };

      setStreakData(data);
      setMonthStreakData(data); // Also set to monthStreakData for new components

      console.log("✅ 30-DAY STREAK LOADED:", data);
      
    } catch (err) {
      console.error("STREAK ERROR:", err);
      setStreakData(null);
      setMonthStreakData(null);
    } finally {
      setLoadingStreak(false);
    }
  };

  // New function: Load month streak (like Flutter)
  const loadMonthStreak = async (courseId, month = null) => {
    const uid = user?.id || user?._id;
    if (!courseId || !uid) {
      setStreakError("User or course not found");
      return;
    }

    try {
      setLoadingStreak(true);
      setStreakError(null);

      const targetMonth = month || currentMonth;
      const year = targetMonth.getFullYear();
      const monthNum = targetMonth.getMonth() + 1;
      
      // Create cache key
      const cacheKey = `${year}-${monthNum}-${courseId}`;
      
      // Check cache first
      if (monthCache[cacheKey]) {
        console.log("📦 Using cached streak data for", cacheKey);
        setMonthStreakData(monthCache[cacheKey]);
        setStreakData(monthCache[cacheKey]); // For backward compatibility
        return;
      }

      // Try month endpoint
      try {
        const res = await api.get(`/streak/course/${courseId}/month`, {
          params: {
            userId: uid,
            year: year,
            month: monthNum
          }
        });

        if (res.data) {
          const processedData = processMonthData(res.data, targetMonth);
          
          // Update cache
          setMonthCache(prev => ({
            ...prev,
            [cacheKey]: processedData
          }));
          
          setMonthStreakData(processedData);
          setStreakData(processedData); // For backward compatibility
        }
      } catch (monthErr) {
        console.log("⚠️ Month endpoint not available, falling back to 30-day streak");
        // Fallback to 30-day streak
        await loadCourseStreak(courseId);
      }

    } catch (err) {
      console.error("MONTH STREAK ERROR:", err);
      setStreakError("Failed to load streak data");
      setMonthStreakData(null);
    } finally {
      setLoadingStreak(false);
    }
  };

  // Process month data
  const processMonthData = (data, month) => {
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    
    let monthDays = data.monthDays || data.last30Days || [];
    
    // Fill missing days if needed
    if (monthDays.length < lastDay.getDate()) {
      monthDays = fillMissingDays(monthDays, firstDay, lastDay);
    }
    
    // Calculate active days
    const activeDays = monthDays.filter(day => day.isActiveDay).length;
    
    return {
      ...data,
      monthDays,
      activeDaysInMonth: activeDays,
      totalDaysInMonth: lastDay.getDate(),
      monthStartDate: firstDay.toISOString(),
      monthEndDate: lastDay.toISOString(),
      monthName: month.toLocaleString('default', { month: 'long' }),
      year: month.getFullYear()
    };
  };

  // Fill missing days in month
  const fillMissingDays = (monthDays, firstDay, lastDay) => {
    const dayMap = {};
    monthDays.forEach(day => {
      const date = new Date(day.date);
      dayMap[date.getDate()] = day;
    });

    const filledDays = [];
    let currentDate = new Date(firstDay);
    
    while (currentDate <= lastDay) {
      const dayNumber = currentDate.getDate();
      const dateStr = currentDate.toISOString().split('T')[0];
      
      if (dayMap[dayNumber]) {
        filledDays.push(dayMap[dayNumber]);
      } else {
        filledDays.push({
          date: dateStr,
          isActiveDay: false,
          progressPercentage: 0,
          watchedSeconds: 0,
          videoDetails: [],
          colorCode: "#E5E7EB"
        });
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return filledDays;
  };

  // Clear cache when course changes
  const clearStreakCache = () => {
    setMonthCache({});
    setMonthStreakData(null);
    setStreakData(null);
  };

  /* ================= MONTH NAVIGATION ================= */

  // Change month
  const changeMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + direction);
      return newMonth;
    });
  };

  // Load streak for current month and selected course
  const loadStreakForCurrentMonth = () => {
    if (selectedCourseId) {
      loadMonthStreak(selectedCourseId, currentMonth);
    }
  };

  /* ================= AUTO LOAD STREAK ================= */

  // When selected course changes
  useEffect(() => {
    if (selectedCourseId && user) {
      loadCourseStreak(selectedCourseId); // For backward compatibility
    }
  }, [selectedCourseId, user]);

  // When month changes (for month view)
  useEffect(() => {
    if (selectedCourseId && user) {
      loadMonthStreak(selectedCourseId, currentMonth);
    }
  }, [currentMonth]);

  // Load profile on mount
  useEffect(() => {
    fetchProfile();
  }, [user]);

  const clearProfile = () => {
    setProfile(null);
    setEnrolledCourses([]);
    setStreakData(null);
    setMonthStreakData(null);
    setSelectedCourseId(null);
    setMonthCache({});
    setStreakError(null);
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        enrolledCourses,
        loading,

        // STREAK - For backward compatibility
        streakData,
        loadingStreak,
        selectedCourseId,
        setSelectedCourseId: (courseId) => {
          const course = enrolledCourses.find(c => c.id === courseId);
          setSelectedCourseId(courseId);
          setSelectedCourseTitle(course?.title || null);
          clearStreakCache();
        },
        loadCourseStreak, // ✅ This function is now available

        // NEW - Month-based streak (like Flutter)
        monthStreakData,
        streakError,
        selectedCourseTitle,
        currentMonth,
        changeMonth,
        loadStreakForCurrentMonth,
        clearStreakCache,
        loadMonthStreak,

        fetchProfile,
        updateProfile,
        clearProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);