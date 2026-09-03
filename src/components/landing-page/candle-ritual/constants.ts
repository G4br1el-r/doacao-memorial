import type { Inscription } from "./types";

export const DAYS_LIT = 7;

export const LIGHT_RADIUS = 320;
export const LIGHT_RADIUS_MOBILE = 165;
export const MOBILE_BREAKPOINT = 1280;

export const DARKENING_MS = 700;
export const LIGHTING_MS = 260;

export const SPRING = { stiffness: 220, damping: 24, mass: 0.7 };

export const TILT_RANGE = [-500, 500];
export const TILT_DEGREES = [-11, 11];

export const WICK_OFFSET = 70;

/* distancia, em px, entre a chama e a palavra pra ela ser descoberta */
export const GLOW_RADIUS = 190;
export const GLOW_RADIUS_MOBILE = 120;

export const INSCRIPTIONS: Inscription[] = [
  { text: "FÉ", x: 15, y: 24, depth: 0.9, size: "text-5xl sm:text-7xl" },
  {
    text: "ESPERANÇA",
    x: 78,
    y: 22,
    depth: 0.75,
    size: "text-3xl sm:text-5xl",
  },
  {
    text: "CARIDADE",
    x: 82,
    y: 58,
    depth: 0.8,
    size: "text-3xl sm:text-5xl",
  },
  { text: "MISSÃO", x: 16, y: 62, depth: 0.65, size: "text-2xl sm:text-4xl" },
  /* longe do rodape: ali ficam a mensagem final e o botao finalizar */
  {
    text: "EVANGELIZAÇÃO",
    x: 30,
    y: 40,
    depth: 0.55,
    size: "text-xl sm:text-3xl",
  },
  { text: "ORAÇÃO", x: 72, y: 40, depth: 0.6, size: "text-2xl sm:text-4xl" },
];
