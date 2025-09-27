import React, { useState } from "react";
import {
  progressContainer,
  progressBar,
  bufferBar,
  thumbnailPreview,
  timeTooltip,
} from "../styles/progress";

/**
 * Video progress bar component with modern design
 */
const ProgressBar = ({
  progress,
  buffered,
  hoverTime,
  hoverThumb,
  videoDuration,
  onSeek,
  onMouseMove,
  onMouseLeave,
}) => {
  const [isHovering, setIsHovering] = useState(false);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s
        .toString()
        .padStart(2, "0")}`;
    }
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeaveWrapper = (e) => {
    setIsHovering(false);
    onMouseLeave(e);
  };

  const currentTime = (progress / 100) * videoDuration;

  return (
    <div
      style={{
        position: "relative",
        cursor: "pointer",
      }}
      onClick={onSeek}
      onMouseMove={onMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeaveWrapper}
    >
      <div style={progressContainer}>
        {/* Buffer progress */}
        <div
          style={{
            ...bufferBar,
            width: `${buffered}%`,
          }}
        />

        {/* Playback progress */}
        <div
          style={{
            ...progressBar,
            width: `${progress}%`,
          }}
        />
      </div>

      {/* Time display */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between",
        fontSize: "12px",
        color: "#fff",
        marginTop: "4px"
      }}>
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(videoDuration)}</span>
      </div>

      <div>
        {/* Thumbnail preview */}
        {hoverThumb && (
          <div
            style={{
              ...thumbnailPreview,
              left: `${(hoverTime / videoDuration) * 100}%`,
              width: hoverThumb.w,
              height: hoverThumb.h,
              backgroundImage: `url(${hoverThumb.url})`,
              backgroundPosition: `-${hoverThumb.x}px -${hoverThumb.y}px`,
              backgroundRepeat: "no-repeat",
              backgroundColor: "#000",
            }}
          />
        )}

        {/* Hover time tooltip */}
        {isHovering && hoverTime !== null && (
          <div
            style={{
              ...timeTooltip,
              left: `${(hoverTime / videoDuration) * 100}%`,
              bottom: "auto", // Remove bottom positioning
              top: "100%", // Position below instead of above
              marginBottom: 0, // Remove bottom margin
              marginTop: "4px", // Add top margin instead
            }}
          >
            {formatTime(hoverTime)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;
