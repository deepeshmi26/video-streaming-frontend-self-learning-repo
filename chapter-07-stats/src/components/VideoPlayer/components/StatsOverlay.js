import React, { useEffect, useState } from "react";
import { Info } from "lucide-react";

const tooltips = {
  resolution:
    "Current decoded video resolution (width × height). Helps confirm quality level being played.",
  bitrate:
    "Average bits per second of current stream. Higher = better quality but more network usage.",
  buffer:
    "Seconds of video already preloaded. Low buffer means risk of stalling/rebuffering.",
  currentTime: "Current playback position in the video timeline.",
  droppedFrames: "Frames skipped due to CPU/GPU being overloaded.",
  decodedFrames: "Frames successfully decoded by the player.",
  playbackRate: "Current playback speed (1 = normal, 2 = fast, 0.5 = slow).",
};

const StatsOverlay = ({ videoRef, hlsRef }) => {
  const [stats, setStats] = useState({
    resolution: "-",
    bitrate: "-",
    buffer: "-",
    currentTime: "-",
    droppedFrames: "-",
    decodedFrames: "-",
    playbackRate: "-",
  });

  // Track which tooltip is open
  const [openTooltip, setOpenTooltip] = useState(null);

  useEffect(() => {
    const update = () => {
      const video = videoRef.current;
      if (!video) return;

      const quality = video.getVideoPlaybackQuality?.();
      const hls = hlsRef?.current;

      const levels = hls?.levels || [];
      const currentLevel = hls?.currentLevel ?? -1;
      const bitrate =
        currentLevel >= 0 && levels[currentLevel]
          ? `${(levels[currentLevel].bitrate / 1000).toFixed(0)} kbps`
          : "-";

      const buffer =
        video.buffered.length > 0
          ? (
              video.buffered.end(video.buffered.length - 1) - video.currentTime
            ).toFixed(1) + "s"
          : "0s";

      setStats({
        resolution:
          video.videoWidth && video.videoHeight
            ? `${video.videoWidth}x${video.videoHeight}`
            : "-",
        bitrate,
        buffer,
        currentTime: video.currentTime.toFixed(1) + "s",
        droppedFrames: quality ? quality.droppedVideoFrames : "-",
        decodedFrames: quality ? quality.totalVideoFrames : "-",
        playbackRate: video.playbackRate.toFixed(2),
      });
    };

    const id = setInterval(update, 500);
    return () => clearInterval(id);
  }, [videoRef, hlsRef]);

  const toggleTooltip = (key) => {
    setOpenTooltip(openTooltip === key ? null : key);
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: "60px",
        left: "10px",
        background: "rgba(0,0,0,0.7)",
        color: "#fff",
        fontSize: "12px",
        padding: "8px",
        borderRadius: "6px",
        maxWidth: "250px",
      }}
    >
      {Object.entries(stats).map(([key, value]) => (
        <div
          key={key}
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "6px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ flex: 1, textTransform: "capitalize" }}>
              {key}: {value}
            </span>

            <Info
              size={14}
              style={{ cursor: "pointer" }}
              onClick={() => toggleTooltip(key)}
            />
          </div>

          {openTooltip === key && (
            <div
              style={{
                background: "#222",
                color: "#fff",
                padding: "4px 6px",
                borderRadius: "4px",
                marginTop: "4px",
                fontSize: "11px",
              }}
            >
              {tooltips[key]}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StatsOverlay;
