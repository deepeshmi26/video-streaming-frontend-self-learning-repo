import React, { useEffect, useRef } from "react";

const MSEPlayer = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const mediaSource = new MediaSource();
    video.src = URL.createObjectURL(mediaSource);

    mediaSource.addEventListener("sourceopen", async () => {
      const mime = 'video/mp4; codecs="avc1.64001e, mp4a.40.2"';
      if (!MediaSource.isTypeSupported(mime)) {
        console.error("MIME type not supported:", mime);
        return;
      }

      const sb = mediaSource.addSourceBuffer(mime);

      try {
        await fetch('https://nickdesaulniers.github.io/netfix/demo/frag_bunny.mp4').then((response) => {
          return response.arrayBuffer();
        }).then((videoData) => {
            sb.appendBuffer(videoData);
        });

        sb.addEventListener("updateend", () => {
          mediaSource.endOfStream();
        });
      } catch (err) {
        console.error("Error loading segments", err);
      }
    });
  }, []);

  return (
    <video
      ref={videoRef}
      controls
      width="640"
      height="360"
      style={{ backgroundColor: "black" }}
    />
  );
};

export default MSEPlayer;