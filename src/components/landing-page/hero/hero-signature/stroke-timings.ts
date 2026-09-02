import {
  SIGNATURE_STROKES,
  STROKE_DURATION,
  STROKE_OVERLAP,
  WORD_PAUSE,
} from "./constants";

export function strokeStartTimes(delay: number) {
  let elapsed = delay;

  return SIGNATURE_STROKES.map((stroke, index) => {
    if (index > 0 && stroke.word !== SIGNATURE_STROKES[index - 1].word) {
      elapsed += WORD_PAUSE;
    }
    const start = elapsed;
    elapsed += STROKE_DURATION * STROKE_OVERLAP;
    return start;
  });
}
