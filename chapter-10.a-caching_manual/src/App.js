// src/App.js
import React from "react";
import AppRouter from "./router/AppRouter";
import { makeServer } from "./mirage/server";
if (process.env.NODE_ENV === "development") {
  makeServer();
}

function App() {
  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <h2 style={{ textAlign: "center" }}>🎥 Modular Video Streaming App</h2>
      <AppRouter />
    </div>
  );
}

export default App;
