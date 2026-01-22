// File: src/pages/ProfilePage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StreakGrid from "../components/Profile/StreakGrid";
import EditProfileModal from "../components/Profile/EditProfileModal";
import EnrolledCoursesModal from "../components/Profile/EnrolledCoursesModal";
import { useProfile } from "../components/Profile/ProfileContext";

import {
  HiChevronRight,
  HiSun,
  HiMoon,
} from "react-icons/hi";
import { useTheme } from "../components/Profile/ThemeContext";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { profile, loading, enrolledCourses, loadCourseStreak } = useProfile();
  const { theme, toggleTheme } = useTheme();

  const [editOpen, setEditOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);

  const getInitials = (name = "") => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || "";
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  useEffect(() => {
    if (enrolledCourses?.length) {
      loadCourseStreak(enrolledCourses[0].id);
    }
  }, [enrolledCourses]);

  const initials =
    profile?.name
      ?.split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("") || "?";

  if (loading || !profile)
    return (
      <div className="p-8 text-center text-gray-800 dark:text-gray-200">
        Loading...
      </div>
    );

  return (
    <div className="max-w-8xl bg-[#eaf9ff] dark:bg-gray-900 mx-auto p-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Profile
        </h1>
        <button
          onClick={() => setEditOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded transition-colors"
        >
          Edit
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow dark:shadow-gray-900/50 p-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center bg-blue-600 text-white text-lg font-bold">
          {profile.avatar ? (
            <img
              src={
                typeof profile.avatar === "string"
                  ? profile.avatar
                  : URL.createObjectURL(profile.avatar)
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            getInitials(profile.name)
          )}
        </div>

        <div className="flex-1">
          <p className="font-semibold text-gray-800 dark:text-white">
            {profile.name}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {profile.email}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {profile.phone}
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
          {profile.subscribed ? "Pro" : "Free"}
        </span>
      </div>

      {/* NEW: Display Settings Section */}
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow dark:shadow-gray-900/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              {theme === "light" ? (
                <HiSun className="text-xl text-blue-600 dark:text-blue-400" />
              ) : (
                <HiMoon className="text-xl text-blue-600 dark:text-blue-400" />
              )}
            </div>
            <div>
              <p className="font-medium text-gray-800 dark:text-white">
                Display Settings
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Current theme: {theme === "light" ? "Light Mode" : "Dark Mode"}
              </p>
            </div>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? (
              <>
                <HiMoon className="text-gray-700" />
                <span className="text-gray-700 font-medium">
                  Switch to Dark
                </span>
              </>
            ) : (
              <>
                <HiSun className="text-yellow-400" />
                <span className="text-white font-medium">Switch to Light</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div
        className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow dark:shadow-gray-900/50 p-4 cursor-pointer flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        onClick={() => setCoursesOpen(true)}
      >
        <div>
          <p className="font-medium text-gray-800 dark:text-white">
            Enrolled Courses
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {enrolledCourses.length} courses enrolled
          </p>
        </div>

        <HiChevronRight className="text-gray-400 dark:text-gray-500 text-xl" />
      </div>

      {/* Streak */}
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow dark:shadow-gray-900/50 p-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
          Streak
        </h2>
        <StreakGrid />
      </div>

      {/* Menu */}
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow dark:shadow-gray-900/50 divide-y divide-gray-200 dark:divide-gray-700">
        {[
          ["Settings", () => navigate("/settings")],
          ["Courses", () => navigate("/my-courses")],
          ["Certifications", () => navigate("/certifications")],
          ["Payment", () => navigate("/payment")],
          ["Placement", () => navigate("/placement")],
          ["Privacy Policy", () => navigate("/privacy-policy")],
        ].map(([label, action]) => (
          <div
            key={label}
            onClick={action}
            className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 flex justify-between transition-colors"
          >
            <span className="text-gray-800 dark:text-gray-200">{label}</span>
            <span>
              <HiChevronRight className="text-gray-400 dark:text-gray-500 text-xl" />
            </span>
          </div>
        ))}
      </div>

      {editOpen && (
        <EditProfileModal
          profile={profile}
          onClose={() => setEditOpen(false)}
        />
      )}

      {coursesOpen && (
        <EnrolledCoursesModal
          courses={enrolledCourses}
          onClose={() => setCoursesOpen(false)}
        />
      )}
    </div>
  );
}