import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

const VideoPlayer = ({ src }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(-1); // -1 = auto

  useEffect(() => {
    if (videoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hlsRef.current = hls;

        hls.loadSource(src);
        hls.attachMedia(videoRef.current);

        // When manifest parsed → get available quality levels
        hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
          setLevels(data.levels);
        });

        // Track quality changes
        hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
          setCurrentLevel(data.level);
        });
      } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        // Safari native HLS
        videoRef.current.src = src;
      }
    }
  }, [src]);

  const handleQualityChange = (levelIndex) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelIndex; // -1 = auto
      setCurrentLevel(levelIndex);
    }
  };

  return (
    <div>
      <video
        ref={videoRef}
        controls
        autoPlay
        style={{ width: "100%", maxHeight: "500px" }}
      />

      <div style={{ marginTop: "10px" }}>
        <span>Quality: </span>
        <button
          onClick={() => handleQualityChange(-1)}
          disabled={currentLevel === -1}
        >
          Auto
        </button>
        {levels.map((level, i) => (
          <button
            key={i}
            onClick={() => handleQualityChange(i)}
            disabled={currentLevel === i}
          >
            {level.height}p
          </button>
        ))}
      </div>
    </div>
  );
};

export default VideoPlayer;