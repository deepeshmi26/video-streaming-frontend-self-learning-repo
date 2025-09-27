# Chapter 5- Thumbnail Previews on Hover

In this section, we explored how platforms like YouTube and Netflix show preview thumbnails when hovering over the progress bar.

---

## 🔹 Options for Thumbnails

1. **Individual Images**
   - One JPEG/PNG per interval (e.g., every 5s).
   - ✅ Simple to generate, cacheable by CDN.
   - ❌ Too many HTTP requests for long videos.

2. **Single Sprite Sheet**
   - All thumbnails packed into one large image.
   - ✅ One HTTP request, CDN-friendly.
   - ❌ Large upfront download, wasteful if user never scrubs.

3. **Segmented Sprite Sheets**
   - Multiple smaller sprites (e.g., 10 min each), mapped via VTT/JSON.
   - ✅ Efficient balance: only fetch what’s needed.
   - ✅ CDN caches each sheet.
   - ❌ Slight extra logic to pick the right sheet.

4. **HTTP Streaming (HLS/DASH Trick-Play)**
   - Thumbnails or low-bitrate preview video packaged as segments with a manifest.
   - ✅ Unified with streaming infra, supports adaptive preview quality.
   - ❌ Complex infra, usually for large-scale OTT (Netflix, Prime).

5. **Custom API (Base64 + JSON)**
   - One API call returns all thumbnails for a given window.
   - ✅ Flexible, single request.
   - ❌ Payload ~33% larger, not CDN-cacheable, backend overhead.

---

## 🔹 Tradeoffs

| Approach               | Pros                                | Cons                                   | Best Use Case |
|------------------------|-------------------------------------|----------------------------------------|---------------|
| Individual Images      | Simple, cacheable                   | Too many requests                      | Prototypes, short clips |
| Single Sprite Sheet    | One request, CDN-friendly           | Wasteful for long videos               | Short videos |
| Segmented Sprite Sheets| Balanced, CDN works, efficient      | Needs VTT/JSON + selection logic       | YouTube-style scrubbing |
| HTTP Streaming (Trick-Play)| Unified infra, adaptive quality | Complex packaging, OTT-only            | Netflix, Prime Video |
| Custom API             | Flexible, single call               | Heavier, no CDN caching with base64    | Internal tools |

---

## 🔹 Final Choice

- **Short videos** → Single sprite sheet.  
- **Long videos (real-world web)** → Segmented sprite sheets with VTT mapping (YouTube style).  
- **OTT-scale platforms** → Trick-play videos packaged via HLS/DASH.  

✅ For our project: **Segmented sprite sheets + VTT** is the most practical and scalable choice.