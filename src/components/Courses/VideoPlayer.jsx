import { useEffect, useRef } from "react";
import {
  updateVideoProgress,
  completeVideo,
} from "../../Api/course.api";
import { useAuth } from "../Login/AuthContext";

export default function VideoPlayer({ courseId, moduleId, video,  onCompleted, }) {
  const videoRef = useRef(null);
  const { user } = useAuth();


  useEffect(() => {
    if (videoRef.current && video.lastPositionSeconds) {
      videoRef.current.currentTime = video.lastPositionSeconds;
    }
  }, [video]);


  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;

    const current = Math.floor(v.currentTime);

    if (current % 5 === 0) {
      updateVideoProgress(
        user.id,
        video.id,
        current,
        current,
        0
      );
    }
  };


  const handlePause = () => {
    const v = videoRef.current;
    if (!v) return;

    updateVideoProgress(
      user.id,
      video.id,
      Math.floor(v.currentTime),
      Math.floor(v.currentTime),
      0
    );
  };


  const handleEnded = async () => {
    await completeVideo(
      user.id,
      courseId,
      moduleId,
      video.id
    );
       if (typeof onCompleted === "function") {
      onCompleted(video.id);
    }
  };

  return (
    <video
      ref={videoRef}
      src={video.videoUrl}
      controls
      autoPlay
      className="w-full h-full"
      onTimeUpdate={handleTimeUpdate}
      onPause={handlePause}
      onEnded={handleEnded}
    />
  );
}