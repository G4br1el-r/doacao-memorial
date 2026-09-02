"use client";

import type { MotionValue } from "motion/react";
import { useEffect } from "react";

export function usePointerFollow(
  enabled: boolean,
  x: MotionValue<number>,
  y: MotionValue<number>,
) {
  useEffect(() => {
    if (!enabled) return;

    const follow = (event: PointerEvent) => {
      x.set(event.clientX - window.innerWidth / 2);
      y.set(event.clientY - window.innerHeight / 2);
    };

    window.addEventListener("pointermove", follow);
    return () => window.removeEventListener("pointermove", follow);
  }, [enabled, x, y]);
}
