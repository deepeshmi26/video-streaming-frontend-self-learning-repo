import React from "react";
import MSEPlayer from "./components/VideoPlayer";

function App() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Chapter 01 — Media Source Extensions Demo</h2>
      <p>
        This demo shows how we can manually feed media segments into a video
        element using the MediaSource API.
      </p>
      <MSEPlayer />
    </div>
  );
}

export default App;
