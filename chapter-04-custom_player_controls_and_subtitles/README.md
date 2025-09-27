# 🎬 Chapter 4: Building a Custom HLS Video Player

In this chapter, we built a **custom HTML5 video player** with **Hls.js integration**.  
We added **adaptive bitrate control**, **subtitles (external + manifest)**, **buffer bar**, and **custom controls**.

---

## 🔹 What We Learned

### HTML5 `<video>` API
- `play()` / `pause()`
- `currentTime` / `duration`
- `volume`
- `buffered` ranges (used for buffer bar)
- `requestFullscreen()`
- `textTracks` → exposes subtitle/caption tracks
- Events:
  - `timeupdate`
  - `progress`
  - `loadedmetadata`

### Hls.js API
- `Hls.isSupported()`
- `loadSource(url)`
- `attachMedia(videoElement)`
- `levels` → list of available qualities
- `currentLevel = index` → switch quality
- `subtitleTracks` → list of subtitles
- `subtitleTrack = index` → select subtitle
- Events:
  - `MANIFEST_PARSED` → levels + subtitle groups ready
  - `LEVEL_SWITCHED` → resolution changed
  - `SUBTITLE_TRACKS_UPDATED` → subtitle tracks discovered
  - `SUBTITLE_TRACK_LOADED` → subtitle VTT file loaded and parsed

### Sources of Subtitles
1. **External props** (added manually as `<track>`).
2. **Manifest-defined** (from `#EXT-X-MEDIA:TYPE=SUBTITLES`).
3. **In-band captions** (inside TS/fMP4 chunks, like CEA-608).

---

## 🔹 Questions & Answers

**Q: What are `cues` and `activeCues`?**  
- `cues` = full list of subtitles for that track.  
- `activeCues` = currently displayed subtitles (time-based).  

**Q: Why are cues sometimes empty?**  
- VTT not loaded yet (async).  
- Track must be `"hidden"` or `"showing"`.  
- Possible CORS / bad VTT formatting.  

**Q: Why does English show as default even if I didn’t set it?**  
- Browsers auto-enable the first subtitle track.  
- Fix → disable all tracks on load (`mode = "disabled"`).  

**Q: How to forcefully set second track as default?**  
```js
hls.subtitleTrack = 1;              // fetches + parses
video.textTracks[1].mode = "showing"; // displays it