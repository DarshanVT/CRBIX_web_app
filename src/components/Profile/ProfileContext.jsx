import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../Login/AuthContext";
import { getDashboardCourses } from "../../Api/course.api";
import api from "../../Api/api";
import {
  saveToLocalStorage,
  saveAvatarToLocal,
  getAvatarFromLocal,
  removeFromLocalStorage,
} from "../../utils/localStorageHelpers";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const [profile, setProfile] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedCourseTitle, setSelectedCourseTitle] = useState(null);
  const [monthStreakData, setMonthStreakData] = useState(null);
  const [streakData, setStreakData] = useState(null);
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
    const localAvatar = getAvatarFromLocal(userId);

    console.log(" Fetching profile for user:", userId);
    console.log(
      " Avatar from localStorage:",
      localAvatar ? "Found" : "Not found",
    );

    const profileData = {
      id: userId,
      name: `${capitalize(user.firstName)} ${capitalize(user.lastName)}`,
      email: user.email,
      phone: user.phoneNumber || "",
      subscribed: false,
      avatar: localAvatar,
    };

    setProfile(profileData);

    try {
      const courses = await getDashboardCourses(userId);
      const enrolled = courses.filter((c) => c.isSubscribed === true);
      setEnrolledCourses(enrolled);

      if (enrolled.length > 0) {
        const firstCourse = enrolled[0];
        setSelectedCourseId(firstCourse.id);
        setSelectedCourseTitle(firstCourse.title);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setEnrolledCourses([]);
    }

    setLoading(false);
  };

  const updateProfile = async (updatedProfile) => {
    try {
      setLoading(true);

      const userId = user.id || user._id;

      console.log(" Updating profile for user:", userId);

      if (updatedProfile.avatar && updatedProfile.avatar instanceof File) {
        console.log(" Saving new avatar to local storage");

        const base64Avatar = await saveAvatarToLocal(
          userId,
          updatedProfile.avatar,
        );

        setProfile((prev) => ({
          ...prev,
          name: updatedProfile.name || prev.name,
          phone: updatedProfile.phone || prev.phone,
          avatar: base64Avatar,
        }));

        console.log(" Avatar saved to localStorage");
      } else if (updatedProfile.avatar === null) {
        console.log(" Removing avatar from localStorage");
        removeFromLocalStorage(`user_avatar_${userId}`);

        setProfile((prev) => ({
          ...prev,
          name: updatedProfile.name || prev.name,
          phone: updatedProfile.phone || prev.phone,
          avatar: null,
        }));
      } else {
        console.log(" Updating profile info (no avatar change)");
        setProfile((prev) => ({
          ...prev,
          name: updatedProfile.name || prev.name,
          phone: updatedProfile.phone || prev.phone,
        }));
      }

      saveToLocalStorage(`user_profile_${userId}`, {
        ...profile,
        ...updatedProfile,
      });
    } catch (err) {
      console.error("UPDATE PROFILE ERROR:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /* ================= STREAK FUNCTIONS ================= */

  const loadCourseStreak = async (courseId) => {
    const uid = user?.id || user?._id;
    if (!courseId || !uid) return;

    try {
      setLoadingStreak(true);

      const res = await api.get("/profile/streak", {
        params: {
          userId: uid,
          courseId: courseId,
        },
      });

      const apiDays = res.data?.last30Days || [];
      const dayMap = {};
      apiDays.forEach((d) => {
        dayMap[d.date] = d;
      });

      const last30Days = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const isoDate = date.toISOString().split("T")[0];

        last30Days.push(
          dayMap[isoDate] || {
            date: isoDate,
            isActiveDay: false,
          },
        );
      }

      const data = {
        ...res.data,
        last30Days,
      };

      setStreakData(data);
      setMonthStreakData(data);
    } catch (err) {
      console.error("STREAK ERROR:", err);
      setStreakData(null);
      setMonthStreakData(null);
      throw err;
    } finally {
      setLoadingStreak(false);
    }
  };

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

      const cacheKey = `${year}-${monthNum}-${courseId}`;

      if (monthCache[cacheKey]) {
        setMonthStreakData(monthCache[cacheKey]);
        setStreakData(monthCache[cacheKey]);
        return;
      }

      try {
        const res = await api.get(`/streak/course/${courseId}/month`, {
          params: {
            userId: uid,
            year: year,
            month: monthNum,
          },
        });

        if (res.data) {
          const processedData = processMonthData(res.data, targetMonth);

          setMonthCache((prev) => ({
            ...prev,
            [cacheKey]: processedData,
          }));

          setMonthStreakData(processedData);
          setStreakData(processedData);
        }
      } catch (monthErr) {
        console.log(" Falling back to 30-day streak");
        await loadCourseStreak(courseId);
      }
    } catch (err) {
      console.error("MONTH STREAK ERROR:", err);
      setStreakError("Failed to load streak data");
      setMonthStreakData(null);
      throw err;
    } finally {
      setLoadingStreak(false);
    }
  };

  const processMonthData = (data, month) => {
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    let monthDays = data.monthDays || data.last30Days || [];

    if (monthDays.length < lastDay.getDate()) {
      monthDays = fillMissingDays(monthDays, firstDay, lastDay);
    }

    const activeDays = monthDays.filter((day) => day.isActiveDay).length;

    return {
      ...data,
      monthDays,
      activeDaysInMonth: activeDays,
      totalDaysInMonth: lastDay.getDate(),
      monthStartDate: firstDay.toISOString(),
      monthEndDate: lastDay.toISOString(),
      monthName: month.toLocaleString("default", { month: "long" }),
      year: month.getFullYear(),
    };
  };

  const fillMissingDays = (monthDays, firstDay, lastDay) => {
    const dayMap = {};
    monthDays.forEach((day) => {
      const date = new Date(day.date);
      dayMap[date.getDate()] = day;
    });

    const filledDays = [];
    let currentDate = new Date(firstDay);

    while (currentDate <= lastDay) {
      const dayNumber = currentDate.getDate();
      const dateStr = currentDate.toISOString().split("T")[0];

      if (dayMap[dayNumber]) {
        filledDays.push(dayMap[dayNumber]);
      } else {
        filledDays.push({
          date: dateStr,
          isActiveDay: false,
          progressPercentage: 0,
          watchedSeconds: 0,
          videoDetails: [],
          colorCode: "#E5E7EB",
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return filledDays;
  };

  const clearStreakCache = () => {
    setMonthCache({});
    setMonthStreakData(null);
    setStreakData(null);
  };

  /* ================= MONTH NAVIGATION ================= */

  const changeMonth = (direction) => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + direction);
      return newMonth;
    });
  };

  const loadStreakForCurrentMonth = () => {
    if (selectedCourseId) {
      loadMonthStreak(selectedCourseId, currentMonth);
    }
  };

  /* ================= AUTO LOAD STREAK ================= */

  useEffect(() => {
    if (selectedCourseId && user) {
      loadCourseStreak(selectedCourseId);
    }
  }, [selectedCourseId, user]);

  useEffect(() => {
    if (selectedCourseId && user) {
      loadMonthStreak(selectedCourseId, currentMonth);
    }
  }, [currentMonth]);

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const clearProfile = () => {
    console.log(
      " Clearing profile STATE only (keeping avatar in localStorage)",
    );

    setProfile(null);
    setEnrolledCourses([]);
    setStreakData(null);
    setMonthStreakData(null);
    setSelectedCourseId(null);
    setSelectedCourseTitle(null);
    setMonthCache({});
    setStreakError(null);
  };

  const clearAvatar = () => {
    const userId = user?.id || user?._id;
    if (userId) {
      console.log(" Manually clearing avatar for user:", userId);
      removeFromLocalStorage(`user_avatar_${userId}`);
      setProfile((prev) => ({
        ...prev,
        avatar: null,
      }));
    }
  };

  const clearAllUserData = () => {
    const userId = user?.id || user?._id;
    if (userId) {
      console.log(" Clearing ALL data for user:", userId);

      removeFromLocalStorage(`user_avatar_${userId}`);
      removeFromLocalStorage(`user_profile_${userId}`);

      Object.keys(localStorage).forEach((key) => {
        if (
          key.includes(`streak_${userId}`) ||
          key.includes(`month_streak_${userId}`)
        ) {
          localStorage.removeItem(key);
        }
      });

      setProfile(null);
      setEnrolledCourses([]);
      setStreakData(null);
      setMonthStreakData(null);
      setSelectedCourseId(null);
      setSelectedCourseTitle(null);
      setMonthCache({});
      setStreakError(null);
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        enrolledCourses,
        loading,

        streakData,
        loadingStreak,
        selectedCourseId,
        setSelectedCourseId: (courseId) => {
          const course = enrolledCourses.find((c) => c.id === courseId);
          setSelectedCourseId(courseId);
          setSelectedCourseTitle(course?.title || null);
          clearStreakCache();
        },
        loadCourseStreak,

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
        clearAvatar,
        clearAllUserData,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);