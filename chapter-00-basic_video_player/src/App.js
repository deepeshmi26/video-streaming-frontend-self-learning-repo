import React from "react";
import VideoPlayer from "./components/VideoPlayer";
import "./App.css";

function App() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Chapter 00 — Basic Video Player</h2>
      <p>This demo uses the built-in HTML5 video player with an MP4 file.</p>
      <VideoPlayer src="https://www.w3schools.com/html/mov_bbb.mp4" />
    </div>
  );
}

export default App;
