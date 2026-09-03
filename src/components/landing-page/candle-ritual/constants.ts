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

/* no mobile as palavras descem em zigue-zague, uma faixa por vez, ate 66% da
   altura - o rodape fica pro texto final. os tamanhos tambem caem, senao as
   maiores nao cabem numa tela de 360px */
export const INSCRIPTIONS: Inscription[] = [
  {
    text: "FÉ",
    x: 15,
    y: 24,
    mobileX: 22,
    mobileY: 18,
    depth: 0.9,
    size: "text-4xl sm:text-7xl",
  },
  {
    text: "ESPERANÇA",
    x: 78,
    y: 22,
    mobileX: 68,
    mobileY: 28,
    depth: 0.75,
    size: "text-2xl sm:text-5xl",
  },
  {
    text: "EVANGELIZAÇÃO",
    x: 30,
    y: 40,
    mobileX: 34,
    mobileY: 38,
    depth: 0.55,
    size: "text-lg sm:text-3xl",
  },
  {
    text: "ORAÇÃO",
    x: 72,
    y: 40,
    mobileX: 70,
    mobileY: 48,
    depth: 0.6,
    size: "text-xl sm:text-4xl",
  },
  {
    text: "CARIDADE",
    x: 82,
    y: 58,
    mobileX: 32,
    mobileY: 58,
    depth: 0.8,
    size: "text-2xl sm:text-5xl",
  },
  {
    text: "MISSÃO",
    x: 16,
    y: 62,
    mobileX: 70,
    mobileY: 66,
    depth: 0.65,
    size: "text-xl sm:text-4xl",
  },
];
