import { useState } from "react";
import { useProfile } from "./ProfileContext";
import { useEffect } from "react";
import { useTheme } from "./ThemeContext";

export default function EditProfileModal({ profile, onClose }) {
  const { updateProfile } = useProfile();
  const { theme } = useTheme();

  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar || null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile?.avatar) {
      setAvatarPreview(profile.avatar);
    }
  }, [profile]);

  const getInitials = (name = "") => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || "";
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  /* ---------------- IMAGE UPLOAD ---------------- */

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setAvatarFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);

    e.target.value = null;
  };

  /* ---------------- SAVE ---------------- */

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }

    setSaving(true);

    try {
      const updatedProfile = {
        name: name.trim(),
        phone: phone.trim(),
        avatar: avatarFile || null,
      };

      await updateProfile(updatedProfile);
      onClose();
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const modalBgClass = theme === "dark" ? "bg-gray-900" : "bg-white";
  const textColorClass = theme === "dark" ? "text-white" : "text-gray-900";
  const inputBgClass = theme === "dark" ? "bg-gray-800" : "bg-white";
  const inputBorderClass =
    theme === "dark" ? "border-gray-700" : "border-gray-300";
  const inputTextClass = theme === "dark" ? "text-white" : "text-gray-900";
  const disabledInputBgClass = theme === "dark" ? "bg-gray-700" : "bg-gray-100";
  const disabledInputTextClass =
    theme === "dark" ? "text-gray-400" : "text-gray-600";
  const buttonCancelClass =
    theme === "dark"
      ? "text-gray-300 hover:text-white"
      : "text-gray-600 hover:text-gray-900";
  const buttonSaveClass =
    theme === "dark"
      ? "bg-blue-700 hover:bg-blue-600"
      : "bg-blue-600 hover:bg-blue-700";
  const removeButtonClass =
    theme === "dark"
      ? "text-red-400 hover:text-red-300"
      : "text-red-600 hover:text-red-700";

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className={`${modalBgClass} w-full max-w-md rounded-xl p-6 relative shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ---------- AVATAR ---------- */}
        <div className="flex justify-center -mt-16 mb-4">
          <label
            htmlFor="avatar-upload"
            className="relative cursor-pointer group"
          >
            <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-white text-xl font-bold relative">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.textContent = getInitials(name);
                  }}
                />
              ) : (
                getInitials(name)
              )}

              {/* Overlay for hover effect */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-medium">Change</span>
              </div>
            </div>

            <span className="absolute bottom-1 right-1 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              Edit
            </span>

            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Remove Avatar Button */}
        {avatarPreview && (
          <div className="flex justify-center mb-4">
            <button
              type="button"
              onClick={handleRemoveAvatar}
              className={`text-sm ${removeButtonClass} transition-colors`}
            >
              Remove Avatar
            </button>
          </div>
        )}

        <h2
          className={`text-xl font-semibold mb-4 text-center ${textColorClass}`}
        >
          Edit Profile
        </h2>

        {/* Name Input */}
        <div className="mb-3">
          <label className={`block text-sm font-medium mb-1 ${textColorClass}`}>
            Name *
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className={`w-full border p-2 rounded ${inputBgClass} ${inputBorderClass} ${inputTextClass} placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
          />
        </div>

        {/* Email Input (Disabled) */}
        <div className="mb-3">
          <label className={`block text-sm font-medium mb-1 ${textColorClass}`}>
            Email
          </label>
          <input
            value={profile.email}
            disabled
            className={`w-full border p-2 rounded ${disabledInputBgClass} ${inputBorderClass} ${disabledInputTextClass}`}
          />
        </div>

        {/* Phone Input */}
        <div className="mb-6">
          <label className={`block text-sm font-medium mb-1 ${textColorClass}`}>
            Phone Number
          </label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            className={`w-full border p-2 rounded ${inputBgClass} ${inputBorderClass} ${inputTextClass} placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded transition ${buttonCancelClass}`}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className={`px-4 py-2 rounded text-white transition ${buttonSaveClass} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {saving ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin h-4 w-4 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}