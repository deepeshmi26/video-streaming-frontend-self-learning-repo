import React from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "../features/player/components/VideoPlayer";

import { mockVideos } from "../mockData";

const PlayerPage = () => {
  const { id } = useParams();
  const mockVideo = mockVideos.find((video) => video.id === parseInt(id));
  const src = mockVideo.src;

  return (
    <div style={{ padding: 20 }}>
      <h3>Now Playing</h3>
      <VideoPlayer src={src} thumbnailsVtt={mockVideo.thumbnailsVtt} />
    </div>
  );
};

export default PlayerPage;
