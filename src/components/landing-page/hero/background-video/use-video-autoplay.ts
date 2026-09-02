"use client";

import { type RefObject, useEffect, useState } from "react";

export function useVideoAutoplay(
  videoRef: RefObject<HTMLVideoElement | null>,
  shouldPlay: boolean,
) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldPlay) return;

    video.muted = true;
    video.defaultMuted = true;

    const tryPlay = () => {
      const attempt = video.play();
      if (attempt) {
        attempt.catch(() => {});
      }
    };

    video.load();
    tryPlay();

    const onCanPlay = () => {
      setIsReady(true);
      tryPlay();
    };
    video.addEventListener("canplay", onCanPlay);

    if (video.readyState >= video.HAVE_CURRENT_DATA) setIsReady(true);

    const onVisibility = () => {
      if (!document.hidden) tryPlay();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onFirstInteraction = () => tryPlay();
    document.addEventListener("touchstart", onFirstInteraction, { once: true });
    document.addEventListener("click", onFirstInteraction, { once: true });

    return () => {
      video.removeEventListener("canplay", onCanPlay);
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("touchstart", onFirstInteraction);
      document.removeEventListener("click", onFirstInteraction);
    };
  }, [videoRef, shouldPlay]);

  return isReady;
}
