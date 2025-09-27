import React, { useRef, useState, useEffect } from "react";
import Hls from "hls.js";

// --- Helper: Parse VTT for thumbnails ---
const toSeconds = (time) => {
  const [h, m, rest] = time.split(":");
  const [s] = rest.split(".");
  return parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s);
};

const parseVTT = async (url) => {
  const res = await fetch(url);
  const text = await res.text();
  const lines = text.split("\n").filter(Boolean);
  const cues = [];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("-->")) {
      const [start, end] = lines[i].split("-->").map((s) => s.trim());
      const coordsLine = lines[i + 1];
      const match = coordsLine.match(/#xywh=(\d+),(\d+),(\d+),(\d+)/);
      if (match) {
        cues.push({
          start: toSeconds(start),
          end: toSeconds(end),
          x: parseInt(match[1], 10),
          y: parseInt(match[2], 10),
          w: parseInt(match[3], 10),
          h: parseInt(match[4], 10),
          url: coordsLine.split("#")[0],
        });
      }
    }
  }
  return cues;
};

const CustomVideoPlayer = ({ src, subtitles, thumbnailsVtt }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [buffered, setBuffered] = useState(0);

  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(-1);

  const [externalTracks, setExternalTracks] = useState([]);
  const [hlsTracks, setHlsTracks] = useState([]);
  const [activeSubtitle, setActiveSubtitle] = useState("off");

  const [thumbCues, setThumbCues] = useState([]);
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverThumb, setHoverThumb] = useState(null);

  // --- HLS setup ---
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        setLevels(data.levels || []);
        setCurrentLevel(-1);
        setTimeout(() => rebuildHlsTracks(video), 50);
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        setCurrentLevel(data.level);
      });

      return () => {
        hls.destroy();
        hlsRef.current = null;
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    }
  }, [src]);

  // --- External subtitle tracks from props ---
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !subtitles) return;

    const prev = video.querySelectorAll('track[data-generated="true"]');
    prev.forEach((t) => t.remove());

    subtitles.forEach((sub) => {
      const trackEl = document.createElement("track");
      trackEl.kind = "subtitles";
      trackEl.label = `${sub.label} (ext)`;
      trackEl.srclang = sub.srclang;
      trackEl.src = sub.src;
      trackEl.setAttribute("data-generated", "true");
      video.appendChild(trackEl);
    });

    const external = subtitles.map((sub, i) => ({
      id: `ext-${i}`,
      label: `${sub.label} (ext)`,
      language: sub.srclang,
      source: "external",
    }));

    setExternalTracks(external);
    setTimeout(() => rebuildHlsTracks(video), 10000);
  }, [subtitles]);

  // --- Rebuild manifest/in-band tracks ---
  const rebuildHlsTracks = (video) => {
    if (!video) return;
    const allTracks = Array.from(video.textTracks).filter(
      (t) => !t.label.endsWith("(ext)")
    );

    const list = [];
    const seen = new Set();
    allTracks.forEach((t, i) => {
      const label = t.label || t.language || `Track ${i + 1}`;
      const key = `${label}-${t.language}`;
      if (!seen.has(key)) {
        list.push({
          id: `hls-${i}`,
          label,
          language: t.language || "",
          source: "hls",
        });
        seen.add(key);
      }
    });

    setHlsTracks(list);

    for (let i = 0; i < video.textTracks.length; i++) {
      video.textTracks[i].mode = "disabled";
    }
    setActiveSubtitle("off");
  };

  // --- Load thumbnails VTT ---
  useEffect(() => {
    if (thumbnailsVtt) {
      parseVTT(thumbnailsVtt).then(setThumbCues);
    }
  }, [thumbnailsVtt]);

  // --- Update progress + buffer ---
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateUI = () => {
      if (!video.duration || isNaN(video.duration)) return;
      setProgress((video.currentTime / video.duration) * 100);

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
  }, []);

  // --- Controls ---
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

  const handleSeek = (e) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const newProgress = parseFloat(e.nativeEvent.offsetX / e.currentTarget.offsetWidth) * 100;
    setProgress(newProgress);
    video.currentTime = (newProgress / 100) * video.duration;
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.requestFullscreen) video.requestFullscreen();
    else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
    else if (video.msRequestFullscreen) video.msRequestFullscreen();
  };

  const handleQualityChange = (levelIndex) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelIndex; // -1 = Auto
      setCurrentLevel(levelIndex);
    }
  };

  const handleSubtitleChange = (id) => {
    const video = videoRef.current;
    if (!video) return;

    if (id === "off") {
      for (let i = 0; i < video.textTracks.length; i++) {
        video.textTracks[i].mode = "disabled";
      }
      setActiveSubtitle("off");
      return;
    }

    const allOptions = [...externalTracks, ...hlsTracks];
    const selected = allOptions.find((t) => t.id === id);
    if (!selected) return;

    for (let i = 0; i < video.textTracks.length; i++) {
      const t = video.textTracks[i];
      const match =
        (t.label && t.label === selected.label) ||
        (t.language && t.language === selected.language);
      t.mode = match ? "showing" : "disabled";
    }

    setActiveSubtitle(id);
  };

  // --- Handle Hover Thumbnails ---
  const handleMouseMove = (e) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const time = percent * video.duration;
    setHoverTime(time);

    const cue = thumbCues.find((c) => time >= c.start && time <= c.end);
    setHoverThumb(cue || null);
  };

  const handleMouseLeave = () => {
    setHoverTime(null);
    setHoverThumb(null);
  };

  // --- Render ---
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <video
        ref={videoRef}
        style={{ width: "100%", background: "#000" }}
        onClick={handlePlayPause}
        crossOrigin="anonymous"
      />

      {/* Unified Buffer + Progress + Thumbnail */}
      <div
        style={{
          position: "relative",
          height: "10px",
          background: "#444",
          marginTop: 6,
          cursor: "pointer",
        }}
        onClick={handleSeek}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: `${buffered}%`,
            background: "#999",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: `${progress}%`,
            background: "red",
          }}
        />
        {hoverThumb && (
          <div
            style={{
              position: "absolute",
              bottom: "100%",
              left: `${(hoverTime / videoRef.current.duration) * 100}%`,
              transform: "translateX(-50%)",
              marginBottom: "8px",
              width: hoverThumb.w,
              height: hoverThumb.h,
              backgroundImage: `url(${hoverThumb.url})`,
              backgroundPosition: `-${hoverThumb.x}px -${hoverThumb.y}px`,
              backgroundRepeat: "no-repeat",
              border: "1px solid #ccc",
              backgroundColor: "#000",
            }}
          />
        )}
      </div>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#222",
          padding: "8px",
          color: "#fff",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <button onClick={handlePlayPause}>{isPlaying ? "⏸ Pause" : "▶ Play"}</button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={handleVolumeChange}
          style={{ width: 100 }}
        />

        <button onClick={handleFullscreen}>⛶</button>

        <select
          value={currentLevel}
          onChange={(e) => handleQualityChange(parseInt(e.target.value, 10))}
        >
          <option value={-1}>Auto</option>
          {levels.map((level, i) => (
            <option key={i} value={i}>
              {level.height ? `${level.height}p` : `Level ${i}`}
            </option>
          ))}
        </select>

        {(externalTracks.length > 0 || hlsTracks.length > 0) && (
          <select value={activeSubtitle} onChange={(e) => handleSubtitleChange(e.target.value)}>
            <option value="off">Subtitles Off</option>
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
      </div>
    </div>
  );
};

export default CustomVideoPlayer;