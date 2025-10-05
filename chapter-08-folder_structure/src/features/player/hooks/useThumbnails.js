import { useState, useEffect } from 'react';
import { parseVTT } from '../utils/vttParser';

/**
 * Hook to manage video thumbnail previews
 * @param {Object} params
 * @param {string} params.thumbnailsVtt - URL to the VTT file containing thumbnail information
 * @param {React.RefObject} params.videoRef - Reference to video element
 * @returns {Object} Thumbnail state and handlers
 */
const useThumbnails = ({ thumbnailsVtt, videoRef }) => {
  const [thumbCues, setThumbCues] = useState([]);
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverThumb, setHoverThumb] = useState(null);

  // Load thumbnail VTT file
  useEffect(() => {
    if (thumbnailsVtt) {
      parseVTT(thumbnailsVtt).then(setThumbCues);
    }
  }, [thumbnailsVtt]);

  const handleMouseMove = (e) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const time = percent * video.duration;
    setHoverTime(time);

    const cue = thumbCues.find(c => time >= c.start && time <= c.end);
    setHoverThumb(cue || null);
  };

  const handleMouseLeave = () => {
    setHoverTime(null);
    setHoverThumb(null);
  };

  return {
    hoverTime,
    hoverThumb,
    handleMouseMove,
    handleMouseLeave,
  };
};

export default useThumbnails;
