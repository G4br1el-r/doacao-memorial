"use client";

import { type MotionValue, useMotionValue } from "motion/react";
import { useEffect, useState } from "react";
import {
  LIGHT_RADIUS,
  LIGHT_RADIUS_MOBILE,
  MOBILE_BREAKPOINT,
} from "../constants";

function useLightRadius() {
  const [radius, setRadius] = useState(LIGHT_RADIUS);

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const sync = () =>
      setRadius(query.matches ? LIGHT_RADIUS_MOBILE : LIGHT_RADIUS);

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return radius;
}

export function useLightFlicker(enabled: boolean): MotionValue<number> {
  const radius = useLightRadius();
  const flicker = useMotionValue(radius);

  useEffect(() => {
    if (!enabled) {
      flicker.set(radius);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const scale = radius / LIGHT_RADIUS;

    const pulse = (timestamp: number) => {
      const elapsed = (timestamp - start) / 1000;
      const variation =
        (Math.sin(elapsed * 2.3) * 20 + Math.sin(elapsed * 5.7) * 10) * scale;
      flicker.set(radius + variation);
      frame = requestAnimationFrame(pulse);
    };
    frame = requestAnimationFrame(pulse);

    return () => cancelAnimationFrame(frame);
  }, [enabled, flicker, radius]);

  return flicker;
}
