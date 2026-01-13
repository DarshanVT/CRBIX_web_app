import { useState } from "react";
import { useProfile } from "../Profile/ProfileContext";
import DayDetailsModal from "./DayDetailsModal";

export default function StreakGrid() {
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
      <div className="bg-white rounded-lg p-6 shadow-sm border animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
        <div className="grid grid-cols-7 gap-2">
          {[...Array(35)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    );

  if (!streakData)
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border text-center">
        <p className="text-gray-500">No streak data available</p>
        <p className="text-sm text-gray-400 mt-2">Watch videos to start your streak</p>
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
    if (!day || !day.isActiveDay) return "#E5E7EB";

    const progress = day.progressPercentage || 0;

    if (progress < 25) return "#FEF3C7";
    if (progress < 50) return "#FDE68A";
    if (progress < 75) return "#FBBF24";
    if (progress < 100) return "#F59E0B";
    return "#10B981";
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

  return (
    <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-gray-200">
      
      {/* ---------------- HEADER (Course Selection & Streak Info) ---------------- */}
      <div className="mb-6">
        {/* Course Selection Dropdown - Full Width */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Course
          </label>
          <div className="relative">
            <select
              value={selectedCourseId || ""}
              onChange={(e) => setSelectedCourseId(Number(e.target.value))}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Course Info & Streak */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{courseTitle || "Selected Course"}</h3>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-blue-600">{currentStreakDays || 0} day streak</span>
              <span className="mx-2">•</span>
              <span>Learning progress</span>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- MONTH CALENDAR SECTION ---------------- */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
            aria-label="Previous month"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 text-lg">{monthLabel}</h3>
            <p className="text-xs text-gray-500">
              Click on a day to view details
            </p>
          </div>
          
          <button
            onClick={() => changeMonth(1)}
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
            aria-label="Next month"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day, index) => (
            <div
              key={index}
              className="h-8 flex items-center justify-center text-xs font-medium text-gray-500"
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
                  relative
                  ${dayData ? "cursor-pointer hover:scale-105 hover:shadow-sm" : "cursor-default"}
                  ${isToday ? "ring-2 ring-blue-500 ring-offset-1" : ""}
                `}
                style={{
                  backgroundColor: getColor(dayData),
                  color: isActive ? "#111827" : "#6B7280",
                }}
                title={dayData ? 
                  `${getProgressText(progress)}% progress • ${formatDuration(dayData.watchedSeconds || 0)} watched` : 
                  "No activity"
                }
                disabled={!dayData}
              >
                {dateNumber}
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Progress Legend */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-700">Progress Legend</span>
            <span className="text-xs text-gray-500">{last30Days.filter(d => d.isActiveDay).length} active days</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { color: "#E5E7EB", label: "0%", desc: "No activity" },
              { color: "#FEF3C7", label: "1-25%" },
              { color: "#FDE68A", label: "25-50%" },
              { color: "#FBBF24", label: "50-75%" },
              { color: "#F59E0B", label: "75-99%" },
              { color: "#10B981", label: "100%", desc: "Goal achieved" }
            ].map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-4 h-4 rounded mr-1.5 border border-gray-200"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-xs text-gray-600 mr-2">{item.label}</span>
                {item.desc && (
                  <span className="text-xs text-gray-400 hidden md:inline">• {item.desc}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
          <p className="text-xs text-blue-600 font-medium">Current Streak</p>
          <p className="text-xl font-bold text-gray-900">{currentStreakDays || 0} days</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3 border border-green-100">
          <p className="text-xs text-green-600 font-medium">Active Days</p>
          <p className="text-xl font-bold text-gray-900">
            {last30Days.filter(d => d.isActiveDay).length} days
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
          <p className="text-xs text-purple-600 font-medium">Watch Time</p>
          <p className="text-xl font-bold text-gray-900">
            {formatDuration(last30Days.reduce((total, day) => total + (day.watchedSeconds || 0), 0))}
          </p>
        </div>
        <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
          <p className="text-xs text-amber-600 font-medium">Avg. Progress</p>
          <p className="text-xl font-bold text-gray-900">
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
        />
      )}
    </div>
  );
}