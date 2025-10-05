import { useState, useEffect } from "react";

/**
 * Hook to track video progress and buffer state
 * @param {Object} params
 * @param {React.RefObject} params.videoRef - Reference to video element
 * @param {number} [params.initialProgressPercent=0] - Initial progress percent [0-100]
 * @returns {Object} Progress state and controls
 */
const useVideoProgress = ({ videoRef, initialProgressPercent = 0 }) => {
  const [progress, setProgress] = useState(initialProgressPercent);
  const [buffered, setBuffered] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateUI = () => {
      if (!video.duration || isNaN(video.duration)) return;

      // Update progress
      setProgress((video.currentTime / video.duration) * 100);

      // Update buffer
      if (video.buffered && video.buffered.length > 0) {
        const end = video.buffered.end(video.buffered.length - 1);
        setBuffered((end / video.duration) * 100);
      } else {
        setBuffered(0);
      }
    };

    video.addEventListener("timeupdate", updateUI);
    video.addEventListener("progress", updateUI);
    video.addEventListener("loadedmetadata", updateUI);

    return () => {
      video.removeEventListener("timeupdate", updateUI);
      video.removeEventListener("progress", updateUI);
      video.removeEventListener("loadedmetadata", updateUI);
    };
  }, [videoRef]);

  const handleSeek = (e) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const newProgress =
      parseFloat(e.nativeEvent.offsetX / e.currentTarget.offsetWidth) * 100;
    setProgress(newProgress);
    video.currentTime = (newProgress / 100) * video.duration;
  };

  return {
    progress,
    buffered,
    handleSeek,
  };
};

export default useVideoProgress;
