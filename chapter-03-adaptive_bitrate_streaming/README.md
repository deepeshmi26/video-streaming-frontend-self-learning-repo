# Chapter 03 – Adaptive Bitrate Streaming (ABR)

## Problem
A fixed-quality HLS stream is not flexible:
- On slow networks, high-quality video causes buffering.
- On fast networks, low-quality video looks poor.

## Solution
Adaptive Bitrate Streaming (ABR) solves this by:
- Encoding video at multiple qualities (360p, 720p, 1080p).
- Creating a **master playlist** (`.m3u8`) that points to each quality.
- Allowing the player to switch between renditions during playback.

## How ABR Works
1. **Master Playlist** lists all renditions with their bandwidth/resolution.
   ```m3u8
   #EXTM3U
   #EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360
   360p.m3u8
   #EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1280x720
   720p.m3u8
   #EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080
   1080p.m3u8