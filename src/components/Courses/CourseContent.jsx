import { useState } from "react";
import { ChevronDown, ChevronUp, Lock, Play, Check } from "lucide-react";
import { useAuth } from "../Login/AuthContext";

/* -------------------- HELPERS -------------------- */
function convertToEmbed(url, youtubeId) {
  if (youtubeId) {
    return `https://www.youtube.com/embed/${youtubeId}`;
  }

  if (!url) return "";

  if (url.includes("youtube.com")) {
    const id = new URL(url).searchParams.get("v");
    return `https://www.youtube.com/embed/${id}`;
  }

  if (url.includes("youtu.be")) {
    const id = url.split("/").pop();
    return `https://www.youtube.com/embed/${id}`;
  }

  return url;
}

/* -------------------- COMPONENT -------------------- */
export default function CourseContent({ course }) {
  const { isAuthenticated, openLogin } = useAuth();

  const [openModuleIndex, setOpenModuleIndex] = useState(null);
  const [openVideo, setOpenVideo] = useState(null);
  

  if (!isAuthenticated) {
  return (
    <div className="mt-10 p-6 bg-yellow-50 border rounded-lg text-center">
      <p className="font-semibold text-gray-800 mb-2">
        Please login to view course content
      </p>
      <button
        onClick={openLogin}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Login to Continue
      </button>
    </div>
  );
}

  /* -------------------- VIDEO CLICK -------------------- */
  const handleVideoClick = (video) => {
    if (!isAuthenticated) {
      openLogin();
      return;
    }

    if (video.isLocked) return;

    setOpenVideo(video);
  };

  /* -------------------- RENDER -------------------- */
  if (!course?.modules?.length) {
    return (
      <div className="mt-6 text-gray-500">No course content available.</div>
    );
  }

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">Course Content</h2>

      {course.modules.map((module, mi) => (
        <div key={module.id} className="border rounded-lg mb-3">
          {/* MODULE HEADER */}
          <div
            onClick={() => {
              if (module.isLocked) return;
              setOpenModuleIndex(openModuleIndex === mi ? null : mi);
            }}
            className={`flex justify-between items-center p-4 cursor-pointer ${
              module.isLocked ? "bg-gray-200" : "bg-gray-100"
            }`}
          >
            <div>
              <p className="font-semibold">{module.title}</p>
              <p className="text-sm text-gray-500">
                {module.videos?.length || 0} lectures
              </p>
            </div>

            {module.isLocked ? (
              <Lock size={18} className="text-gray-500" />
            ) : openModuleIndex === mi ? (
              <ChevronUp />
            ) : (
              <ChevronDown />
            )}
          </div>

          {/* VIDEO LIST */}
          {openModuleIndex === mi && (
            <div className="bg-white px-4 py-3">
              {module.videos?.map((video) => (
                <div
                  key={video.id}
                  onClick={() => handleVideoClick(video)}
                  className={`flex justify-between items-center py-2 border-b text-sm ${
                    video.isLocked
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {video.isCompleted ? (
                      <Check size={14} className="text-green-600" />
                    ) : video.isLocked ? (
                      <Lock size={14} className="text-gray-400" />
                    ) : (
                      <Play size={14} className="text-blue-600" />
                    )}

                    <span
                      className={
                        video.isLocked
                          ? "text-gray-400"
                          : video.isCompleted
                          ? "text-green-700"
                          : "text-gray-800"
                      }
                    >
                      {video.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* VIDEO PLAYER */}
      {openVideo && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="h-12 flex items-center px-4 text-white bg-black">
            <button onClick={() => setOpenVideo(null)}>← Back</button>

            <span className="ml-4 text-sm truncate">{openVideo.title}</span>
          </div>

          <iframe
            src={convertToEmbed(openVideo.videoUrl, openVideo.youtubeId)}
            className="w-full flex-1"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}
