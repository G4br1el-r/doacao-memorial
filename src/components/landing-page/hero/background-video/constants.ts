export const LEGACY_INLINE_AUTOPLAY_ATTRS = {
  "webkit-playsinline": "true",
  "x5-playsinline": "true",
  "x5-video-player-type": "h5",
} as const;

export const DEFAULT_SOURCES = [
  { src: "/video/webm/background.webm", type: "video/webm" },
  { src: "/video/mp4/background.mp4", type: "video/mp4" },
];

export const REWIND_MARGIN_SECONDS = 0.3;
