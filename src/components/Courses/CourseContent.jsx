import { useState, useEffect } from "react";
import { 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft,
  ChevronRight,
  Lock, 
  Play, 
  Check, 
  FileText 
} from "lucide-react";
import { useAuth } from "../Login/AuthContext";
import {
  getCourseById,
  completeVideo,
  unlockAssessment,
  unlockNextModule,
  canAttemptAssessment,
  getAssessmentStatus,
  getModulesByCourse
} from "../../Api/course.api";
import VideoPlayer from "./VideoPlayer";
import AssessmentModal from "./AssessmentModal";
// import AssessmentModal from "./AssessmentModal";

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
  const [loading, setLoading] = useState(false);
  
  // Assessment states
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [assessmentStatus, setAssessmentStatus] = useState({});
  const [moduleAssessments, setModuleAssessments] = useState({});

  useEffect(() => {
    if (!openVideo) return;
    setIsVideoCompleted(openVideo.isCompleted === true);
  }, [openVideo]);

  useEffect(() => {
    setCourse(initialCourse);
    // Load assessments for all modules
    if (initialCourse?.modules) {
      loadModuleAssessments(initialCourse.modules);
    }
  }, [initialCourse]);

  useEffect(() => {
    if (!startLearning || !course?.modules?.length) return;

    for (let mi = 0; mi < course.modules.length; mi++) {
      const module = course.modules[mi];
      const lastVideo = module.videos?.find((v) => !v.isLocked && !v.isCompleted) || 
                       module.videos?.find((v) => !v.isLocked);

      if (lastVideo) {
        setOpenModuleIndex(mi);
        setOpenVideo(lastVideo);
        setCurrentModuleId(module.id);
        setCurrentVideoIndex(module.videos?.indexOf(lastVideo) || 0);
        setStartLearning(false);
        break;
      }
    }
  }, [startLearning, course?.id]);

  // Load assessments for modules
  const loadModuleAssessments = async (modules) => {
    const assessments = {};
    
    for (const module of modules) {
      if (module.isLocked) continue;
      
      try {
        const moduleData = await getModulesByCourse(course.id);
        if (moduleData && moduleData.assessments) {
          assessments[module.id] = moduleData.assessments;
        }
      } catch (err) {
        console.error(`Error loading assessments for module ${module.id}:`, err);
      }
    }
    
    setModuleAssessments(assessments);
  };

  const loadAssessmentStatus = async (assessmentId) => {
    if (!user?.id) return;
    
    try {
      const status = await getAssessmentStatus(assessmentId);
      setAssessmentStatus(prev => ({
        ...prev,
        [assessmentId]: status
      }));
    } catch (err) {
      console.error("Error loading assessment status:", err);
    }
  };

  /* -------------------- AUTH CHECK -------------------- */
  if (!isAuthenticated) {
    return (
      <div className="mt-10 p-6 bg-yellow-50 border rounded-lg text-center">
        <p className="font-semibold text-gray-800 mb-2">
          Please login to view course content
        </p>
        <button
          onClick={openLogin}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Login to Continue
        </button>
      </div>
    );
  }

  /* -------------------- VIDEO CLICK -------------------- */
  const handleVideoClick = async (video, moduleId, mi, vi) => {
    if (video.isLocked) {
      alert("This video is locked. Complete previous videos to unlock.");
      return;
    }

    setOpenVideo(video);
    setCurrentModuleId(moduleId);
    setCurrentVideoId(video.id);
    setOpenModuleIndex(mi);
    setCurrentVideoIndex(vi);
    setIsVideoCompleted(video.isCompleted === true);
  };

  const refreshCourse = async () => {
    setLoading(true);
    try {
      const fresh = await getCourseById(course.id, user.id);
      setCourse(fresh);
      
      // Refresh assessments
      if (fresh?.modules) {
        loadModuleAssessments(fresh.modules);
      }
      
      return fresh;
    } catch (err) {
      console.error("Error refreshing course:", err);
      return course;
    } finally {
      setLoading(false);
    }
  };

  const handleVideoCompleted = async () => {
    if (!user?.id || !course?.id || !currentModuleId || !openVideo?.id) {
      alert("Unable to complete video. Please try again.");
      return;
    }

    setIsVideoCompleted(true);
    setShowNextOverlay(true);

    try {
      // Complete video on backend
      await completeVideo(user.id, course.id, currentModuleId, openVideo.id);

      // Refresh course data
      const freshCourse = await refreshCourse();

      // Check if all videos in module are completed
      const currentModule = freshCourse.modules?.find(m => m.id === currentModuleId);
      const allVideosCompleted = currentModule?.videos?.every(v => !v.isLocked && v.isCompleted);

      if (allVideosCompleted) {
        // Unlock assessment if all videos completed
        const unlockResult = await unlockAssessment(currentModuleId);
        if (unlockResult) {
          // Load assessment status
          const assessments = moduleAssessments[currentModuleId];
          if (assessments?.length > 0) {
            loadAssessmentStatus(assessments[0].id);
          }
        }

        // Unlock next module if available
        const currentModuleIndex = freshCourse.modules?.findIndex(m => m.id === currentModuleId);
        if (currentModuleIndex >= 0 && currentModuleIndex < freshCourse.modules.length - 1) {
          const nextModule = freshCourse.modules[currentModuleIndex + 1];
          if (nextModule?.isLocked) {
            await unlockNextModule(course.id, currentModuleId);
            await refreshCourse();
          }
        }
      }

      // Auto-proceed to next video after delay
      setTimeout(() => {
        setShowNextOverlay(false);

        const nextVideo = currentModule?.videos?.find((v, i) => i > currentVideoIndex && !v.isLocked);
        if (nextVideo) {
          const nextIndex = currentModule.videos.indexOf(nextVideo);
          handleVideoClick(nextVideo, currentModuleId, openModuleIndex, nextIndex);
        }
      }, 5000);

    } catch (err) {
      console.error("Error completing video:", err);
      alert("Error completing video. Please try again.");
      setShowNextOverlay(false);
    }
  };

  const handleAssessmentClick = async (assessment, moduleId) => {
    if (!assessment || !moduleId) return;

    try {
      // Check if user can attempt assessment
      const canAttempt = await canAttemptAssessment(assessment.id);
      
      if (!canAttempt) {
        alert("Complete all videos in this module first to unlock the assessment.");
        return;
      }

      // Load assessment status
      await loadAssessmentStatus(assessment.id);
      
      // Set current assessment and show modal
      setCurrentAssessment({
        ...assessment,
        moduleId
      });
      setShowAssessmentModal(true);

    } catch (err) {
      console.error("Error handling assessment click:", err);
      alert("Error loading assessment. Please try again.");
    }
  };

  const handleAssessmentComplete = async (result) => {
    // Refresh course data after assessment completion
    await refreshCourse();
    
    // If assessment passed, unlock next module
    if (result.passed && currentAssessment?.moduleId) {
      const moduleIndex = course.modules?.findIndex(m => m.id === currentAssessment.moduleId);
      if (moduleIndex >= 0 && moduleIndex < course.modules.length - 1) {
        const nextModule = course.modules[moduleIndex + 1];
        if (nextModule?.isLocked) {
          await unlockNextModule(course.id, currentAssessment.moduleId);
          await refreshCourse();
        }
      }
    }
    
    setShowAssessmentModal(false);
    setCurrentAssessment(null);
  };

  if (!course?.modules?.length) {
    return (
      <div className="mt-6 p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
        <p>No course content available yet.</p>
        <p className="text-sm mt-1">Check back later for updates.</p>
      </div>
    );
  }

  // Calculate module progress
  const calculateModuleProgress = (module) => {
    if (!module.videos?.length) return 0;
    const completedVideos = module.videos.filter(v => v.isCompleted).length;
    return Math.round((completedVideos / module.videos.length) * 100);
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Course Content</h2>
      <p className="text-gray-600 mb-6">
        {course.modules.length} modules • {course.modules.reduce((total, m) => total + (m.videos?.length || 0), 0)} videos
      </p>

      {course.modules.map((module, mi) => {
        const progress = calculateModuleProgress(module);
        const hasAssessment = moduleAssessments[module.id]?.length > 0;
        const assessment = hasAssessment ? moduleAssessments[module.id][0] : null;
        const assessmentStatusData = assessment ? assessmentStatus[assessment.id] : null;

        return (
          <div key={module.id} className="border rounded-lg mb-4 overflow-hidden shadow-sm">
            {/* MODULE HEADER */}
            <div
              onClick={() => {
                if (module.isLocked) {
                  alert("Complete previous module to unlock this module.");
                  return;
                }
                setOpenModuleIndex(openModuleIndex === mi ? null : mi);
              }}
              className={`flex justify-between items-center p-4 cursor-pointer transition-colors ${
                module.isLocked ? "bg-gray-100" : "bg-white hover:bg-gray-50"
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    Module {mi + 1}
                  </span>
                  {module.isLocked && (
                    <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">Locked</span>
                  )}
                  {progress === 100 && (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Completed</span>
                  )}
                </div>
                <p className="font-semibold text-gray-800">{module.title}</p>
                <div className="flex items-center gap-4 mt-2">
                  <p className="text-sm text-gray-500">
                    {module.videos?.length || 0} videos
                  </p>
                  {progress > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">{progress}%</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {module.isLocked ? (
                  <Lock size={18} className="text-gray-400" />
                ) : openModuleIndex === mi ? (
                  <ChevronUp size={20} className="text-gray-600" />
                ) : (
                  <ChevronDown size={20} className="text-gray-600" />
                )}
              </div>
            </div>

            {/* MODULE CONTENT */}
            {openModuleIndex === mi && !module.isLocked && (
              <div className="bg-white border-t">
                {/* VIDEOS LIST */}
                <div className="p-4">
                  <h4 className="font-medium text-gray-700 mb-3">Videos in this module:</h4>
                  {module.videos?.map((video, vi) => (
                    <div
                      key={video.id}
                      onClick={() => handleVideoClick(video, module.id, mi, vi)}
                      className={`flex items-center gap-3 py-3 px-2 border-b last:border-b-0 transition-colors rounded ${
                        video.isLocked
                          ? "opacity-60 cursor-not-allowed bg-gray-50"
                          : "cursor-pointer hover:bg-blue-50"
                      } ${
                        openVideo?.id === video.id ? "bg-blue-100 border-l-4 border-blue-500" : ""
                      }`}
                    >
                      <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${
                        video.isCompleted ? "bg-green-100 text-green-600" : 
                        video.isLocked ? "bg-gray-200 text-gray-500" : 
                        "bg-blue-100 text-blue-600"
                      }`}>
                        {video.isCompleted ? (
                          <Check size={16} />
                        ) : video.isLocked ? (
                          <Lock size={14} />
                        ) : (
                          <Play size={14} />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${video.isCompleted ? "text-gray-600" : "text-gray-800"}`}>
                          {video.title}
                          {openVideo?.id === video.id && (
                            <span className="ml-2 text-xs text-blue-600 animate-pulse">▶ Playing</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Duration: {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
                        </p>
                      </div>
                      
                      <div className="flex-shrink-0">
                        {video.isPreview && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Preview</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* ASSESSMENT SECTION */}
                {hasAssessment && (
                  <div className="mt-4 border-t pt-4">
                    <div className="px-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-700 flex items-center gap-2">
                          <FileText size={18} className="text-purple-600" />
                          Module Assessment
                        </h4>
                        {assessmentStatusData && (
                          <span className={`text-xs px-2 py-1 rounded ${
                            assessmentStatusData.passed 
                              ? "bg-green-100 text-green-800" 
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {assessmentStatusData.passed ? "Passed" : "Not Passed"}
                          </span>
                        )}
                      </div>
                      
                      <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{assessment.title || "Module Assessment"}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              Test your knowledge after completing all videos in this module.
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              {assessmentStatusData && (
                                <>
                                  <span className="text-xs text-gray-500">
                                    Score: {assessmentStatusData.obtainedMarks || 0}/{assessmentStatusData.totalMarks || 100}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    Attempts: {assessmentStatusData.attempts || 0}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleAssessmentClick(assessment, module.id)}
                            disabled={module.videos?.some(v => !v.isCompleted && !v.isLocked)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                              module.videos?.some(v => !v.isCompleted && !v.isLocked)
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-purple-600 text-white hover:bg-purple-700"
                            }`}
                          >
                            {assessmentStatusData?.passed ? "Retake" : "Take Assessment"}
                          </button>
                        </div>
                        
                        {/* Assessment requirements */}
                        {module.videos?.some(v => !v.isCompleted && !v.isLocked) && (
                          <div className="mt-3 text-sm text-gray-600 bg-white p-2 rounded border">
                            ⚠️ Complete all videos in this module to unlock the assessment.
                            {module.videos?.filter(v => !v.isCompleted && !v.isLocked).length > 0 && (
                              <span className="text-red-600 font-medium ml-1">
                                {module.videos.filter(v => !v.isCompleted && !v.isLocked).length} videos remaining
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* MODULE COMPLETION STATUS */}
                {progress === 100 && !hasAssessment && (
                  <div className="mt-4 px-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <Check size={20} className="text-green-600" />
                        <div>
                          <p className="font-medium text-green-800">Module Completed!</p>
                          <p className="text-sm text-green-600 mt-1">
                            Great job! You've completed all videos in this module.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* VIDEO PLAYER MODAL */}
      {openVideo && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="h-14 flex items-center justify-between px-4 bg-gray-900">
            <div className="flex items-center">
              <button
                onClick={() => {
                  setOpenVideo(null);
                  setCurrentModuleId(null);
                  setCurrentVideoId(null);
                }}
                className="flex items-center gap-2 text-white hover:text-gray-300"
              >
                <ChevronLeft size={20} />
                <span className="text-sm">Back to Course</span>
              </button>
            </div>
            <div className="flex-1 px-4">
              <p className="text-white text-sm truncate max-w-2xl mx-auto text-center">
                {openVideo.title}
              </p>
            </div>
            <div className="w-20"></div>
          </div>
          
          {showNextOverlay && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
              <div className="text-white text-center p-8 bg-gray-900 rounded-lg max-w-md">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={32} />
                </div>
                <p className="text-xl font-semibold mb-2">✅ Video Completed</p>
                <p className="text-gray-300 mb-4">
                  Great work! Next video will start in 5 seconds...
                </p>
                <button
                  onClick={() => setShowNextOverlay(false)}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Skip countdown
                </button>
              </div>
            </div>
          )}
          
          <div className="flex-1 relative">
            <VideoPlayer
              courseId={course.id}
              moduleId={currentModuleId}
              video={openVideo}
              onCompleted={handleVideoCompleted}
              userId={user.id}
            />
          </div>

          {/* VIDEO NAVIGATION CONTROLS */}
          <div className="bg-gray-900 text-white p-4">
            <div className="flex justify-between items-center max-w-4xl mx-auto">
              <button
                disabled={currentVideoIndex === 0}
                onClick={() => {
                  const prev = course.modules[openModuleIndex]?.videos[currentVideoIndex - 1];
                  if (prev) {
                    handleVideoClick(prev, currentModuleId, openModuleIndex, currentVideoIndex - 1);
                  }
                }}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  currentVideoIndex === 0 
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed" 
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                <ChevronLeft size={18} />
                Previous
              </button>

              <div className="text-sm text-gray-400">
                Video {currentVideoIndex + 1} of {course.modules[openModuleIndex]?.videos?.length}
              </div>

              <button
                disabled={!isVideoCompleted}
                onClick={async () => {
                  if (!isVideoCompleted) return;
                  
                  const next = course.modules[openModuleIndex]?.videos[currentVideoIndex + 1];
                  if (next && !next.isLocked) {
                    handleVideoClick(next, currentModuleId, openModuleIndex, currentVideoIndex + 1);
                  }
                }}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  !isVideoCompleted 
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed" 
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Next Video
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ASSESSMENT MODAL */}
      {showAssessmentModal && currentAssessment && (
        <AssessmentModal
          assessment={currentAssessment}
          onClose={() => {
            setShowAssessmentModal(false);
            setCurrentAssessment(null);
          }}
          onComplete={handleAssessmentComplete}
          userId={user.id}
          courseId={course.id}
        />
      )}

      {/* LOADING OVERLAY */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center">
            <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full mb-4"></div>
            <p className="text-gray-700">Updating course data...</p>
          </div>
        </div>
      )}
    </div>
  );
}