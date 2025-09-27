# Modern Video Player with HLS Support

A modern, feature-rich video player built with React and HLS.js, supporting adaptive bitrate streaming, thumbnails preview, and custom controls.

## Features

- 🎥 HLS (HTTP Live Streaming) support
- 🎚️ Adaptive bitrate streaming with quality selection
- 👆 Thumbnail preview on hover
- 📝 Multi-language subtitle support
- 🎛️ Custom modern UI controls
- 🖱️ Interactive progress bar
- 🔊 Volume control
- ⚡ Efficient video buffering
- 🎨 Modern, responsive design

## Project Structure

```
src/
  components/
    VideoPlayer/
      components/       # Child components
        ProgressBar.js
        VideoControls.js
      hooks/           # Custom hooks
        useHls.js
        useSubtitles.js
        useThumbnails.js
        useVideoProgress.js
      utils/           # Utility functions
        vttParser.js
      styles/          # Component styles
        theme.js
        controls.js
        progress.js
      VideoPlayer.js   # Main component
      index.js
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Usage

```jsx
import VideoPlayer from './components/VideoPlayer';

function App() {
  return (
    <VideoPlayer
      src="your-hls-stream.m3u8"
      thumbnailsVtt="/thumbnails.vtt"
      subtitles={[
        {
          label: "English",
          srclang: "en",
          src: "/subtitles-en.vtt"
        }
      ]}
    />
  );
}
```

## Dependencies

- React
- hls.js

## License

MIT License
