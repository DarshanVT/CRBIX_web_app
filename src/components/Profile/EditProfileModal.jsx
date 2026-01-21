import { useState } from "react";
import { useProfile } from "./ProfileContext";
import { useEffect } from "react";

export default function EditProfileModal({ profile, onClose }) {
  const { updateProfile } = useProfile();

  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [ avatar,setAvatar] = useState(profile.avatar || null);
  const [saving, setSaving] = useState(false);

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    if (profile?.avatar) {
      if (typeof profile.avatar === "string") {
        setAvatarPreview(profile.avatar);
      } else {
        setAvatarPreview(URL.createObjectURL(profile.avatar));
      }
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

    setAvatarFile(file);
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
    e.target.value = null;
  };
  /* ---------------- SAVE ---------------- */

  const handleSave = async () => {
    setSaving(true);

    const updatedProfile = {
      ...profile,
      name,
      phone,
      avatar: avatarFile || profile.avatar, // 🔥 FIX
    };

    await updateProfile(updatedProfile);

    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-xl p-6 relative">
        {/* ---------- AVATAR ---------- */}
        <div className="flex justify-center -mt-16 mb-4">
          <label htmlFor="avatar-upload" className="relative cursor-pointer">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                getInitials(profile?.name)
              )}
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

        <h2 className="text-xl font-semibold mb-4 text-center dark:text-white">
          Edit Profile
        </h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="w-full border dark:border-gray-700 p-2 rounded mb-3 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
        />

        <input
          value={profile.email}
          disabled
          className="w-full border dark:border-gray-700 p-2 rounded mb-3 bg-gray-100 dark:bg-gray-700 dark:text-gray-400"
        />

        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone"
          className="w-full border dark:border-gray-700 p-2 rounded mb-4 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
        />

        <div className="flex justify-end gap-2">
          <button 
            onClick={onClose} 
            className="text-gray-600 dark:text-gray-400"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}