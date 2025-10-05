import React, { useState } from "react";
import { colors, spacing, borderRadius } from "../styles/theme";

const MetricCard = ({ title, value, explanation }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      style={{
        background: colors.background.medium,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        position: "relative",
        cursor: "help",
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div style={{ marginBottom: spacing.xs, color: colors.text.secondary }}>
        {title}
      </div>
      <div
        style={{
          fontSize: "1.1em",
          fontWeight: "bold",
          color: colors.text.primary,
        }}
      >
        {value}
      </div>
      {showTooltip && (
        <div
          style={{
            position: "absolute",
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            background: colors.background.dark,
            padding: spacing.md,
            borderRadius: borderRadius.md,
            width: "200px",
            color: colors.text.primary,
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            zIndex: 1000,
            marginBottom: spacing.xs,
          }}
        >
          {explanation}
        </div>
      )}
    </div>
  );
};

const QoEStats = ({
  currentQuality,
  bufferHealth,
  bitrate,
  latency,
  downloadSpeed,
  stallCount,
  averageStallDuration,
}) => {
  const formatBitrate = (bps) => {
    if (bps >= 1000000) return `${(bps / 1000000).toFixed(1)} Mbps`;
    if (bps >= 1000) return `${(bps / 1000).toFixed(1)} Kbps`;
    return `${bps} bps`;
  };

  const formatTime = (ms) => {
    if (ms >= 1000) return `${(ms / 1000).toFixed(2)}s`;
    return `${ms.toFixed(0)}ms`;
  };

  return (
    <div
      style={{
        background: colors.background.dark,
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        marginTop: spacing.md,
      }}
    >
      <h3
        style={{
          color: colors.text.primary,
          marginTop: 0,
          marginBottom: spacing.lg,
        }}
      >
        Quality of Experience Metrics
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: spacing.md,
        }}
      >
        <MetricCard
          title="Current Quality"
          value={currentQuality}
          explanation="The picture quality of the video. Higher quality gives you a clearer, sharper picture but needs faster internet."
        />

        <MetricCard
          title="Buffer Health"
          value={`${bufferHealth.toFixed(1)}s`}
          explanation="How much video is pre-loaded. The more that's loaded ahead, the less likely your video is to pause unexpectedly. We aim for at least 10 seconds of pre-loaded video."
        />

        <MetricCard
          title="Actual Bitrate"
          value={formatBitrate(bitrate)}
          explanation="How much data is used to show each second of video. More data means better picture quality. Don't worry - we'll automatically adjust this based on your internet speed."
        />
        <MetricCard
          title="Latency"
          value={formatTime(latency)}
          explanation="How quickly your video responds to changes. Lower numbers are better - under half a second is great, over 2 seconds might cause pausing."
        />

        <MetricCard
          title="Download Speed"
          value={formatBitrate(downloadSpeed)}
          explanation="How fast your internet is downloading the video. Faster speeds let you watch in better quality. For high quality video, we recommend speeds over 40 Mbps."
        />

        <MetricCard
          title="Stall Events"
          value={stallCount}
          explanation="How many times the video has paused to load. Fewer pauses means a better watching experience. Ideally, you should see zero pauses. Technichally, video ref has an even listener to detect waiting and everytime start playing, it checks if it has been waiting for more than 500ms and if so, it counts as a stall."
        />

        <MetricCard
          title="Avg. Stall Duration"
          value={formatTime(averageStallDuration)}
          explanation="When the video does pause, how long it usually pauses for. Shorter pauses are less annoying. Ideally, pauses should be under half a second."
        />
      </div>
    </div>
  );
};

export default QoEStats;
