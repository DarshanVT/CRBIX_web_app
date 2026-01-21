// src/hooks/useCourseProgress.jsx
import { useState, useEffect, useCallback } from 'react';
import * as courseApi from '../Api/course.api';

export const useCourseProgress = (courseId, userId) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({
    totalVideos: 0,
    completedVideos: 0,
    progressPercentage: 0
  });

  // Fetch course with user progress
  const fetchCourseWithProgress = useCallback(async () => {
    if (!userId || !courseId) return;
    
    try {
      setLoading(true);
      // Using getCourseById from your API
      const data = await courseApi.getCourseById(courseId, userId);
      setCourse(data);
      
      if (!data) {
        setError('Course not found');
        return;
      }
      
      // Calculate progress
      let totalVideos = 0;
      let completedVideos = 0;
      
      // Check if data has modules array
      if (data.modules && Array.isArray(data.modules)) {
        data.modules.forEach(module => {
          if (module.videos && Array.isArray(module.videos)) {
            module.videos.forEach(video => {
              totalVideos++;
              // Check based on your API response format
              if (video.completed || video.isCompleted) {
                completedVideos++;
              }
            });
          }
        });
      }
      
      const progressPercentage = totalVideos > 0 ? 
        Math.round((completedVideos / totalVideos) * 100) : 0;
      
      setProgress({
        totalVideos,
        completedVideos,
        progressPercentage
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch course');
      console.error('Error fetching course progress:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, courseId]);

  // Complete video and unlock next content
  const completeVideo = useCallback(async (moduleId, videoId) => {
    if (!userId || !courseId) return null;
    
    try {
      const response = await courseApi.completeVideo(userId, courseId, moduleId, videoId);
      
      // Refresh course data to get updated locks
      await fetchCourseWithProgress();
      
      return response;
    } catch (err) {
      console.error('Error completing video:', err);
      throw err;
    }
  }, [userId, courseId, fetchCourseWithProgress]);

  // Check if video is unlockable based on purchased user logic
  const isVideoUnlockable = useCallback((moduleIndex, videoIndex) => {
    if (!course || !course.isPurchased) {
      // Non-purchased user: only first video of first module
      return moduleIndex === 0 && videoIndex === 0;
    }
    
    // Purchased user logic
    if (moduleIndex === 0) {
      // First module: first 3 videos unlocked
      if (videoIndex < 3) return true;
      
      // For video 4+, check if all previous videos are completed
      if (videoIndex >= 3) {
        const module = course.modules?.[0];
        const videos = module?.videos || [];
        const previousVideos = videos.slice(0, videoIndex);
        return previousVideos.every(v => v.completed || v.isCompleted);
      }
    }
    
    // Other modules: check if previous module is completed
    if (moduleIndex > 0) {
      const previousModule = course.modules?.[moduleIndex - 1];
      if (!previousModule) return false;
      
      // Check if all videos in previous module are completed
      const previousVideos = previousModule.videos || [];
      const allPrevVideosCompleted = previousVideos.every(v => v.completed || v.isCompleted);
      
      // For first video of module
      if (videoIndex === 0) {
        return allPrevVideosCompleted;
      }
      
      // For other videos: check previous video completion
      const currentModule = course.modules?.[moduleIndex];
      const currentVideos = currentModule?.videos || [];
      if (videoIndex > 0 && videoIndex < currentVideos.length) {
        const previousVideo = currentVideos[videoIndex - 1];
        return previousVideo?.completed || previousVideo?.isCompleted || false;
      }
    }
    
    return false;
  }, [course]);

  // Check if assessment is available
  const isAssessmentAvailable = useCallback((moduleIndex) => {
    if (!course || !course.modules?.[moduleIndex]) return false;
    
    const module = course.modules[moduleIndex];
    const videos = module.videos || [];
    if (videos.length === 0) return false;
    
    // Check if all videos in module are completed
    return videos.every(video => video?.completed || video?.isCompleted);
  }, [course]);

  // Check if next module is available (assessment passed)
  const isNextModuleAvailable = useCallback((moduleIndex) => {
    if (!course || !course.modules?.[moduleIndex]) return false;
    
    const module = course.modules[moduleIndex];
    const isAssessmentPassed = module.assessmentPassed || false;
    const videos = module.videos || [];
    const allVideosCompleted = videos.every(v => v?.completed || v?.isCompleted);
    
    return allVideosCompleted && isAssessmentPassed;
  }, [course]);

  // Submit assessment
  const submitAssessment = useCallback(async (assessmentId, answers) => {
    try {
      const result = await courseApi.submitAssessment(assessmentId, answers);
      
      if (result?.success || result?.passed) {
        // Refresh course data
        await fetchCourseWithProgress();
      }
      
      return result;
    } catch (error) {
      console.error('Error submitting assessment:', error);
      throw error;
    }
  }, [fetchCourseWithProgress]);

  useEffect(() => {
    if (userId && courseId) {
      fetchCourseWithProgress();
    }
  }, [userId, courseId, fetchCourseWithProgress]);

  return {
    course,
    loading,
    error,
    progress,
    fetchCourseWithProgress,
    completeVideo,
    isVideoUnlockable,
    isAssessmentAvailable,
    isNextModuleAvailable,
    submitAssessment
  };
};