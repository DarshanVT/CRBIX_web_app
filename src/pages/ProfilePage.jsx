import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StreakGrid from "../components/Profile/StreakGrid";
import EditProfileModal from "../components/Profile/EditProfileModal";
import EnrolledCoursesModal from "../components/Profile/EnrolledCoursesModal";
import { useProfile } from "../components/Profile/ProfileContext";
import { HiChevronRight } from "react-icons/hi";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { profile, enrolledCourses, loading } = useProfile();

  const [editOpen, setEditOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);

  const initials =
    profile?.name
      ?.split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("") || "?";

  if (loading || !profile) return <div>Loading...</div>;

  return (
    <div className="max-w-8xl bg-[#eaf9ff] mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <button
          onClick={() => setEditOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Edit
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
          {initials}
        </div>

        <div className="flex-1">
          <p className="font-semibold">{profile.name}</p>
          <p className="text-sm text-gray-500">{profile.email}</p>
          <p className="text-sm text-gray-500">{profile.phone}</p>
        </div>

        <span className="px-3 py-1 rounded-full text-sm bg-gray-100">
          {profile.subscribed ? "Pro" : "Free"}
        </span>
      </div>

      <div
        className="mt-6 bg-white rounded-xl shadow p-4 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition"
        onClick={() => setCoursesOpen(true)}
      >
        <div>
          <p className="font-medium">Enrolled Courses</p>
          <p className="text-sm text-gray-500">
            {enrolledCourses.length} courses enrolled
          </p>
        </div>

        <HiChevronRight className="text-gray-400 text-xl" />
      </div>

      {/* Streak */}
      <div className="mt-6  bg-white rounded-xl shadow p-4 cursor-pointer">
        <h2 className="text-lg font-semibold mb-3">Streak</h2>
        <StreakGrid />
      </div>

      {/* Menu */}
      <div className="mt-6 bg-white rounded-xl shadow divide-y">
        {[
            ["Settings", () => alert("Coming soon")],
          ["Courses", () => navigate("/courses")],
          ["Certifications", () => alert("Coming soon")],
          ["Payment", () => navigate("/payment")],
          ["Placement", () => alert("Coming soon")],
          ["Privacy Policy", () => navigate("/privacy-policy")],
        ].map(([label, action]) => (
          <div
            key={label}
            onClick={action}
            className="p-4 cursor-pointer hover:bg-gray-50 flex justify-between"
          >
            <span>{label}</span>
            <span><HiChevronRight className="text-gray-400 text-xl" /></span>
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
