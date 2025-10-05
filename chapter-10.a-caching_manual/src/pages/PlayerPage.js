import React, { useCallback } from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "../features/player/components/VideoPlayer";
import { mockVideos } from "../mockData";
import useTheme from "../store/useTheme";
import useWatchHistory from "../store/useWatchHistory";

const PlayerPage = () => {
  const { id } = useParams();
  const { addToHistory, updateProgress, history } = useWatchHistory();
  const { theme, toggleTheme } = useTheme();
  const mockVideo = mockVideos.find((video) => video.id === parseInt(id));
  const src = mockVideo.src;

  // Get any saved progress for this video from watch history
  const savedEntry = history.find((v) => v.id === mockVideo.id);
  const initialProgress = savedEntry?.progress ?? 0;

  const onProgressUpdate = useCallback(
    (progress) => {
      updateProgress(mockVideo.id, progress);
    },
    [mockVideo.id, updateProgress]
  );

  return (
    <div
      style={{
        background: theme === "dark" ? "#111" : "#fff",
        color: theme === "dark" ? "#fff" : "#000",
      }}
    >
      <h2>{mockVideo.title}</h2>
      <button onClick={() => addToHistory(mockVideo)}>Add to History</button>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <VideoPlayer
        src={src}
        thumbnailsVtt={mockVideo.thumbnailsVtt}
        initialProgress={initialProgress}
        onProgressUpdate={onProgressUpdate}
      />
      <h3>Watch History:</h3>
      <ul>
        {history.map((v) => (
          <li key={v.id}>
            {v.title} — {v.progress || 0}%
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerPage;
