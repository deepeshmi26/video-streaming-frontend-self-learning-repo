import React, { useState } from 'react';
import { progressContainer, progressBar, bufferBar, thumbnailPreview, timeTooltip } from '../styles/progress';

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
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeaveWrapper = (e) => {
    setIsHovering(false);
    onMouseLeave(e);
  };

  return (
    <div
      style={{
        position: 'relative',
        padding: '10px 0',
        cursor: 'pointer',
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

      {/* Hover time tooltip */}
      {isHovering && hoverTime !== null && (
        <div
          style={{
            ...timeTooltip,
            left: `${(hoverTime / videoDuration) * 100}%`,
          }}
        >
          {formatTime(hoverTime)}
        </div>
      )}

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
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#000',
          }}
        />
      )}
    </div>
  );
};

export default ProgressBar;