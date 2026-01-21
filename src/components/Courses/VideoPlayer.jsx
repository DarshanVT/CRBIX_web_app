import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as courseApi from '../../Api/course.api';
import { useToast } from '../../hooks/useToast';
import { CheckCircle, Loader, AlertCircle, ExternalLink } from 'lucide-react';

const VideoPlayer = ({
  video,
  moduleId,
  courseId,
  userId,
  onVideoCompleted,
  onProgressUpdate
}) => {
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(video?.duration || 0);
  const [watchedSeconds, setWatchedSeconds] = useState(0);
  const [isCompleted, setIsCompleted] = useState(video?.isCompleted || video?.completed || false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [completionTriggered, setCompletionTriggered] = useState(false);
  
  const { showToast } = useToast();

  // ✅ FIX: updateProgress function ko pehle define karo
  const updateProgress = useCallback(async (watchedSecs) => {
    try {
      if (!userId || !video?.id) return;
      
      await courseApi.updateVideoProgress(
        userId,
        video.id,
        watchedSecs,
        currentTime,
        0
      );
      
      if (onProgressUpdate) {
        onProgressUpdate(watchedSecs);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  }, [userId, video?.id, currentTime, onProgressUpdate]);

  // Get video URL - handle both 'url' and 'videoUrl' properties
  const getVideoUrl = () => {
    console.log("📹 Video object received:", video);
    console.log("📹 Video completion status:", video?.isCompleted);
    
    // Try 'videoUrl' first (from backend entity), then 'url'
    return video?.videoUrl || video?.url;
  };

  const videoUrl = getVideoUrl();

  useEffect(() => {
    console.log("📹 Video component mounted/updated:", {
      videoId: video?.id,
      isCompleted: video?.isCompleted,
      localIsCompleted: isCompleted
    });
    
    // Sync with incoming video state
    if (video?.isCompleted !== undefined && video?.isCompleted !== isCompleted) {
      console.log("🔄 Syncing completion state from prop:", video.isCompleted);
      setIsCompleted(video.isCompleted);
      setCompletionTriggered(false);
    }
    
    if (videoRef.current && videoUrl) {
      const videoElement = videoRef.current;
      
      videoElement.addEventListener('loadedmetadata', () => {
        const videoDuration = videoElement.duration || video?.duration || 0;
        setDuration(videoDuration);
        console.log("📹 Video metadata loaded, duration:", videoDuration);
      });
      
      videoElement.addEventListener('error', (e) => {
        console.error('❌ Video loading error:', e);
        console.error('Video element error details:', videoElement.error);
        setVideoError(true);
      });
      
      videoElement.addEventListener('canplay', () => {
        console.log("✅ Video can play");
        setVideoError(false);
      });
      
      // Reset video state when video changes
      setCurrentTime(0);
      setWatchedSeconds(0);
      setVideoError(false);
      setCompletionTriggered(false);
    }
    
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('loadedmetadata', () => {});
        videoRef.current.removeEventListener('error', () => {});
        videoRef.current.removeEventListener('canplay', () => {});
      }
    };
  }, [videoUrl, video]);

  const markVideoAsCompleted = useCallback(async () => {
    try {
      if (!userId || !courseId || !moduleId || !video?.id) {
        console.error('Missing required parameters for video completion');
        showToast('Cannot complete video: Missing information', 'error');
        return null;
      }
      
      console.log('📝 Marking video as completed:', {
        userId, courseId, moduleId, videoId: video.id
      });
      
      const response = await courseApi.completeVideo(
        userId,
        courseId,
        moduleId,
        video.id
      );
      
      console.log('✅ Video completion response:', response);
      
      if (response.success) {
        if (response.completed) {
          // ✅ SET IMMEDIATE UI STATE
          setIsCompleted(true);
          setCompletionTriggered(true);
          showToast('Video completed! Next content unlocked.', 'success');
          
          // ✅ Trigger callback to update parent
          if (onVideoCompleted) {
            console.log("🔄 Calling onVideoCompleted callback");
            onVideoCompleted(video.id);
          }
        } else {
          // Video was processed but not marked as completed
          console.warn('Video processed but not marked as completed:', response);
          showToast(response.message || 'Video progress saved', 'info');
        }
      } else {
        showToast(response.message || 'Failed to complete video', 'error');
      }
      
      return response;
    } catch (error) {
      console.error('Error marking video as completed:', error);
      showToast('Failed to complete video', 'error');
      throw error;
    }
  }, [userId, courseId, moduleId, video?.id, onVideoCompleted, showToast]);

  const handleAutoCompletion = useCallback(async () => {
    if (isCompleted || loading || completionTriggered) {
      console.log("⏸️ Skipping auto-completion:", { isCompleted, loading, completionTriggered });
      return;
    }
    
    // Check if at least 95% of video was watched
    const watchedPercentage = (watchedSeconds / duration) * 100;
    const isVideoEnding = currentTime >= duration - 2;
    
    if (watchedPercentage >= 95 || isVideoEnding) {
      console.log('🎬 Auto-completing video:', {
        watchedPercentage,
        currentTime,
        duration,
        isVideoEnding,
        isShortVideo: duration < 30
      });
      
      setLoading(true);
      try {
        const result = await markVideoAsCompleted();
        console.log('✅ Auto-completion result:', result);
        
        if (result?.success) {
          // Show toast only if not already shown by markVideoAsCompleted
          if (!result.completed) {
            showToast('Video completed! Next content unlocked.', 'success');
          }
        } else {
          showToast(result?.message || 'Video processed', 'info');
        }
      } catch (error) {
        console.error('Auto-completion failed:', error);
        showToast('Failed to complete video', 'error');
      } finally {
        setLoading(false);
      }
    }
  }, [isCompleted, loading, duration, watchedSeconds, currentTime, completionTriggered, markVideoAsCompleted, showToast]);

  // 🔥 CRITICAL FIX: Add video ended event handler
  useEffect(() => {
    const videoElement = videoRef.current;
    
    const handleEnded = () => {
      console.log("🎬 Video ended event fired");
      if (!isCompleted && !completionTriggered) {
        console.log("🔄 Triggering completion from ended event");
        handleAutoCompletion();
      }
    };
    
    if (videoElement) {
      videoElement.addEventListener('ended', handleEnded);
    }
    
    return () => {
      if (videoElement) {
        videoElement.removeEventListener('ended', handleEnded);
      }
    };
  }, [handleAutoCompletion, isCompleted, completionTriggered]);

  // Track watch time - OPTIMIZED VERSION
  useEffect(() => {
    let progressInterval;
    
    if (videoRef.current && isPlaying && !isCompleted) {
      progressInterval = setInterval(() => {
        const videoElement = videoRef.current;
        if (videoElement && videoElement.duration > 0) {
          const time = Math.floor(videoElement.currentTime);
          setCurrentTime(time);
          
          // Update watched seconds
          if (time > watchedSeconds) {
            setWatchedSeconds(time);
            
            // Send progress update every 15 seconds
            if (time > 0 && time % 15 === 0) {
              updateProgress(time); // ✅ Yeh ab defined hai
            }
          }
          
          // Check for auto-completion at 95% or end
          const duration = videoElement.duration;
          const timeRemaining = duration - videoElement.currentTime;
          const watchedPercentage = (videoElement.currentTime / duration) * 100;
          
          if ((watchedPercentage >= 95 || timeRemaining <= 2) && !isCompleted && !completionTriggered) {
            console.log('⏰ Video ending soon, preparing to complete');
            handleAutoCompletion();
          }
        }
      }, 500);
    }
    
    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isPlaying, isCompleted, watchedSeconds, completionTriggered, handleAutoCompletion, updateProgress]); // ✅ Added updateProgress dependency

  const handleManualComplete = async () => {
    if (isCompleted || loading) return;
    
    const confirm = window.confirm('Mark this video as completed? You will need to watch it fully to understand the concepts.');
    if (confirm) {
      setLoading(true);
      try {
        const result = await markVideoAsCompleted();
        if (result?.success) {
          showToast('Video marked as completed!', 'success');
        } else {
          showToast('Failed to mark video as completed', 'error');
        }
      } catch (error) {
        showToast('Failed to mark video as completed', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getProgressPercentage = () => {
    if (!duration || duration === 0) return 0;
    return Math.min(100, (currentTime / duration) * 100);
  };

  // Add debug info
  useEffect(() => {
    console.log("🎯 VideoPlayer State:", {
      videoId: video?.id,
      isCompleted,
      completionTriggered,
      currentTime,
      duration,
      watchedSeconds
    });
  }, [video?.id, isCompleted, completionTriggered, currentTime, duration, watchedSeconds]);

  if (!video) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <p className="text-gray-500">No video available</p>
      </div>
    );
  }

  if (!videoUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg p-4">
        <AlertCircle className="text-yellow-500 mb-2" size={48} />
        <p className="text-gray-700 font-medium mb-1">Video URL Missing</p>
        <p className="text-gray-500 text-sm text-center mb-4">
          The video doesn't have a valid URL. Please check the video data.
        </p>
        <div className="text-xs text-gray-600 bg-gray-200 p-2 rounded">
          <p>Video ID: {video.id}</p>
          <p>Title: {video.title}</p>
          <p>Duration: {video.duration} seconds</p>
          <p>Completed: {video.isCompleted ? 'Yes' : 'No'}</p>
        </div>
      </div>
    );
  }

  if (videoError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg p-4">
        <AlertCircle className="text-red-500 mb-2" size={48} />
        <p className="text-gray-700 font-medium mb-1">Video failed to load</p>
        <p className="text-gray-500 text-sm mb-2">URL: {videoUrl.substring(0, 50)}...</p>
        <div className="flex gap-2 mt-4">
          <button 
            onClick={() => {
              setVideoError(false);
              if (videoRef.current) {
                videoRef.current.load();
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Retry
          </button>
          <a 
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm flex items-center gap-1"
          >
            <ExternalLink size={14} />
            Open Directly
          </a>
        </div>
      </div>
    );
  }
  

  return (
    <div className="video-player-container bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Video Player Section */}
      <div className="video-wrapper relative bg-black">
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          className="w-full h-auto max-h-[500px]"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            console.log("📹 Video ended - onEnded fired");
            // Handled by event listener
          }}
          playsInline
          preload="metadata"
        />
        
        {/* Debug overlay */}
        <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          {isCompleted ? "✅ Completed" : "▶️ Playing"}
        </div>
      </div>
      
      {/* Video Info Section */}
      <div className="video-info p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{video.title}</h3>
        
        {/* Progress Bar */}
        <div className="progress-info mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progress: {Math.round(getProgressPercentage())}%
            </span>
            <span className="text-sm text-gray-500">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          <div className="progress-bar h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="progress-fill h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>
        
        {/* Completion Status & Actions */}
        <div className="video-actions">
          {isCompleted ? (
            <div className="completed-message bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-700 mb-2">
                <CheckCircle size={20} />
                <span className="font-medium">Video Completed</span>
              </div>
              <p className="text-green-600 text-sm">
                Great job! You've completed this video. Next content is unlocked.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={handleManualComplete}
                className="btn-complete flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !userId}
              >
                {loading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Mark as Complete
                  </>
                )}
              </button>
              
              {!userId && (
                <div className="text-center text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
                  Login required to track progress
                </div>
              )}
              
              <div className="completion-hint text-center">
                <small className="text-gray-500 text-sm">
                  {watchedSeconds > 0 ? (
                    `You've watched ${formatTime(watchedSeconds)} of this video`
                  ) : (
                    "Complete this video to unlock next content"
                  )}
                </small>
              </div>
            </div>
          )}
        </div>
        
        {/* Video Stats */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Duration:</span>
              <span className="ml-2 font-medium">{formatTime(duration)}</span>
            </div>
            <div>
              <span className="text-gray-500">Status:</span>
              <span className={`ml-2 font-medium ${isCompleted ? 'text-green-600' : 'text-blue-600'}`}>
                {isCompleted ? 'Completed' : 'In Progress'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;