import type { SignatureStroke } from "./types";

export const SIGNATURE_STROKES: SignatureStroke[] = [
  { x0: 61, x1: 179.5, word: 0 },
  { x0: 179.5, x1: 298, word: 0 },
  { x0: 348, x1: 445.3, word: 1 },
  { x0: 445.3, x1: 542.5, word: 1 },
  { x0: 542.5, x1: 639.8, word: 1 },
  { x0: 639.8, x1: 737, word: 1 },
  { x0: 746, x1: 845.4, word: 2 },
  { x0: 845.4, x1: 944.8, word: 2 },
  { x0: 944.8, x1: 1044.2, word: 2 },
  { x0: 1044.2, x1: 1143.6, word: 2 },
  { x0: 1143.6, x1: 1243, word: 2 },
  { x0: 1274, x1: 1381.3, word: 3 },
  { x0: 1381.3, x1: 1488.5, word: 3 },
  { x0: 1488.5, x1: 1595.8, word: 3 },
  { x0: 1595.8, x1: 1703, word: 3 },
  { x0: 1703, x1: 1810.3, word: 3 },
  { x0: 1810.3, x1: 1917.5, word: 3 },
  { x0: 1917.5, x1: 2024.8, word: 3 },
  { x0: 2024.8, x1: 2132, word: 3 },
];

export const WORD_PAUSE = 0.12;

export const STROKE_DURATION = 0.2;

export const STROKE_OVERLAP = 0.72;

export const MASK_TOP = 150;
export const MASK_BOTTOM = 545;
export const MASK_HEIGHT = MASK_BOTTOM - MASK_TOP;

export const SIGNATURE_VIEWBOX = "0 0 2172 724";
export const SIGNATURE_LABEL = "Pe. Vitor Coelho de Almeida";
