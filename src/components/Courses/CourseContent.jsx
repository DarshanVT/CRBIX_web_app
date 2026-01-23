import { useState, useEffect, useCallback } from "react";
import { 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft,
  ChevronRight,
  Lock, 
  Play, 
  Check, 
  FileText,
  Unlock,
  X
} from "lucide-react";
import { useAuth } from "../Login/AuthContext";
import { useTheme } from "../Profile/ThemeContext";
import {
  getCourseById,
  completeVideo,
  unlockAssessment,
  unlockNextModule,
  canAttemptAssessment,
  getAssessmentStatus,
  getModuleAssessments
} from "../../Api/course.api";
import VideoPlayer from "./VideoPlayer";
import AssessmentModal from "./AssessmentModal";

/* -------------------- NEW UNLOCKING LOGIC -------------------- */
const checkVideoUnlockable = (course, moduleIndex, videoIndex) => {
  console.log(`🔓 Checking unlockable: module=${moduleIndex}, video=${videoIndex}`);
  
  if (!course?.isPurchased) {
    return moduleIndex === 0 && videoIndex === 0;
  }
  
  // Purchased user logic
  if (moduleIndex === 0) {
    // First module: first 3 videos always unlocked for purchased users
    if (videoIndex < 3) return true;
    
    // For video 4+, check if all previous videos are completed
    if (videoIndex >= 3) {
      const module = course.modules?.[0];
      if (!module || !module.videos) return false;
      
      // Check if ALL videos from 0 to videoIndex-1 are completed
      for (let i = 0; i < videoIndex; i++) {
        const prevVideo = module.videos[i];
        if (!prevVideo || !prevVideo.isCompleted) {
          return false;
        }
      }
      return true;
    }
  }
  
  // For other modules (moduleIndex > 0)
  if (moduleIndex > 0) {
    const currentModule = course.modules?.[moduleIndex];
    if (!currentModule) return false;
    
    // Check if module is unlocked
    if (currentModule.isLocked) return false;
    
    console.log(`🔓 Module ${moduleIndex} is unlocked, checking videos...`);
    
    // First video of unlocked module: check if it's locked
    if (videoIndex === 0) {
      const firstVideo = currentModule.videos?.[0];
      if (!firstVideo) return false;
      
      // If first video is marked as locked in data, return false
      if (firstVideo.isLocked) {
        console.log(`🔓 First video is marked as locked: ${firstVideo.isLocked}`);
        return false;
      }
      
      console.log(`🔓 First video unlocked: true`);
      return true;
    }
    
    // Other videos in module: check if previous video in SAME module is completed
    const currentVideos = currentModule?.videos || [];
    
    if (videoIndex > 0 && videoIndex < currentVideos.length) {
      const previousVideo = currentVideos[videoIndex - 1];
      const isUnlockable = previousVideo?.isCompleted || false;
      console.log(`🔓 Video ${videoIndex} unlockable (previous completed): ${isUnlockable}`);
      return isUnlockable;
    }
  }
  
  return false;
};

const isModuleAssessmentAvailable = (module) => {
  if (!module?.videos || module.videos.length === 0) return false;
  return module.videos.every(video => video.isCompleted);
};

const isNextModuleAvailable = (course, currentModuleIndex) => {
  if (!course || !course.modules?.[currentModuleIndex]) return false;
  
  const module = course.modules[currentModuleIndex];
  const isAssessmentPassed = module.assessmentPassed || false;
  const allVideosCompleted = module.videos?.every(v => v.isCompleted) || false;
  
  return allVideosCompleted && isAssessmentPassed;
};

/* -------------------- ASSESSMENT RESULT MODAL -------------------- */
const AssessmentResultModal = ({ result, onClose, onRetake, theme }) => {
  const passed = result?.passed;
  const nextModuleUnlocked = result?.nextModuleUnlocked;
  const percentage = result?.percentage || 0;
  const obtainedMarks = result?.obtainedMarks || 0;
  const totalMarks = result?.totalMarks || 100;
  const message = result?.message || '';
  
  // Auto-close timer for success with next module
  useEffect(() => {
    if (passed && nextModuleUnlocked) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [passed, nextModuleUnlocked, onClose]);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 dark:bg-opacity-90 z-[60] flex items-center justify-center p-4">
      <div className={`${theme === 'dark' ? 'dark' : ''} bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl dark:shadow-gray-900/50`}>
        {/* Header */}
        <div className="p-8 text-center">
          {/* Icon */}
          <div className="relative inline-block mb-6">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center ${
              passed 
                ? 'bg-green-100 dark:bg-green-900/30' 
                : 'bg-red-100 dark:bg-red-900/30'
            }`}>
              {passed ? (
                <div className="w-24 h-24 bg-green-500 dark:bg-green-600 rounded-full flex items-center justify-center">
                  <Check size={48} className="text-white" />
                </div>
              ) : (
                <div className="w-24 h-24 bg-red-500 dark:bg-red-600 rounded-full flex items-center justify-center">
                  <X size={48} className="text-white" />
                </div>
              )}
            </div>
            
            {/* Celebration effect */}
            {passed && (
              <div className="absolute inset-0 animate-ping opacity-20">
                <div className="w-full h-full rounded-full border-4 border-green-500 dark:border-green-400"></div>
              </div>
            )}
          </div>
          
          {/* Title */}
          <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            {passed ? 'Congratulations!' : 'Better Luck Next Time!'}
          </h2>
          
          {/* Score */}
          <div className="mb-6">
            <div className="text-4xl font-bold mb-1 text-gray-900 dark:text-white">
              {obtainedMarks}/{totalMarks}
            </div>
            <div className="text-2xl font-semibold text-gray-600 dark:text-gray-400">
              {percentage.toFixed(1)}%
            </div>
          </div>
          
          {/* Next module unlocked badge */}
          {passed && nextModuleUnlocked && (
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-4 py-2 rounded-full border border-green-200 dark:border-green-700">
                <Unlock size={18} />
                <span className="font-semibold">Next Module Unlocked!</span>
              </div>
              <p className="text-green-600 dark:text-green-400 text-sm mt-2">
                🎉 You can now continue learning
              </p>
              {nextModuleUnlocked && (
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">
                  Auto-refreshing in 5 seconds...
                </p>
              )}
            </div>
          )}
          
          {/* Message */}
          {message && (
            <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
          )}
        </div>
        
        {/* Progress bar for passing requirement */}
        <div className="px-8 pb-6">
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Passing Requirement</span>
            <span className={`font-semibold ${
              percentage >= 70 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {percentage >= 70 ? '✓ Passed' : '✗ Failed'}
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                percentage >= 70 
                  ? 'bg-green-500 dark:bg-green-600' 
                  : 'bg-red-500 dark:text-red-600'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1 text-center">
            Minimum 70% required to pass
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="border-t dark:border-gray-700 p-6">
          <div className="flex flex-col gap-3">
            {passed && nextModuleUnlocked ? (
              <>
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-blue-600 dark:bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                >
                  Continue Learning
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 text-gray-600 dark:text-gray-400 font-medium hover:text-gray-800 dark:hover:text-gray-300 transition-colors"
                >
                  Back to Course
                </button>
              </>
            ) : passed ? (
              <>
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-green-600 dark:bg-green-700 text-white font-semibold rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
                >
                  Great! Continue Learning
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 text-gray-600 dark:text-gray-400 font-medium hover:text-gray-800 dark:hover:text-gray-300 transition-colors"
                >
                  Back to Course
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onRetake}
                  className="w-full py-3 bg-blue-600 dark:bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Back to Course
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------- COMPONENT -------------------- */
export default function CourseContent({
  course: initialCourse,
  startLearning,
  setStartLearning,
  onCourseUpdate
}) {
  console.log("🎯 CourseContent RECEIVED:", {
    initialCourse,
    hasInitialCourse: !!initialCourse,
    courseId: initialCourse?.id,
    courseTitle: initialCourse?.title,
    modulesCount: initialCourse?.modules?.length,
    firstModule: initialCourse?.modules?.[0],
    firstVideo: initialCourse?.modules?.[0]?.videos?.[0]
  });
  
  const { isAuthenticated, openLogin, user } = useAuth();
  const { theme } = useTheme();
  const [course, setCourse] = useState(initialCourse || null);

  const [openModuleIndex, setOpenModuleIndex] = useState(null);
  const [openVideo, setOpenVideo] = useState(null);
  const [currentModuleId, setCurrentModuleId] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(null);
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);
  const [showNextOverlay, setShowNextOverlay] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Assessment states
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [assessmentStatus, setAssessmentStatus] = useState({});
  const [moduleAssessments, setModuleAssessments] = useState({});
  
  // Assessment result modal state
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);

  // Sync course with parent
  useEffect(() => {
    if (initialCourse && JSON.stringify(initialCourse) !== JSON.stringify(course)) {
      console.log("🔄 Syncing course from parent");
      setCourse(initialCourse);
    }
  }, [initialCourse]);

  useEffect(() => {
    if (!openVideo) return;
    setIsVideoCompleted(openVideo.isCompleted === true);
  }, [openVideo]);

  const loadAssessmentStatus = useCallback(async (assessmentId) => {
    if (!user?.id) return;
    
    try {
      const status = await getAssessmentStatus(assessmentId, user.id);
      setAssessmentStatus(prev => ({
        ...prev,
        [assessmentId]: status
      }));
    } catch (err) {
      console.error("Error loading assessment status:", err);
    }
  }, [user?.id]);

  const loadModuleAssessments = useCallback(async (modules) => {
    if (!course?.id) return;
    
    const assessments = {};
    
    for (const module of modules) {
      if (module.isLocked) continue;
      
      try {
        const assessmentsData = await getModuleAssessments(module.id, user?.id);
        
        if (assessmentsData && assessmentsData.length > 0) {
          assessments[module.id] = assessmentsData[0];
          
          if (assessmentsData[0].id && user?.id) {
            await loadAssessmentStatus(assessmentsData[0].id);
          }
        }
      } catch (err) {
        console.error(`Error loading assessments for module ${module.id}:`, err);
      }
    }
    
    setModuleAssessments(assessments);
  }, [course?.id, user?.id, loadAssessmentStatus]);

  useEffect(() => {
    if (!startLearning || !course?.modules?.length) return;

    for (let mi = 0; mi < course.modules.length; mi++) {
      const module = course.modules[mi];
      if (module.isLocked) continue;
      
      for (let vi = 0; vi < (module.videos?.length || 0); vi++) {
        const video = module.videos[vi];
        const isUnlockable = checkVideoUnlockable(course, mi, vi);
        
        if (isUnlockable && !video.isLocked) {
          setOpenModuleIndex(mi);
          setOpenVideo(video);
          setCurrentModuleId(module.id);
          setCurrentVideoIndex(vi);
          setStartLearning(false);
          return;
        }
      }
    }
  }, [startLearning, course, setStartLearning]);

  useEffect(() => {
    if (course?.modules) {
      loadModuleAssessments(course.modules);
    }
  }, [course, loadModuleAssessments]);

  /* -------------------- REFRESH COURSE -------------------- */
  const refreshCourse = useCallback(async () => {
    if (!course?.id || !user?.id) return null;
    
    setLoading(true);
    try {
      const fresh = await getCourseById(course.id, user?.id);
      console.log("🔄 Refreshed course data:", {
        id: fresh.id,
        modules: fresh.modules?.length,
        firstModuleLocked: fresh.modules?.[0]?.isLocked,
        firstVideoLocked: fresh.modules?.[0]?.videos?.[0]?.isLocked
      });
      
      // Log each module's status
      fresh.modules?.forEach((module, index) => {
        console.log(`📊 Module ${index}: ${module.title}`, {
          isLocked: module.isLocked,
          videos: module.videos?.map(v => ({ 
            title: v.title, 
            isLocked: v.isLocked,
            isCompleted: v.isCompleted 
          }))
        });
      });
      
      // Update local state
      setCourse(fresh);
      
      // Update parent state too
      if (onCourseUpdate) {
        console.log("🔄 Updating parent course state");
        onCourseUpdate(fresh);
      }
      
      // Load assessments
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
  }, [course?.id, user?.id, loadModuleAssessments, onCourseUpdate]);

  /* -------------------- HELPER FUNCTIONS -------------------- */
  const unlockModuleVideos = useCallback(async (moduleId) => {
    try {
      console.log(`🔓 Manually unlocking videos for module: ${moduleId}`);
      
      const userId = localStorage.getItem("user_id");
      if (!userId || !course?.id) return false;
      
      const module = course.modules?.find(m => m.id === moduleId);
      if (!module || !module.videos || module.videos.length === 0) return false;
      
      const firstVideo = module.videos[0];
      if (firstVideo && firstVideo.isLocked) {
        console.log(`🔓 Unlocking video: ${firstVideo.id} - ${firstVideo.title}`);
        
        try {
          const res = await fetch(`https://cdaxx-backend.onrender.com/api/videos/${firstVideo.id}/unlock?userId=${userId}&courseId=${course.id}&moduleId=${moduleId}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem("auth_token")}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (res.ok) {
            console.log('✅ Video unlocked via API');
            
            const updatedCourse = { ...course };
            const moduleIndex = updatedCourse.modules?.findIndex(m => m.id === moduleId);
            
            if (moduleIndex !== -1) {
              const videoIndex = updatedCourse.modules[moduleIndex]?.videos?.findIndex(v => v.id === firstVideo.id);
              if (videoIndex !== -1) {
                updatedCourse.modules[moduleIndex].videos[videoIndex].isLocked = false;
                setCourse(updatedCourse);
                
                if (onCourseUpdate) {
                  onCourseUpdate(updatedCourse);
                }
              }
            }
            
            return true;
          }
        } catch (apiError) {
          console.error('❌ API unlock failed:', apiError);
          const updatedCourse = { ...course };
          const moduleIndex = updatedCourse.modules?.findIndex(m => m.id === moduleId);
          
          if (moduleIndex !== -1 && updatedCourse.modules[moduleIndex]?.videos?.[0]) {
            updatedCourse.modules[moduleIndex].videos[0].isLocked = false;
            setCourse(updatedCourse);
            
            if (onCourseUpdate) {
              onCourseUpdate(updatedCourse);
            }
          }
          return true;
        }
      } else if (firstVideo && !firstVideo.isLocked) {
        console.log('✅ First video already unlocked');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ Error unlocking videos:', error);
      return false;
    }
  }, [course, onCourseUpdate]);

  /* -------------------- ASSESSMENT COMPLETION HANDLER -------------------- */
  const handleAssessmentComplete = useCallback(async (result) => {
    console.log('🎯 Assessment completed:', {
      success: result.success,
      passed: result.passed,
      nextModuleUnlocked: result.nextModuleUnlocked,
      currentAssessment: currentAssessment
    });
    
    // Close assessment modal
    setShowAssessmentModal(false);
    
    if (result.success && result.passed) {
      const currentModuleId = currentAssessment?.moduleId;
      
      if (currentModuleId) {
        console.log(`🔓 Processing assessment completion for module: ${currentModuleId}`);
        
        try {
          // 1. Unlock next module via API
          const unlocked = await unlockNextModule(course.id, currentModuleId);
          console.log(`🔓 API unlock result: ${unlocked}`);
          
          if (unlocked) {
            // 2. Find current module index
            const currentModuleIndex = course.modules?.findIndex(m => m.id === currentModuleId);
            console.log(`🔍 Current module index: ${currentModuleIndex}`);
            
            if (currentModuleIndex !== -1 && currentModuleIndex < course.modules.length - 1) {
              const nextModuleIndex = currentModuleIndex + 1;
              const nextModuleId = course.modules[nextModuleIndex]?.id;
              
              if (nextModuleId) {
                console.log(`🔓 Next module to unlock: ${nextModuleId}`);
                
                // 3. Update local state for next module
                const updatedCourse = { ...course };
                if (updatedCourse.modules?.[nextModuleIndex]) {
                  updatedCourse.modules[nextModuleIndex].isLocked = false;
                  
                  // Unlock first video of next module
                  if (updatedCourse.modules[nextModuleIndex]?.videos?.[0]) {
                    updatedCourse.modules[nextModuleIndex].videos[0].isLocked = false;
                  }
                  
                  setCourse(updatedCourse);
                  
                  // Update parent state
                  if (onCourseUpdate) {
                    onCourseUpdate(updatedCourse);
                  }
                  
                  console.log(`✅ Next module unlocked in state: ${nextModuleId}`);
                }
              }
            }
            
            // 4. Get next module title for message
            const currentModuleIndexForTitle = course.modules?.findIndex(m => m.id === currentModuleId);
            const nextModuleTitle = course.modules[currentModuleIndexForTitle + 1]?.title || "Next Module";
            
            // 5. Show result modal
            setAssessmentResult({
              ...result,
              nextModuleUnlocked: true,
              message: `${nextModuleTitle} is now unlocked!`
            });
            setShowResultModal(true);
            
            // 6. Refresh course data after showing result
            setTimeout(async () => {
              console.log('🔄 Final course refresh after assessment');
              await refreshCourse();
            }, 1000);
            
            // Reset current assessment
            setCurrentAssessment(null);
            return;
          }
          
          // If we reach here, module wasn't unlocked but assessment passed
          console.log('✅ Assessment passed but next module not unlocked');
          setAssessmentResult({
            ...result,
            nextModuleUnlocked: false,
            message: "Assessment passed! Check if next module is available."
          });
          setShowResultModal(true);
          
        } catch (error) {
          console.error('❌ Error unlocking next module:', error);
          setAssessmentResult({
            ...result,
            nextModuleUnlocked: false,
            message: "Assessment passed, but there was an issue unlocking the next module."
          });
          setShowResultModal(true);
        }
      } else {
        // No module ID found
        console.log('✅ Assessment passed but no module ID');
        setAssessmentResult(result);
        setShowResultModal(true);
      }
    } else if (result.success) {
      // Assessment not passed
      console.log('📊 Assessment completed but not passed');
      setAssessmentResult(result);
      setShowResultModal(true);
    } else {
      // Assessment failed
      console.log('❌ Assessment failed');
      setAssessmentResult({
        ...result,
        message: "Assessment failed. Please try again."
      });
      setShowResultModal(true);
    }
    
    // Reset current assessment
    setCurrentAssessment(null);
    
  }, [currentAssessment, course, refreshCourse, onCourseUpdate]);

  /* -------------------- AUTH CHECK -------------------- */
  if (!isAuthenticated) {
    return (
      <div className={`mt-10 p-6 rounded-lg text-center ${
        theme === 'dark' 
          ? 'bg-yellow-900/20 border-yellow-800/30 text-yellow-200' 
          : 'bg-yellow-50 border-yellow-100 text-gray-800'
      } border`}>
        <p className="font-semibold mb-2">
          Please login to view course content
        </p>
        <button
          onClick={openLogin}
          className="mt-2 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
        >
          Login to Continue
        </button>
      </div>
    );
  }

  /* -------------------- VIDEO CLICK -------------------- */
  const handleVideoClick = async (video, moduleId, mi, vi) => {
    console.log(`🎬 Video click: module=${mi}, video=${vi}, isLocked=${video.isLocked}, isCompleted=${video.isCompleted}`);
    
    const isUnlockable = checkVideoUnlockable(course, mi, vi);
    console.log(`🔓 Is unlockable: ${isUnlockable}`);
    
    if (!isUnlockable) {
      // ... existing code ...
      return;
    }

    // Set the video with latest state
    setOpenVideo(video);
    setCurrentModuleId(moduleId);
    setCurrentVideoIndex(vi);
    setIsVideoCompleted(video.isCompleted === true);
    
    // Force re-render for this video
    const updatedCourse = { ...course };
    const moduleIndex = updatedCourse.modules?.findIndex(m => m.id === moduleId);
    
    if (moduleIndex !== -1) {
      const videoIndex = updatedCourse.modules[moduleIndex]?.videos?.findIndex(v => v.id === video.id);
      if (videoIndex !== -1) {
        if (onCourseUpdate) {
          onCourseUpdate(updatedCourse);
        }
      }
    }
  };

  const handleVideoCompleted = async () => {
    if (!user?.id || !course?.id || !currentModuleId || !openVideo?.id) {
      alert("Unable to complete video. Please try again.");
      return;
    }

    // 1. IMMEDIATE UI UPDATE
    setIsVideoCompleted(true);
    
    // 2. Update openVideo state IMMEDIATELY
    setOpenVideo(prev => ({
      ...prev,
      isCompleted: true,
      isLocked: false
    }));
    
    // 3. Update course state IMMEDIATELY for instant tick
    const updatedCourse = JSON.parse(JSON.stringify(course));
    const moduleIndex = updatedCourse.modules?.findIndex(m => m.id === currentModuleId);
    
    if (moduleIndex !== -1) {
      const videoIndex = updatedCourse.modules[moduleIndex]?.videos?.findIndex(v => v.id === openVideo.id);
      if (videoIndex !== -1) {
        updatedCourse.modules[moduleIndex].videos[videoIndex].isCompleted = true;
        updatedCourse.modules[moduleIndex].videos[videoIndex].isLocked = false;
        
        // 4. SET COURSE STATE IMMEDIATELY (no waiting)
        setCourse(updatedCourse);
        
        // 5. Update parent state immediately for instant UI feedback
        if (onCourseUpdate) {
          console.log("🔄 Updating parent state after video completion");
          onCourseUpdate(updatedCourse);
        }
      }
    }
    
    setShowNextOverlay(true);

    try {
      // 6. API call - backend update
      await completeVideo(user.id, course.id, currentModuleId, openVideo.id);
      
      console.log("✅ Video marked as completed on backend");

      // 7. Do a QUICK refresh to sync with backend
      setTimeout(async () => {
        console.log("🔄 Quick refresh to sync with backend");
        
        try {
          const fresh = await getCourseById(course.id, user?.id);
          
          if (JSON.stringify(fresh) !== JSON.stringify(updatedCourse)) {
            setCourse(fresh);
            if (onCourseUpdate) onCourseUpdate(fresh);
          }
          
          setShowNextOverlay(false);

          // Auto-play next video if available
          const currentModule = fresh.modules?.find(m => m.id === currentModuleId);
          if (currentModule?.videos) {
            for (let vi = currentVideoIndex + 1; vi < currentModule.videos.length; vi++) {
              const nextVideo = currentModule.videos[vi];
              const isNextUnlockable = checkVideoUnlockable(fresh, openModuleIndex, vi);
              
              if (isNextUnlockable && !nextVideo.isLocked) {
                handleVideoClick(nextVideo, currentModuleId, openModuleIndex, vi);
                return;
              }
            }
          }
        } catch (err) {
          console.error("Silent refresh error:", err);
          setShowNextOverlay(false);
        }
      }, 1500);

    } catch (err) {
      console.error("Error completing video:", err);
      alert("Video marked as complete locally. Syncing with server may take a moment.");
      setShowNextOverlay(false);
    }
  };

  const handleAssessmentClick = async (assessment, moduleId) => {
    if (!assessment || !moduleId) {
      alert('Assessment data is missing');
      return;
    }

    if (!user?.id) {
      alert("Please login to take assessments");
      openLogin();
      return;
    }

    try {
      const canAttempt = await canAttemptAssessment(assessment.id, user.id);
      
      if (!canAttempt) {
        const module = course?.modules?.find(m => m.id === moduleId);
        const totalVideos = module?.videos?.length || 0;
        const completedVideos = module?.videos?.filter(v => v.isCompleted)?.length || 0;
        
        // Check if already passed
        const status = assessmentStatus[assessment.id];
        if (status?.passed) {
          alert('✅ You have already passed this assessment! The next module should be unlocked.');
          return;
        }
        
        alert(`Cannot attempt assessment. Please complete all ${totalVideos - completedVideos} remaining videos in this module first.`);
        return;
      }

      setCurrentAssessment({
        ...assessment,
        moduleId: moduleId
      });
      setShowAssessmentModal(true);

    } catch (err) {
      console.error("❌ Error handling assessment click:", err);
      alert("Failed to load assessment. Please check console for details.");
    }
  };

  /* -------------------- RENDER -------------------- */
  if (!course) {
    return (
      <div className={`mt-10 p-6 rounded-lg text-center border ${
        theme === 'dark' 
          ? 'bg-gray-800 border-gray-700 text-gray-300' 
          : 'bg-gray-50 border-gray-200 text-gray-800'
      }`}>
        <p className="font-semibold mb-2">
          Loading course content...
        </p>
        <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 rounded-full mx-auto"></div>
      </div>
    );
  }

  if (!course?.modules?.length) {
    return (
      <div className={`mt-6 p-4 text-center rounded-lg border ${
        theme === 'dark' 
          ? 'bg-gray-800 border-gray-700 text-gray-400' 
          : 'bg-gray-50 border-gray-200 text-gray-500'
      }`}>
        <p>No course content available yet.</p>
        <p className="text-sm mt-1">Check back later for updates.</p>
      </div>
    );
  }

  const calculateModuleProgress = (module) => {
    if (!module.videos?.length) return 0;
    const completedVideos = module.videos.filter(v => v.isCompleted).length;
    return Math.round((completedVideos / module.videos.length) * 100);
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Course Content</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {course.modules.length} modules • {course.modules.reduce((total, m) => total + (m.videos?.length || 0), 0)} videos
      </p>

      {/* MODULES LIST */}
      {course.modules.map((module, mi) => {
        const progress = calculateModuleProgress(module);
        const hasAssessment = !!moduleAssessments[module.id];
        const assessment = moduleAssessments[module.id] || null;
        const assessmentStatusData = assessment ? assessmentStatus[assessment.id] : null;

        return (
          <div key={module.id} className={`border rounded-lg mb-4 overflow-hidden shadow-sm ${
            theme === 'dark' 
              ? 'border-gray-700 bg-gray-800' 
              : 'border-gray-200 bg-white'
          }`}>
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
                module.isLocked 
                  ? theme === 'dark' 
                    ? "bg-gray-800 hover:bg-gray-750" 
                    : "bg-gray-100 hover:bg-gray-200"
                  : theme === 'dark'
                    ? "bg-gray-800 hover:bg-gray-750"
                    : "bg-white hover:bg-gray-50"
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className={`text-sm font-medium px-2 py-1 rounded ${
                    theme === 'dark'
                      ? 'bg-blue-900/40 text-blue-300'
                      : 'bg-blue-50 text-blue-600'
                  }`}>
                    Module {mi + 1}
                  </span>
                  {module.isLocked && (
                    <span className={`text-xs px-2 py-1 rounded ${
                      theme === 'dark'
                        ? 'bg-red-900/30 text-red-300'
                        : 'bg-red-50 text-red-600'
                    }`}>Locked</span>
                  )}
                  {!module.isLocked && module.videos?.[0]?.isLocked && mi > 0 && (
                    <span className={`text-xs px-2 py-1 rounded ${
                      theme === 'dark'
                        ? 'bg-yellow-900/30 text-yellow-300'
                        : 'bg-yellow-50 text-yellow-600'
                    }`}>
                      Module unlocked, click first video to unlock
                    </span>
                  )}
                  {progress === 100 && (
                    <span className={`text-xs px-2 py-1 rounded ${
                      theme === 'dark'
                        ? 'bg-green-900/30 text-green-300'
                        : 'bg-green-50 text-green-600'
                    }`}>Completed</span>
                  )}
                </div>
                <p className="font-semibold text-gray-800 dark:text-white">{module.title}</p>
                <div className="flex items-center gap-4 mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {module.videos?.length || 0} videos
                  </p>
                  {progress > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 dark:bg-green-600 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">{progress}%</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {module.isLocked ? (
                  <Lock size={18} className="text-gray-400 dark:text-gray-500" />
                ) : openModuleIndex === mi ? (
                  <ChevronUp size={20} className="text-gray-600 dark:text-gray-400" />
                ) : (
                  <ChevronDown size={20} className="text-gray-600 dark:text-gray-400" />
                )}
              </div>
            </div>

            {/* MODULE CONTENT */}
            {openModuleIndex === mi && !module.isLocked && (
              <div className={`border-t ${
                theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
              }`}>
                {/* VIDEOS LIST */}
                <div className="p-4">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Videos in this module:</h4>
                  {module.videos?.map((video, vi) => {
                    const isUnlockable = checkVideoUnlockable(course, mi, vi);

                    const videoToShow = openVideo?.id === video.id ? openVideo : video;
                    
                    return (
                      <div
                        key={video.id}
                        onClick={() => isUnlockable && handleVideoClick(video, module.id, mi, vi)}
                        className={`flex items-center gap-3 py-3 px-2 border-b last:border-b-0 transition-colors rounded ${
                          theme === 'dark' 
                            ? 'border-gray-700' 
                            : 'border-gray-200'
                        } ${
                          !isUnlockable || video.isLocked
                            ? theme === 'dark'
                              ? "opacity-60 cursor-not-allowed bg-gray-800"
                              : "opacity-60 cursor-not-allowed bg-gray-50"
                            : theme === 'dark'
                              ? "cursor-pointer hover:bg-gray-750"
                              : "cursor-pointer hover:bg-blue-50"
                        } ${
                          openVideo?.id === video.id ? (
                            theme === 'dark'
                              ? "bg-blue-900/20 border-l-4 border-blue-500"
                              : "bg-blue-100 border-l-4 border-blue-500"
                          ) : ""
                        }`}
                      >
                        <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${
                           videoToShow.isCompleted 
                            ? theme === 'dark'
                              ? "bg-green-900/40 text-green-400"
                              : "bg-green-100 text-green-600"
                            : !isUnlockable || video.isLocked 
                              ? theme === 'dark'
                                ? "bg-gray-700 text-gray-500"
                                : "bg-gray-200 text-gray-500"
                              : theme === 'dark'
                                ? "bg-blue-900/40 text-blue-400"
                                : "bg-blue-100 text-blue-600"
                        }`}>
                          {video.isCompleted ? (
                            <Check size={16} />
                          ) : !isUnlockable || video.isLocked ? (
                            <Lock size={14} />
                          ) : (
                            <Play size={14} />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            video.isCompleted 
                              ? "text-gray-600 dark:text-gray-400" 
                              : "text-gray-800 dark:text-white"
                          }`}>
                            {video.title}
                            {openVideo?.id === video.id && (
                              <span className="ml-2 text-xs text-blue-500 dark:text-blue-400 animate-pulse">▶ Playing</span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            Duration: {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
                          </p>
                          {!isUnlockable && vi === 0 && mi > 0 && !video.isLocked && (
                            <p className="text-xs text-green-500 dark:text-green-400 mt-1">
                              ✓ Module unlocked, click to start first video
                            </p>
                          )}
                          {!isUnlockable && video.isLocked && vi === 0 && mi > 0 && (
                            <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                              Module unlocked but video is locked. Try clicking to unlock.
                            </p>
                          )}
                        </div>
                        
                        <div className="flex-shrink-0">
                          {video.isPreview && (
                            <span className={`text-xs px-2 py-1 rounded ${
                              theme === 'dark'
                                ? 'bg-yellow-900/30 text-yellow-300'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>Preview</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ASSESSMENT SECTION */}
                {hasAssessment && (
                  <div className="mt-4 border-t dark:border-gray-700 pt-4">
                    <div className="px-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <FileText size={18} className="text-purple-600 dark:text-purple-400" />
                          Module Assessment
                        </h4>
                        {assessmentStatusData && (
                          <span className={`text-xs px-2 py-1 rounded ${
                            assessmentStatusData.passed 
                              ? theme === 'dark'
                                ? "bg-green-900/30 text-green-300"
                                : "bg-green-100 text-green-800"
                              : theme === 'dark'
                                ? "bg-yellow-900/30 text-yellow-300"
                                : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {assessmentStatusData.passed ? "Passed" : "Not Passed"}
                          </span>
                        )}
                      </div>
                      
                      <div className={`border rounded-lg p-4 ${
                        theme === 'dark'
                          ? 'bg-purple-900/20 border-purple-800/30'
                          : 'bg-purple-50 border-purple-100'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-800 dark:text-white">{assessment.title || "Module Assessment"}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Test your knowledge after completing all videos in this module.
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              {assessmentStatusData && user?.id ? (
                                <>
                                  <span className="text-xs text-gray-500 dark:text-gray-500">
                                    Score: {assessmentStatusData.obtainedMarks || 0}/{assessmentStatusData.totalMarks || 100}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-500">
                                    Attempts: {assessmentStatusData.attempts || 0}
                                  </span>
                                </>
                              ) : !user?.id ? (
                                <span className="text-xs text-yellow-600 dark:text-yellow-400">
                                  Login to view your scores
                                </span>
                              ) : null}
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleAssessmentClick(assessment, module.id)}
                            disabled={!isModuleAssessmentAvailable(module)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                              !isModuleAssessmentAvailable(module)
                                ? theme === 'dark'
                                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-purple-600 dark:bg-purple-700 text-white hover:bg-purple-700 dark:hover:bg-purple-600"
                            }`}
                          >
                            {!user?.id ? "Login to Take" : 
                             assessmentStatusData?.passed ? "Retake" : "Take Assessment"}
                          </button>
                        </div>
                        
                        {!isModuleAssessmentAvailable(module) && (
                          <div className={`mt-3 text-sm p-2 rounded border ${
                            theme === 'dark'
                              ? 'bg-gray-800 border-gray-700 text-gray-400'
                              : 'bg-white border-gray-200 text-gray-600'
                          }`}>
                            ⚠️ Complete all videos in this module to unlock the assessment.
                            {module.videos?.filter(v => !v.isCompleted).length > 0 && (
                              <span className={`font-medium ml-1 ${
                                theme === 'dark' ? 'text-red-400' : 'text-red-600'
                              }`}>
                                {module.videos.filter(v => !v.isCompleted).length} videos remaining
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* NEXT MODULE AVAILABLE STATUS */}
                {isNextModuleAvailable(course, mi) && (
                  <div className="mt-4 px-4">
                    <div className={`border rounded-lg p-4 ${
                      theme === 'dark'
                        ? 'bg-blue-900/20 border-blue-800/30'
                        : 'bg-blue-50 border-blue-200'
                    }`}>
                      <div className="flex items-center gap-3">
                        <Check size={20} className="text-blue-600 dark:text-blue-400" />
                        <div>
                          <p className="font-medium text-blue-800 dark:text-blue-300">Module Completed!</p>
                          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                            ✅ Assessment passed! Next module is now unlocked.
                          </p>
                          {mi < course.modules.length - 1 && (
                            <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                              First video of next module is now available.
                            </p>
                          )}
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
              <div className={`text-white text-center p-8 rounded-lg max-w-md ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-gray-900'
              }`}>
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
              onVideoCompleted={(videoId) => {
                handleVideoCompleted();
              }}
              userId={user?.id}
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
                  
                  const currentModule = course.modules[openModuleIndex];
                  if (!currentModule?.videos) return;
                  
                  for (let vi = currentVideoIndex + 1; vi < currentModule.videos.length; vi++) {
                    const nextVideo = currentModule.videos[vi];
                    const isNextUnlockable = checkVideoUnlockable(course, openModuleIndex, vi);
                    
                    if (isNextUnlockable && !nextVideo.isLocked) {
                      handleVideoClick(nextVideo, currentModuleId, openModuleIndex, vi);
                      return;
                    }
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
            // Refresh course data when closing assessment modal
            refreshCourse();
          }}
          onComplete={handleAssessmentComplete}
          userId={user?.id}
          courseId={course.id}
          theme={theme}
        />
      )}

      {/* ASSESSMENT RESULT MODAL (Like Mobile App) */}
      {showResultModal && assessmentResult && (
        <AssessmentResultModal
          result={assessmentResult}
          onClose={() => {
            setShowResultModal(false);
            setAssessmentResult(null);
            // Refresh course data when closing result modal
            refreshCourse();
          }}
          onRetake={() => {
            setShowResultModal(false);
            setAssessmentResult(null);
            // Reopen assessment modal for retake
            if (currentAssessment) {
              setShowAssessmentModal(true);
            }
          }}
          theme={theme}
        />
      )}

      {/* LOADING OVERLAY */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex items-center justify-center">
          <div className={`rounded-lg p-8 flex flex-col items-center ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 rounded-full mb-4"></div>
            <p className="text-gray-700 dark:text-gray-300">Updating course data...</p>
          </div>
        </div>
      )}
    </div>
  );
}