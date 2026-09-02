import type { Inscription } from "./types";

export const DAYS_LIT = 7;

export const LIGHT_RADIUS = 460;
export const LIGHT_RADIUS_MOBILE = 210;
export const MOBILE_BREAKPOINT = 1280;

export const DARKENING_MS = 700;
export const LIGHTING_MS = 260;

export const SPRING = { stiffness: 220, damping: 24, mass: 0.7 };

export const TILT_RANGE = [-500, 500];
export const TILT_DEGREES = [-11, 11];

export const WICK_OFFSET = 70;

export const INSCRIPTIONS: Inscription[] = [
  { text: "FÉ", x: 16, y: 26, depth: 0.9, size: "text-5xl sm:text-7xl" },
  {
    text: "CARIDADE",
    x: 76,
    y: 34,
    depth: 0.75,
    size: "text-3xl sm:text-5xl",
  },
  {
    text: "ESPERANÇA",
    x: 30,
    y: 63,
    depth: 0.8,
    size: "text-3xl sm:text-5xl",
  },
  { text: "MISSÃO", x: 80, y: 60, depth: 0.65, size: "text-2xl sm:text-4xl" },
  {
    text: "EVANGELIZAÇÃO",
    x: 20,
    y: 46,
    depth: 0.5,
    size: "text-xl sm:text-3xl",
  },
  { text: "ORAÇÃO", x: 60, y: 16, depth: 0.55, size: "text-2xl sm:text-4xl" },
];
