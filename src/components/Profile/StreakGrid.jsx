import { useState } from "react";
import { useProfile } from "../Profile/ProfileContext";
import { useTheme } from "../Profile/ThemeContext";
import DayDetailsModal from "./DayDetailsModal";

export default function StreakGrid() {
  const { theme, toggleTheme } = useTheme();
  const {
    streakData,
    loadingStreak,
    enrolledCourses,
    selectedCourseId,
    setSelectedCourseId,
    currentMonth,
    changeMonth
  } = useProfile();

  const [selectedDay, setSelectedDay] = useState(null);

  if (loadingStreak)
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm border dark:border-gray-700 animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-60"></div>
          </div>
          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {[...Array(35)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
          ))}
        </div>
      </div>
    );

  if (!streakData)
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm border dark:border-gray-700 text-center">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Learning Streak</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Track your daily progress</p>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
        <p className="text-gray-500 dark:text-gray-400">No streak data available</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Watch videos to start your streak</p>
      </div>
    );

  const { last30Days = [], currentStreakDays, courseTitle } = streakData;

  /* ---------------- MONTH CONTROLS ---------------- */
  const monthLabel = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  /* ---------------- MONTH DAYS ---------------- */
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // total days in month
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  // Get first day of month to calculate offset
  const firstDayOfMonth = new Date(year, month, 1);
  const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday

  // map streak data by date number
  const streakMap = {};
  last30Days.forEach((day) => {
    if (day && day.date) {
      const d = new Date(day.date);
      if (d.getMonth() === month && d.getFullYear() === year) {
        streakMap[d.getDate()] = day;
      }
    }
  });

  /* ---------------- DAY NAMES ---------------- */
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

  /* ---------------- COLOR LOGIC ---------------- */
  const getColor = (day) => {
    if (!day || !day.isActiveDay) return theme === 'dark' ? "#374151" : "#E5E7EB";

    const progress = day.progressPercentage || 0;

    if (progress < 25) return theme === 'dark' ? "#451A03" : "#FEF3C7";
    if (progress < 50) return theme === 'dark' ? "#78350F" : "#FDE68A";
    if (progress < 75) return theme === 'dark' ? "#92400E" : "#FBBF24";
    if (progress < 100) return theme === 'dark' ? "#B45309" : "#F59E0B";
    return theme === 'dark' ? "#065F46" : "#10B981";
  };

  // Helper functions
  const getDisplayProgress = (progress) => {
    return progress >= 95 ? 100 : Math.round(progress * 10) / 10;
  };

  const getProgressText = (progress) => {
    const displayProgress = getDisplayProgress(progress);
    return displayProgress >= 100 ? '100' : displayProgress.toFixed(1);
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "0m";
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
  };

  const getMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long' });
  };

  const getTextColor = (day) => {
    if (!day || !day.isActiveDay) return theme === 'dark' ? "#9CA3AF" : "#6B7280";
    
    const progress = day.progressPercentage || 0;
    if (progress >= 50) return "#FFFFFF";
    return theme === 'dark' ? "#111827" : "#111827";
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-4 md:p-6 shadow-sm border border-gray-200 dark:border-gray-800">
      
      {/* ---------------- HEADER WITH THEME TOGGLE ---------------- */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Learning Streak</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Track your daily progress</p>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      {/* ---------------- COURSE SELECTION & STREAK INFO ---------------- */}
      <div className="mb-6">
        {/* Course Selection Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Course
          </label>
          <div className="relative">
            <select
              value={selectedCourseId || ""}
              onChange={(e) => setSelectedCourseId(Number(e.target.value))}
              className="w-full appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 pr-10 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {enrolledCourses.length === 0 ? (
                <option value="">No courses enrolled</option>
              ) : (
                enrolledCourses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))
              )}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
              <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Course Info & Streak */}
        <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{courseTitle || "Selected Course"}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium text-blue-600 dark:text-blue-400">{currentStreakDays || 0} day streak</span>
              <span className="mx-2">•</span>
              <span>Learning progress</span>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- MONTH CALENDAR SECTION ---------------- */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Previous month"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{monthLabel}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Click on a day to view details
            </p>
          </div>
          
          <button
            onClick={() => changeMonth(1)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Next month"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day, index) => (
            <div
              key={index}
              className="h-8 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before the first day of month */}
          {Array.from({ length: firstDayOfWeek }).map((_, index) => (
            <div key={`empty-${index}`} className="h-10 md:h-12"></div>
          ))}

          {/* Day cells */}
          {Array.from({ length: totalDaysInMonth }).map((_, index) => {
            const dateNumber = index + 1;
            const dayData = streakMap[dateNumber];
            const isActive = dayData?.isActiveDay;
            const progress = dayData?.progressPercentage || 0;
            const isToday = new Date().getDate() === dateNumber && 
                           new Date().getMonth() === month && 
                           new Date().getFullYear() === year;

            return (
              <button
                key={dateNumber}
                onClick={() => dayData && setSelectedDay(dayData)}
                className={`
                  h-10 md:h-12 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200
                  relative group
                  ${dayData ? "cursor-pointer hover:scale-105 hover:shadow-lg" : "cursor-default"}
                  ${isToday ? "ring-2 ring-blue-500 dark:ring-blue-400 ring-offset-1 dark:ring-offset-gray-800" : ""}
                `}
                style={{
                  backgroundColor: getColor(dayData),
                  color: getTextColor(dayData),
                }}
                title={dayData ? 
                  `${getProgressText(progress)}% progress • ${formatDuration(dayData.watchedSeconds || 0)} watched` : 
                  "No activity"
                }
                disabled={!dayData}
              >
                {dateNumber}
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full"></div>
                )}
                
                {/* Tooltip for mobile */}
                {dayData && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {getProgressText(progress)}% • {formatDuration(dayData.watchedSeconds || 0)}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Progress Legend */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Progress Legend</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{last30Days.filter(d => d.isActiveDay).length} active days</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { color: theme === 'dark' ? "#374151" : "#E5E7EB", label: "0%", desc: "No activity" },
              { color: theme === 'dark' ? "#451A03" : "#FEF3C7", label: "1-25%" },
              { color: theme === 'dark' ? "#78350F" : "#FDE68A", label: "25-50%" },
              { color: theme === 'dark' ? "#92400E" : "#FBBF24", label: "50-75%" },
              { color: theme === 'dark' ? "#B45309" : "#F59E0B", label: "75-99%" },
              { color: theme === 'dark' ? "#065F46" : "#10B981", label: "100%", desc: "Goal achieved" }
            ].map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-4 h-4 rounded mr-1.5 border border-gray-300 dark:border-gray-600"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-xs text-gray-600 dark:text-gray-400 mr-2">{item.label}</span>
                {item.desc && (
                  <span className="text-xs text-gray-500 dark:text-gray-500 hidden md:inline">• {item.desc}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800/30">
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Current Streak</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{currentStreakDays || 0} days</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-100 dark:border-green-800/30">
          <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">Active Days</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {last30Days.filter(d => d.isActiveDay).length} days
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-100 dark:border-purple-800/30">
          <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-1">Watch Time</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {formatDuration(last30Days.reduce((total, day) => total + (day.watchedSeconds || 0), 0))}
          </p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-100 dark:border-amber-800/30">
          <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mb-1">Avg. Progress</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {getProgressText(
              last30Days.filter(d => d.isActiveDay).length > 0 ?
              last30Days.filter(d => d.isActiveDay).reduce((sum, day) => sum + (day.progressPercentage || 0), 0) / 
              last30Days.filter(d => d.isActiveDay).length : 0
            )}%
          </p>
        </div>
      </div>

      {/* ---------------- DAY DETAILS MODAL ---------------- */}
      {selectedDay && (
        <DayDetailsModal
          day={selectedDay}
          onClose={() => setSelectedDay(null)}
          getDisplayProgress={getDisplayProgress}
          getProgressText={getProgressText}
          formatDuration={formatDuration}
          getDayOfWeek={getDayOfWeek}
          getMonthName={getMonthName}
          theme={theme}
        />
      )}
    </div>
  );
}