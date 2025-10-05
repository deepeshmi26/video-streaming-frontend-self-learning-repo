import React, { useRef, useState } from "react";
import { colors, borderRadius, shadows } from "../styles/theme";

import useHls from "../hooks/useHls";
import useVideoProgress from "../hooks/useVideoProgress";
import useSubtitles from "../hooks/useSubtitles";
import useThumbnails from "../hooks/useThumbnails";
import useQoEMetrics from "../hooks/useQoEMetrics";

import VideoControls from "./VideoControls";
import ProgressBar from "./ProgressBar";
import StatsOverlay from "./StatsOverlay";
import QoEStats from "./QoEStats";

/**
 * Custom video player component with modern UI
 */
const CustomVideoPlayer = ({ src, subtitles, thumbnailsVtt }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const controlsTimeoutRef = useRef(null);

  // Initialize hooks
  const { levels, currentLevel, handleQualityChange, hlsInstance } = useHls({
    src,
    videoRef,
  });

  const { progress, buffered, handleSeek } = useVideoProgress({
    videoRef,
  });

  const { externalTracks, hlsTracks, activeSubtitle, handleSubtitleChange } =
    useSubtitles({
      videoRef,
      subtitles,
    });

  const {
    hoverTime,
    hoverThumb,
    handleMouseMove: onMouseMoveOnProgressBar,
    handleMouseLeave,
  } = useThumbnails({
    thumbnailsVtt,
    videoRef,
  });

  const qoeMetrics = useQoEMetrics({
    hlsInstance,
    videoRef,
  });

  // Video control handlers
  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) videoRef.current.volume = newVolume;
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.requestFullscreen) video.requestFullscreen();
    else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
    else if (video.msRequestFullscreen) video.msRequestFullscreen();
  };

  const handleMouseMove = () => {
    setIsControlsVisible(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setIsControlsVisible(false);
      }
    }, 3000);
  };

  const handleMouseLeaveContainer = () => {
    if (isPlaying) {
      setIsControlsVisible(false);
    }
  };

  return (
    <div>
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          position: "relative",
          background: colors.background.dark,
          borderRadius: borderRadius.lg,
          overflow: "hidden",
          boxShadow: shadows.controls,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeaveContainer}
      >
        <video
          ref={videoRef}
          style={{
            width: "100%",
            display: "block",
            background: "#000",
            borderRadius: `${borderRadius.lg} ${borderRadius.lg} 0 0`,
          }}
          onClick={handlePlayPause}
          crossOrigin="anonymous"
        />

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background: `linear-gradient(transparent, ${colors.background.dark}CC)`,
            transition: "opacity 0.3s ease",
            opacity: isControlsVisible ? 1 : 0,
          }}
        >
          <ProgressBar
            progress={progress}
            buffered={buffered}
            hoverTime={hoverTime}
            hoverThumb={hoverThumb}
            videoDuration={videoRef.current?.duration}
            onSeek={handleSeek}
            onMouseMove={onMouseMoveOnProgressBar}
            onMouseLeave={handleMouseLeave}
          />

          <VideoControls
            isPlaying={isPlaying}
            volume={volume}
            currentLevel={currentLevel}
            levels={levels}
            activeSubtitle={activeSubtitle}
            externalTracks={externalTracks}
            hlsTracks={hlsTracks}
            onPlayPause={handlePlayPause}
            onVolumeChange={handleVolumeChange}
            onFullscreen={handleFullscreen}
            onQualityChange={handleQualityChange}
            onSubtitleChange={handleSubtitleChange}
          />

          <StatsOverlay videoRef={videoRef} hlsInstance={hlsInstance} />
        </div>
      </div>

      {/* QoE Stats Section */}
      <QoEStats
        currentQuality={qoeMetrics.currentQuality}
        bufferHealth={qoeMetrics.bufferHealth}
        bitrate={qoeMetrics.bitrate}
        latency={qoeMetrics.latency}
        downloadSpeed={qoeMetrics.downloadSpeed}
        stallCount={qoeMetrics.stallCount}
        averageStallDuration={qoeMetrics.averageStallDuration}
      />
    </div>
  );
};

export default CustomVideoPlayer;
