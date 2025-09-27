import React, { useRef, useState, useEffect } from "react";
import Hls from "hls.js";

const CustomVideoPlayer = ({ src, subtitles }) => {
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

    // Remove old external <track>
    const prev = video.querySelectorAll('track[data-generated="true"]');
    prev.forEach((t) => t.remove());

    // Add new <track>
    subtitles.forEach((sub) => {
      const trackEl = document.createElement("track");
      trackEl.kind = "subtitles";
      trackEl.label = `${sub.label} (ext)`; // append (ext)
      trackEl.srclang = sub.srclang;
      trackEl.src = sub.src;
      trackEl.setAttribute("data-generated", "true");
      video.appendChild(trackEl);
    });

    // Build external track list
    const external = subtitles.map((sub, i) => ({
      id: `ext-${i}`,
      label: `${sub.label} (ext)`,
      language: sub.srclang,
      source: "external",
    }));

    // Deduplicate external by language
    const seen = new Set();
    const uniqueExternal = external.filter((t) => {
      if (seen.has(t.language)) return false;
      seen.add(t.language);
      return true;
    });

    setExternalTracks(uniqueExternal);

    setTimeout(() => rebuildHlsTracks(video), 10000);
  }, [subtitles]);

  // --- Rebuild manifest/in-band tracks ---
  const rebuildHlsTracks = (video) => {
    if (!video) return;

    const allTracks = Array.from(video.textTracks).filter(
      (t) => !t.label.endsWith("(ext)") // ignore external we added
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

    // Disable all by default
    for (let i = 0; i < video.textTracks.length; i++) {
      video.textTracks[i].mode = "disabled";
    }
    setActiveSubtitle("off");
  };

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
    const newProgress = parseFloat(e.target.value);
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

  // --- Render ---
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <video
        ref={videoRef}
        style={{ width: "100%", background: "#000" }}
        onClick={handlePlayPause}
        crossOrigin="anonymous"
      />

      {/* Buffer + Progress Bar */}
      <div style={{ position: "relative", height: "6px", background: "#444", marginTop: 6 }}>
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
          max="100"
          value={progress}
          onChange={handleSeek}
          style={{ flex: 1, margin: "0 10px" }}
        />

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

        {/* Quality Selector */}
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

        {/* Subtitles */}
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