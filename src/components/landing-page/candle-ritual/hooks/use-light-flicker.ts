"use client";

import { type MotionValue, useMotionValue } from "motion/react";
import { useEffect } from "react";
import { LIGHT_RADIUS } from "../constants";

export function useLightFlicker(enabled: boolean): MotionValue<number> {
  const flicker = useMotionValue(LIGHT_RADIUS);

  useEffect(() => {
    if (!enabled) return;

    let frame = 0;
    const start = performance.now();

    const pulse = (timestamp: number) => {
      const elapsed = (timestamp - start) / 1000;
      const variation =
        Math.sin(elapsed * 2.3) * 20 + Math.sin(elapsed * 5.7) * 10;
      flicker.set(LIGHT_RADIUS + variation);
      frame = requestAnimationFrame(pulse);
    };
    frame = requestAnimationFrame(pulse);

    return () => cancelAnimationFrame(frame);
  }, [enabled, flicker]);

  return flicker;
}
