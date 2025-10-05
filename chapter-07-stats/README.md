# 🎬 Chapter 07 — Stats & Scalability

This chapter explains **how a video player measures its performance** and **adapts to network conditions** to keep playback smooth.

---

## ❓What did we build?

We added a `useQoEMetrics` hook that tracks:
- Current quality (Auto, 720p, 1080p)
- Buffer health (how much video is preloaded)
- Bitrate and download speed
- Rebuffer events (when playback pauses)
- Latency and errors

These metrics are shown in a small “Stats for nerds” overlay.

---

## ❓Why do we need these stats?

Because the player should **adjust itself** based on network and device conditions.  
If the connection slows down → reduce quality.  
If the connection improves → increase quality.

Without this, the user will face buffering or wasted bandwidth.

---

## ❓What’s the difference between Bitrate, Download Speed, and Throughput?

| Term | Meaning | Easy Example |
|------|----------|---------------|
| **Bitrate** | How heavy 1 second of video is (set by the encoder). | 720p needs ~2 Mbps |
| **Download Speed** | How fast we actually fetched the video. | Current network = 4 Mbps |
| **Throughput** | Average of recent download speeds (used for predictions). | Usually smoothed speed |

👉 If **throughput > bitrate** → player can go higher quality.  
👉 If **throughput < bitrate** → player must drop quality.

---

## ❓What is Buffer Health?
bufferHealth = bufferedEnd - currentTime

The amount of video already downloaded and ready to play.  

More buffer = safer playback.  
Less buffer = risk of rebuffering.

---

## ❓What is QoE?

**QoE (Quality of Experience)** means how smooth playback *feels* to the viewer —  
startup delay, no stutters, good resolution, etc.  
It’s different from **QoS (Quality of Service)** which is about network performance.

---

## ❓How does adaptive streaming (ABR) work?

1. Measure download speed per fragment.  
2. Average it → throughput.  
3. Compare throughput vs available bitrates.  
4. Switch up or down accordingly.

This is how HLS and DASH deliver videos that “just work” across all networks.

---

## ✅ Summary

In this chapter we:
- Learned what metrics matter for playback.  
- Understood how bitrate, download speed and buffer are connected.  
- Built a small metrics tracker using `hls.js` events.  
- Made our player adaptive and scalable.

Next: we’ll explore **DRM (Protected Content)** and secure playback.