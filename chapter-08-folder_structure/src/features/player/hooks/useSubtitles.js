import { useState, useEffect } from 'react';

/**
 * Hook to manage video subtitles
 * @param {Object} params
 * @param {React.RefObject} params.videoRef - Reference to video element
 * @param {Array} params.subtitles - External subtitle tracks
 * @returns {Object} Subtitle state and controls
 */
const useSubtitles = ({ videoRef, subtitles }) => {
  const [externalTracks, setExternalTracks] = useState([]);
  const [hlsTracks, setHlsTracks] = useState([]);
  const [activeSubtitle, setActiveSubtitle] = useState('off');

  // Handle external subtitle tracks
  useEffect(() => {
    const video = videoRef.current;
    if (!video && !subtitles) return;

    // Remove previous tracks
    const prev = video.querySelectorAll('track[data-generated="true"]');
    prev.forEach(t => t.remove());

    // Add new tracks
    subtitles?.forEach(sub => {
      const trackEl = document.createElement('track');
      trackEl.kind = 'subtitles';
      trackEl.label = `${sub.label} (ext)`;
      trackEl.srclang = sub.srclang;
      trackEl.src = sub.src;
      trackEl.setAttribute('data-generated', 'true');
      video.appendChild(trackEl);
    });

    // Update external tracks list
    const external = subtitles?.map((sub, i) => ({
      id: `ext-${i}`,
      label: `${sub.label} (ext)`,
      language: sub.srclang,
      source: 'external',
    })) ?? [];

    setExternalTracks(external);
    setTimeout(() => rebuildHlsTracks(video), 10000);
  }, [subtitles, videoRef]);

  // Rebuild HLS tracks
  const rebuildHlsTracks = (video) => {
    if (!video) return;
    
    const allTracks = Array.from(video.textTracks).filter(
      t => !t.label.endsWith('(ext)')
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
          language: t.language || '',
          source: 'hls',
        });
        seen.add(key);
      }
    });

    setHlsTracks(list);

    // Disable all tracks initially
    for (let i = 0; i < video.textTracks.length; i++) {
      video.textTracks[i].mode = 'disabled';
    }
    setActiveSubtitle('off');
  };

  const handleSubtitleChange = (id) => {
    const video = videoRef.current;
    if (!video) return;

    if (id === 'off') {
      for (let i = 0; i < video.textTracks.length; i++) {
        video.textTracks[i].mode = 'disabled';
      }
      setActiveSubtitle('off');
      return;
    }

    const allOptions = [...externalTracks, ...hlsTracks];
    const selected = allOptions.find(t => t.id === id);
    if (!selected) return;

    for (let i = 0; i < video.textTracks.length; i++) {
      const t = video.textTracks[i];
      const match =
        (t.label && t.label === selected.label) ||
        (t.language && t.language === selected.language);
      t.mode = match ? 'showing' : 'disabled';
    }

    setActiveSubtitle(id);
  };

  return {
    externalTracks,
    hlsTracks,
    activeSubtitle,
    handleSubtitleChange,
    rebuildHlsTracks,
  };
};

export default useSubtitles;
