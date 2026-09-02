"use client";

import {
  type MotionValue,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { SPRING, TILT_DEGREES, TILT_RANGE, WICK_OFFSET } from "../constants";

export function useCandlePosition() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, SPRING);
  const smoothY = useSpring(y, SPRING);
  const rotation = useTransform(smoothX, TILT_RANGE, TILT_DEGREES);

  return { x, y, smoothX, smoothY, rotation };
}

export function useCandleLight(
  smoothX: MotionValue<number>,
  smoothY: MotionValue<number>,
  flicker: MotionValue<number>,
) {
  const lightX = useTransform(smoothX, (value) => `calc(50% + ${value}px)`);
  const lightY = useTransform(
    smoothY,
    (value) => `calc(50% + ${value - WICK_OFFSET}px)`,
  );

  const mask = useMotionTemplate`radial-gradient(circle ${flicker}px at ${lightX} ${lightY}, transparent 0%, transparent 22%, rgba(0,0,0,0.55) 48%, #000 78%)`;
  const halo = useMotionTemplate`radial-gradient(circle ${flicker}px at ${lightX} ${lightY}, rgba(255,176,80,0.17), rgba(255,140,40,0.06) 45%, transparent 72%)`;

  return { mask, halo };
}
