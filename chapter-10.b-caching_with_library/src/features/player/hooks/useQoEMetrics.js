import { useState, useEffect } from "react";
import Hls from "hls.js";

const useQoEMetrics = ({ hlsInstance, videoRef }) => {
  const [metrics, setMetrics] = useState({
    currentQuality: "Auto",
    bufferHealth: 0,
    bitrate: 0, // bits per second
    latency: 0, // milliseconds (time to first byte)
    downloadSpeed: 0, // bits per second
    bwEstimate: 0, // HLS.js bandwidth estimate
    stallCount: 0,
    totalStallDuration: 0,
    averageStallDuration: 0,
    lastStallTimestamp: 0,
  });

  // Track stall events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let stallStartTime = 0;

    const handleWaiting = () => {
      stallStartTime = Date.now();
      setMetrics((prev) => ({
        ...prev,
        stallCount: prev.stallCount + 1,
        lastStallTimestamp: stallStartTime,
      }));
    };

    const handlePlaying = () => {
      if (stallStartTime > 0) {
        const stallDuration = Date.now() - stallStartTime;
        setMetrics((prev) => {
          const totalDuration = prev.totalStallDuration + stallDuration;
          return {
            ...prev,
            totalStallDuration: totalDuration,
            averageStallDuration: totalDuration / prev.stallCount,
          };
        });
        stallStartTime = 0;
      }
    };

    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);

    return () => {
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
    };
  }, [videoRef]);

  // Track HLS metrics
  useEffect(() => {
    if (!hlsInstance || !videoRef.current) return;

    const video = videoRef.current;

    const handleSegmentLoaded = (_, segmentData) => {
      const { frag: segment } = segmentData;
      const segmentStats = segment.stats;
      const segmentLoadingStats = segmentStats.loading;

      // Time to First Byte (TTFB) - Time between request start and receiving first byte
      const segmentLatency = segmentLoadingStats.first - segmentLoadingStats.start;

      // Actual transfer time in seconds (from first byte to completion)
      const segmentTransferTime = (segmentLoadingStats.end - segmentLoadingStats.first) / 1000;

      // Fragment size in bits
      const segmentSizeInBits = segmentStats.loaded * 8;

      // Calculate metrics
      const segmentDownloadSpeed =
        segmentTransferTime > 0 ? segmentSizeInBits / segmentTransferTime : 0;

      // Get segment duration from fragment tag list
      const segmentDuration = segment.duration; // Duration in seconds from #EXTINF tag

      // Calculate actual delivered bitrate
      const segmentBitrate = segmentDuration > 0 ? segmentSizeInBits / segmentDuration : 0;

      setMetrics((prev) => ({
        ...prev,
        bitrate: segmentBitrate, // actual delivered bitrate
        latency: segmentLatency, // TTFB in milliseconds
        downloadSpeed: segmentDownloadSpeed, // network throughput
        bwEstimate: segmentStats.bwEstimate, // HLS.js bandwidth estimate
      }));
    };

    const handleQualityLevelSwitched = (_, qualityData) => {
      const qualityLevel = hlsInstance.levels[qualityData.level];
      const qualityLabel = qualityLevel ? `${qualityLevel.height}p` : "Auto";

      setMetrics((prev) => ({
        ...prev,
        currentQuality: qualityLabel,
      }));
    };

    hlsInstance.on(Hls.Events.FRAG_LOADED, handleSegmentLoaded);
    hlsInstance.on(Hls.Events.LEVEL_SWITCHED, handleQualityLevelSwitched);

    // Buffer health updater
    const bufferHealthInterval = setInterval(() => {
      if (video.buffered && video.buffered.length > 0) {
        setMetrics((prev) => ({
          ...prev,
          bufferHealth:
            video.buffered.end(video.buffered.length - 1) - video.currentTime,
        }));
      }
    }, 1000);

    return () => {
      hlsInstance.off(Hls.Events.FRAG_LOADED, handleSegmentLoaded);
      hlsInstance.off(Hls.Events.LEVEL_SWITCHED, handleQualityLevelSwitched);
      clearInterval(bufferHealthInterval);
    };
  }, [hlsInstance, videoRef]);

  return metrics;
};

export default useQoEMetrics;
