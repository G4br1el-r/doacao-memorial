"use client";

import { useInView } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils/cn";
import { DEFAULT_SOURCES, LEGACY_INLINE_AUTOPLAY_ATTRS } from "./constants";
import { useBoomerangLoop } from "./use-boomerang-loop";
import { useVideoAutoplay } from "./use-video-autoplay";
import { VideoPoster } from "./video-poster";

interface BackgroundVideoProps {
  sources?: { src: string; type: string }[];
  className?: string;
  playOnInView?: boolean;
  poster?: string;
}

export function BackgroundVideo({
  sources = DEFAULT_SOURCES,
  className,
  playOnInView = false,
  poster,
}: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(videoRef, { once: true, amount: 0.5 });
  const shouldPlay = !playOnInView || isInView;

  const isReady = useVideoAutoplay(videoRef, shouldPlay);
  useBoomerangLoop(videoRef, shouldPlay);

  return (
    <>
      {poster && <VideoPoster src={poster} className={className} />}
      <video
        ref={videoRef}
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out",
          isReady ? "opacity-100" : "opacity-0",
          className,
        )}
        autoPlay={!playOnInView}
        muted
        playsInline
        {...LEGACY_INLINE_AUTOPLAY_ATTRS}
        preload={poster ? "metadata" : "none"}
        disablePictureInPicture
        disableRemotePlayback
        controls={false}
        tabIndex={-1}
        aria-hidden="true"
      >
        {sources.map(({ src, type }) => (
          <source key={src} src={src} type={type} />
        ))}
      </video>
    </>
  );
}
