"use client";

import { type MotionValue, motion } from "motion/react";
import { SMOOTH } from "@/lib/animation/easing";

interface WarmHaloProps {
  halo: MotionValue<string>;
}

export function WarmHalo({ halo }: WarmHaloProps) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      style={{ background: halo }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.8, ease: SMOOTH }}
    />
  );
}
