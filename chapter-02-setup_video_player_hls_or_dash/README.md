# Chapter02 - Setup Video Player
This chapter contains a minimal React app with a custom HLS-based player (hls.js).
Run: npm start

## About HLS
HLS (HTTP Live Streaming) is a streaming protocol that breaks video content into small chunks and delivers them over HTTP. We're using it because it's widely supported across different devices and browsers, and it allows us to stream video efficiently without needing specialized streaming servers - any standard web server that can serve HTTP content will work.

## Why not use media soruce extension + video player?
While Media Source Extensions (MSE) provide low-level control over video streaming, implementing a full streaming solution with MSE requires handling many complex tasks:

- Manual segment ordering and buffering
- CORS configuration challenges 
- Complex setup and initialization
- Error-prone segment sequence management

Using HLS.js provides a robust, production-ready solution that handles these complexities for us.


1. **Inconsistent HLS Support**: While Safari has native HLS support, other browsers like Chrome and Firefox don't natively support HLS. By using HLS.js, we ensure consistent playback across all major browsers.

2. **Advanced Features**: HLS.js provides additional features like:
   - Adaptive bitrate streaming
   - Better buffer management
   - Detailed metrics and debugging capabilities
   - More control over the streaming process

3. **Quality Control**: HLS.js allows us to:
   - Switch between different quality levels
   - Control buffer size
   - Handle network issues more gracefully

4. **Cross-Browser Compatibility**: Our code actually checks for native support first:
   ```javascript
   if (Hls.isSupported()) {
     // Use HLS.js
   } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
     // Fallback to native HLS support (Safari)
   }
   ```

This hybrid approach gives us the best of both worlds - we use native support where available (Safari) and fallback to HLS.js where needed (other browsers), ensuring a consistent streaming experience across all platforms.

## How HLS Works

1. **Client requests the playlist (`.m3u8`)**
   - This is a plain text file that describes the video stream.

2. **Playlist lists segment URLs**
   - Example: `segment1.ts`, `segment2.ts`, `segment3.ts`, etc.

3. **Player downloads segments sequentially**
   - Each segment is a small binary video/audio file (TS or fMP4).
   - These are fetched using normal HTTP GET requests.

4. **Segments appended to Media Source Extensions (MSE)**
   - In browsers that don’t support HLS natively (e.g., Chrome), libraries like `hls.js` use MSE APIs:
     ```js
     sourceBuffer.appendBuffer(segmentData)
     ```
   - Safari supports HLS natively, so MSE isn’t needed there.

5. **Playback happens in the `<video>` tag**
   - The `<video>` element plays from the buffered segments.
   - If network slows, playback can pause until buffer refills.

6. **CDN-friendly**
   - Since segments are normal HTTP files, they can be cached and delivered globally by CDNs.

## How Chunk-Based Delivery Works in HTTP Streaming

In HTTP streaming (HLS/DASH), the server does not send one long continuous video file.  
Instead, the video is **pre-split into small segments** (e.g., 2–10 seconds each) and described in a **playlist file** (`.m3u8` or `.mpd`).  

- **Server/Packager**: Splits the video into chunks and generates the manifest using ffmpeg.  
- **CDN**: Caches each chunk by its URL (e.g., `/720p/segment1.ts`). Once cached, the same chunk can be delivered to millions of viewers without hitting the origin.  
- **Client/Player**: Requests the manifest, then fetches chunks sequentially over HTTP and appends them to the video buffer.  

This design makes video delivery **scalable, CDN-friendly, and adaptive** (different qualities can be served depending on network conditions).

## HLS vs DASH

Both HLS (HTTP Live Streaming) and MPEG-DASH (Dynamic Adaptive Streaming over HTTP) are **HTTP-based adaptive streaming protocols**.  
They work in a similar way: video is split into segments, a manifest describes renditions, and the player uses MSE to fetch and append them.  
The main differences come from ecosystem support and standardization.

| Feature              | HLS (HTTP Live Streaming)                        | DASH (Dynamic Adaptive Streaming over HTTP)        |
|----------------------|--------------------------------------------------|----------------------------------------------------|
| **Owner / Standard** | Apple (RFC 8216)                                 | MPEG (ISO/IEC 23009) – open standard               |
| **Manifest format**  | `.m3u8` (M3U playlist, text-based)               | `.mpd` (XML-based)                                 |
| **Segment format**   | Traditionally TS, now also fMP4 (via CMAF)       | Usually fMP4 (via CMAF)                            |
| **Browser support**  | ✅ Native in Safari/iOS (no JS needed) <br> ⚠️ Needs `hls.js` in Chrome/Firefox/Edge | ⚠️ No native Safari support <br> ✅ Works with `dash.js` or Shaka |
| **Device support**   | Mandatory on iOS/tvOS, strong in Apple ecosystem | Widely supported on Android, Smart TVs, set-top boxes |
| **Low latency**      | LL-HLS (Apple-specific)                          | LL-DASH (CMAF-based, open ecosystem)               |
| **DRM support**      | FairPlay (Apple DRM)                             | Widevine (Google), PlayReady (Microsoft), others   |
| **Industry adoption**| OTT services, iOS apps, Safari-first             | Android, Smart TVs, cross-platform streaming       |

### How to Choose
- If you must support **iOS Safari** → you need **HLS**.  
- If you target **Android, browsers, and TVs** → DASH is widely supported.  
- In practice, most platforms generate **both** HLS and DASH from the same encoded segments using **CMAF**, then serve the right one depending on the client.