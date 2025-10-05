import { useState, useEffect } from "react";
import Hls from "hls.js";

/**
 * Hook to handle HLS video setup and quality management
 * @param {Object} params
 * @param {string} params.src - HLS source URL
 * @param {React.RefObject} params.videoRef - Reference to video element
 * @returns {Object} HLS state and controls
 */
const useHls = ({ src, videoRef }) => {
  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(-1);
  const [hlsInstance, setHlsInstance] = useState(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls = null;

    if (Hls.isSupported()) {
      hls = new Hls();
      setHlsInstance(hls);

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        setLevels(data.levels || []);
        setCurrentLevel(-1);
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        setCurrentLevel(data.level);
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    }

    return () => {
      if (hls) {
        hls.destroy();
        setHlsInstance(null);
      }
    };
  }, [src, videoRef]);

  const handleQualityChange = (levelIndex) => {
    if (hlsInstance) {
      hlsInstance.currentLevel = levelIndex; // -1 = Auto
      setCurrentLevel(levelIndex);
    }
  };

  return {
    levels,
    currentLevel,
    handleQualityChange,
    hlsInstance,
  };
};

export default useHls;
