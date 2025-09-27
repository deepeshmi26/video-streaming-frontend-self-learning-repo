import React from "react";
import VideoPlayer from "./components/VideoPlayer";
import "./App.css";

function App() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Chapter 02 — Setup: Video Player HLS or DASH</h2>
      <VideoPlayer src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" />
    </div>
  );
}

export default App;
