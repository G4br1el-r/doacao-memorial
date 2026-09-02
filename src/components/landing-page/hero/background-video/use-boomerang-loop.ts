"use client";

import { type RefObject, useEffect } from "react";
import { REWIND_MARGIN_SECONDS } from "./constants";

export function useBoomerangLoop(
  videoRef: RefObject<HTMLVideoElement | null>,
  shouldPlay: boolean,
) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldPlay) return;

    let frame = 0;
    let lastTimestamp = 0;
    let rewinding = false;

    const stopRewind = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      rewinding = false;
    };

    const rewind = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const delta = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      const next = video.currentTime - delta;

      if (next <= 0) {
        video.currentTime = 0;
        stopRewind();
        video.play().catch(() => {});
        return;
      }

      video.currentTime = next;
      frame = requestAnimationFrame(rewind);
    };

    const onTimeUpdate = () => {
      if (rewinding || !video.duration) return;

      if (video.currentTime >= video.duration - REWIND_MARGIN_SECONDS) {
        rewinding = true;
        lastTimestamp = 0;
        video.pause();
        frame = requestAnimationFrame(rewind);
      }
    };

    const onEnded = () => {
      if (rewinding) return;
      rewinding = true;
      lastTimestamp = 0;
      video.currentTime = video.duration;
      frame = requestAnimationFrame(rewind);
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("ended", onEnded);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("ended", onEnded);
      stopRewind();
    };
  }, [videoRef, shouldPlay]);
}
