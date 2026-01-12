import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Lock, Play, Check } from "lucide-react";
import { useAuth } from "../Login/AuthContext";
import { completeVideo, getCourseById } from "../../Api/course.api";
import VideoPlayer from "./VideoPlayer";

/* -------------------- HELPERS -------------------- */
function convertToEmbed(url, youtubeId) {
  if (youtubeId) return `https://www.youtube.com/embed/${youtubeId}`;
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
export default function CourseContent({
 course: initialCourse,
  startLearning,
  setStartLearning,
}) {
  const { isAuthenticated, openLogin, user } = useAuth();
  const [course, setCourse] = useState(initialCourse);

  const [openModuleIndex, setOpenModuleIndex] = useState(null);
  const [openVideo, setOpenVideo] = useState(null);
  const [currentModuleId, setCurrentModuleId] = useState(null);
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(null);
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);
  const [showNextOverlay, setShowNextOverlay] = useState(false);

  useEffect(() => {
    if (!openVideo) return;

    setIsVideoCompleted(openVideo.isCompleted === true);
  }, [openVideo]);

  useEffect(() => {
  setCourse(initialCourse);
}, [initialCourse]);

  useEffect(() => {
    if (!startLearning || !course?.modules?.length) return;

    for (let mi = 0; mi < course.modules.length; mi++) {
      const module = course.modules[mi];

      const lastVideo =
        module.videos?.find((v) => v.isLastWatched) ||
        module.videos?.find((v) => !v.isCompleted && !v.isLocked);

      if (lastVideo) {
        setOpenModuleIndex(mi);
        setOpenVideo(lastVideo);
        setCurrentModuleId(module.id);

        setStartLearning(false);
        break;
      }
    }
  }, [startLearning, course?.id]);

  /* -------------------- AUTH CHECK -------------------- */
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
  const handleVideoClick = (video, moduleId, mi, vi) => {
    if (video.isLocked) return;

    setOpenVideo(video);
    setCurrentModuleId(moduleId);
    setCurrentVideoId(video.id);
    setOpenModuleIndex(mi);
    setCurrentVideoIndex(vi);
    setIsVideoCompleted(video.isCompleted === true);
  };

  if (!course?.modules?.length) {
    return (
      <div className="mt-6 text-gray-500">No course content available.</div>
    );
  }

const refreshCourse = async () => {
  const fresh = await getCourseById(course.id, user.id);
  setCourse(fresh);
  return fresh; 
};

const handleVideoCompleted = async () => {
  setIsVideoCompleted(true);
  setShowNextOverlay(true);

  const freshCourse = await refreshCourse()

  setTimeout(() => {
    setShowNextOverlay(false);

    const next =
      course.modules[openModuleIndex]?.videos[currentVideoIndex + 1];

    if (!next || next.isLocked) return;

    handleVideoClick(
      next,
      currentModuleId,
      openModuleIndex,
      currentVideoIndex + 1
    );
  }, 5000);
};
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
              <Lock size={18} />
            ) : openModuleIndex === mi ? (
              <ChevronUp />
            ) : (
              <ChevronDown />
            )}
          </div>

          {/* VIDEO LIST */}
          {openModuleIndex === mi && (
            <div className="bg-white px-4 py-3">
              {module.videos?.map((video, vi) => (
                <div
                  key={video.id}
                  onClick={() => handleVideoClick(video, module.id, mi, vi)}
                  className={`flex items-center gap-2 py-2 border-b text-sm ${
                    video.isLocked
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer hover:bg-gray-50"
                  }`}
                >
                  {video.isCompleted ? (
                    <Check size={14} className="text-green-600" />
                  ) : video.isLocked ? (
                    <Lock size={14} />
                  ) : (
                    <Play size={14} className="text-blue-600" />
                  )}

                  <span>{video.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* VIDEO PLAYER */}
      {openVideo && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="h-12 flex items-center px-4 text-white">
            <button
              onClick={() => {
                setOpenVideo(null);
                setCurrentModuleId(null);
              }}
            >
              ← Back
            </button>
            <span className="ml-4 text-sm truncate">{openVideo.title}</span>
          </div>
          {showNextOverlay && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
              <div className="text-white text-center">
                <p className="text-xl font-semibold mb-2">✅ Video Completed</p>
                <p className="text-sm">Next video will start in 5 seconds...</p>
              </div>
            </div>
          )}
          <VideoPlayer
            courseId={course.id}
            moduleId={currentModuleId}
            video={openVideo}
            onCompleted={handleVideoCompleted}
          />

          <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
            <button
              disabled={currentVideoIndex === 0}
              onClick={() => {
                const prev =
                  course.modules[openModuleIndex].videos[currentVideoIndex - 1];
                handleVideoClick(
                  prev,
                  currentModuleId,
                  openModuleIndex,
                  currentVideoIndex - 1
                );
              }}
              className="px-4 py-2 rounded bg-gray-700 disabled:opacity-40"
            >
              ◀ Previous
            </button>

            <button
              disabled={!isVideoCompleted}
              onClick={async () => {
                if (!isVideoCompleted) return;

                const next =
                  course.modules[openModuleIndex].videos[currentVideoIndex + 1];

                if (!next) return;

                handleVideoClick(
                  next,
                  currentModuleId,
                  openModuleIndex,
                  currentVideoIndex + 1
                );
              }}
              className="px-6 py-2 rounded bg-blue-600 disabled:opacity-40"
            >
              Next ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
