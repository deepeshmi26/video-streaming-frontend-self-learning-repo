import React from "react";
import { useNavigate } from "react-router-dom";
import VideoCard from "../features/catalog/components/VideoCard";
import { mockVideos } from "../mockData";

const CatalogPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 20 }}>
      <h3>Catalog</h3>
      <div style={{ display: "flex", gap: 10 }}>
        {mockVideos.map((video) => (
          <VideoCard
            key={video.id}
            title={video.title}
            thumbnail={video.thumbnail}
            onClick={() => navigate(`/player/${video.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default CatalogPage;
