# HLS to MP4 Converter

A simple Node.js application to convert HLS (m3u8) streams to MP4 files.

## Prerequisites

1. Install Node.js (v14 or later)
2. Install FFmpeg:
   ```bash
   # On macOS with Homebrew
   brew install ffmpeg

   # On Ubuntu/Debian
   sudo apt-get install ffmpeg

   # On Windows with Chocolatey
   choco install ffmpeg
   ```

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

## Usage

Convert an M3U8 stream to MP4:
```bash
node converter.js <m3u8_url> <output_filename>
```

Example:
```bash
node converter.js https://example.com/stream.m3u8 output_video
```

The converted file will be saved in the `converted` directory with the name `output_video.mp4`.

## Features

- Preserves original video and audio quality (no re-encoding)
- Supports both local and remote m3u8 files
- Creates web-optimized MP4s with fast start
- Handles audio stream conversion properly

## Notes

- The converter uses FFmpeg's copy mode, which means it doesn't re-encode the video. This is fast but requires that the source streams use web-compatible codecs.
- If you need to convert streams with incompatible codecs, you'll need to modify the FFmpeg parameters to include transcoding.
- Make sure you have proper permissions/access to the M3U8 stream you're trying to convert.
