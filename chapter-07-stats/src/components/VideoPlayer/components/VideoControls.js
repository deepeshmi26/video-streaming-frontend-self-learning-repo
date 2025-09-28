import React from "react";
import {
  controlsContainer,
  button,
  volumeSlider,
  select,
} from "../styles/controls";

/**
 * Video player controls component with modern UI
 */
const VideoControls = ({
  isPlaying,
  volume,
  currentLevel,
  levels,
  activeSubtitle,
  externalTracks,
  hlsTracks,
  onPlayPause,
  onVolumeChange,
  onFullscreen,
  onQualityChange,
  onSubtitleChange,
}) => {
  return (
    <div style={controlsContainer}>
      <button style={button} onClick={onPlayPause}>
        {isPlaying ? "⏸" : "▶"}
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "16px" }}>🔊</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={onVolumeChange}
          style={volumeSlider}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <select
          style={select}
          value={currentLevel}
          onChange={(e) => onQualityChange(parseInt(e.target.value, 10))}
        >
          <option value={-1}>Auto</option>
          {levels.map((level, i) => (
            <option key={i} value={i}>
              {level.height ? `${level.height}p` : `Level ${i}`}
            </option>
          ))}
        </select>

        {(externalTracks.length > 0 || hlsTracks.length > 0) && (
          <select
            style={select}
            value={activeSubtitle}
            onChange={(e) => onSubtitleChange(e.target.value)}
          >
            <option value="off">CC Off</option>
            {externalTracks.map((track) => (
              <option key={track.id} value={track.id}>
                {track.label}
              </option>
            ))}
            {hlsTracks.map((track) => (
              <option key={track.id} value={track.id}>
                {track.label}
              </option>
            ))}
          </select>
        )}

        <button style={button} onClick={onFullscreen}>
          ⛶
        </button>
      </div>
    </div>
  );
};

export default VideoControls;
