import React from "react";

const VideoPlayer = ({ src }) => {
  return (
    <video
      controls
      width="640"
      height="360"
      style={{ backgroundColor: "black" }}
    >
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoPlayer;
