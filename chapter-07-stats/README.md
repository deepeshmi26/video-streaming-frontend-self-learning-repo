# Chapter 7: Video Player Statistics Overlay

This chapter demonstrates how to add a statistics overlay to a video player to display technical metrics about video playback. The stats overlay helps monitor video performance by showing key metrics like resolution, bitrate, and buffer status in real-time.

## Key Features

- Real-time display of video statistics including:
  - Current resolution
  - Bitrate
  - Buffer length
  - Playback position
  - Dropped frames
  - Decoded frames
  - Playback speed

- Tooltip explanations for each metric
- Semi-transparent overlay that integrates with the player UI
- Auto-updating stats every 500ms
- HLS integration for bitrate monitoring

## Stats Overview

- Resolution: Shows current video dimensions being rendered
- Bitrate: Indicates streaming quality and bandwidth usage
- Buffer: Displays how many seconds are preloaded
- Current Time: Shows exact playback position
- Dropped Frames: Helps identify performance issues
- Decoded Frames: Shows successful frame processing
- Playback Rate: Indicates current playback speed

## Usage

The StatsOverlay component is automatically included in the VideoPlayer and will appear in the bottom left corner. Users can hover over the info icon next to each stat to see an explanation of what that metric means.

