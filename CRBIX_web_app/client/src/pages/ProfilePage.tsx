import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/navbar";
import { useState } from "react";
import { useLocation } from "wouter";

export default function ProfilePage() {
  const user = {
    name: "Rohan Sharma",
    email: "rohan@example.com",
    role: "Student",
    joined: "January 2025",
    avatar:
      "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541",
  };

  const [, setLocation] = useLocation();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setShowModal(false);
    setLocation("/"); // redirect to homepage
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="max-w-md sm:max-w-lg md:max-w-xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 border border-gray-200">

          {/* Avatar Section */}
          <div className="flex flex-col items-center text-center">
            <img
              src={user.avatar}
              alt={`${user.name} Avatar`}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mb-4 shadow"
            />
            <h2 className="text-xl sm:text-2xl font-bold text-brand-text">
              {user.name}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">{user.role}</p>
          </div>

          <hr className="my-6" />

          {/* Info Section */}
          <div className="space-y-4">
            <div>
              <label className="text-gray-700 font-medium">Name</label>
              <p className="p-3 bg-gray-100 rounded-md border mt-1 text-sm sm:text-base">
                {user.name}
              </p>
            </div>

            <div>
              <label className="text-gray-700 font-medium">Email</label>
              <p className="p-3 bg-gray-100 rounded-md border mt-1 text-sm sm:text-base">
                {user.email}
              </p>
            </div>

            <div>
              <label className="text-gray-700 font-medium">Joined</label>
              <p className="p-3 bg-gray-100 rounded-md border mt-1 text-sm sm:text-base">
                {user.joined}
              </p>
            </div>

            <div>
              <label className="text-gray-700 font-medium">Role</label>
              <p className="p-3 bg-gray-100 rounded-md border mt-1 text-sm sm:text-base">
                {user.role}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setShowModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Modal with User Details */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 max-w-sm w-full text-center">
            <div className="flex flex-col items-center">
              <img
                src={user.avatar}
                alt={`${user.name} Avatar`}
                className="w-16 h-16 rounded-full mb-3"
              />
              <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
              <p className="text-gray-600 text-sm">{user.email}</p>
              <p className="text-gray-600 text-sm">{user.role}</p>
            </div>

            <hr className="my-4" />

            <h4 className="text-gray-800 mb-4">Are you sure you want to logout?</h4>

            <div className="flex justify-center gap-4 mt-2">
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                OK
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
