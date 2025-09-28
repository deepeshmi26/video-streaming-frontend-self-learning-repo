import React from "react";
import CustomVideoPlayer from "./components/VideoPlayer";

function App() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Chapter 06 — UI Revamp</h2>
      
      <CustomVideoPlayer
        src={"http://sample.vodobox.com/planete_interdite/planete_interdite_alternate.m3u8"}
        thumbnailsVtt="/thumbnails.vtt" // put this file inside public/
      />
    </div>
  );
}

export default App;