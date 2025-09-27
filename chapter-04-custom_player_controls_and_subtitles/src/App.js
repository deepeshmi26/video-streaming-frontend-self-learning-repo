import React from "react";
import VideoPlayer from "./components/VideoPlayer";
import "./App.css";

function App() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Chapter 04 — Custom Player Controls and Subtitles</h2>
      
      <VideoPlayer  src="https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8"
        // subtitles={[
        //   { label: "English", srclang: "en", src: "/subs/en.vtt" },
        //   { label: "Spanish", srclang: "es", src: "/subs/es.vtt" },
        // ]} 
      />
    </div>
  );
}

export default App;
