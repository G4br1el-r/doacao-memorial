"use client";

import { type MotionValue, useMotionValue } from "motion/react";
import { useEffect, useState } from "react";
import {
  GLOW_RADIUS,
  GLOW_RADIUS_MOBILE,
  LIGHT_RADIUS,
  LIGHT_RADIUS_MOBILE,
  MOBILE_BREAKPOINT,
} from "../constants";

function useResponsiveRadius(desktop: number, mobile: number) {
  const [radius, setRadius] = useState(desktop);

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const sync = () => setRadius(query.matches ? mobile : desktop);

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, [desktop, mobile]);

  return radius;
}

export function useLightRadius() {
  return useResponsiveRadius(LIGHT_RADIUS, LIGHT_RADIUS_MOBILE);
}

/* alcance em que a chama acende uma palavra do fundo */
export function useGlowReach() {
  return useResponsiveRadius(GLOW_RADIUS, GLOW_RADIUS_MOBILE);
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
