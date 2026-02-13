"use client";

import { useEffect, useState } from "react";

const YOUTUBE_VIDEO_ID = "sqUm9P_sY9M";

export function BackgroundMusic() {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (started) {
      return;
    }

    const startMusic = () => setStarted(true);

    window.addEventListener("pointerdown", startMusic, { once: true });
    window.addEventListener("keydown", startMusic, { once: true });
    window.addEventListener("touchstart", startMusic, { once: true });

    return () => {
      window.removeEventListener("pointerdown", startMusic);
      window.removeEventListener("keydown", startMusic);
      window.removeEventListener("touchstart", startMusic);
    };
  }, [started]);

  if (!started) {
    return null;
  }

  return (
    <iframe
      title="Música de fondo"
      src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&loop=1&playlist=${YOUTUBE_VIDEO_ID}&controls=0&disablekb=1&modestbranding=1&rel=0&playsinline=1`}
      allow="autoplay; encrypted-media"
      className="pointer-events-none fixed bottom-0 left-0 h-0 w-0 opacity-0"
    />
  );
}
