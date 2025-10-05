import React from "react";

const VideoCard = ({ title, thumbnail, onClick }) => (
  <div
    onClick={onClick}
    style={{
      width: 200,
      cursor: "pointer",
      border: "1px solid #ccc",
      borderRadius: 8,
      overflow: "hidden",
      textAlign: "center",
    }}
  >
    <img src={thumbnail} alt={title} style={{ width: "100%" }} />
    <p>{title}</p>
  </div>
);

export default VideoCard;
