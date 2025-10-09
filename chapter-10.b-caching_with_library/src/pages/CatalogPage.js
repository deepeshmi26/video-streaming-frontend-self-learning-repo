import React from "react";
import { useNavigate } from "react-router-dom";
import VideoCard from "../features/catalog/components/VideoCard";
import { useQuery } from "../shared/api/fetchWrapper";

const CatalogPage = () => {
  const navigate = useNavigate();
  const { data: videos, loading, error } = useQuery("/api/videos");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h3>Catalog</h3>
      <div style={{ display: "flex", gap: 10 }}>
        {videos &&
          videos.map((video) => (
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
