"use client";

import { type MotionValue, motion } from "motion/react";
import { SMOOTH } from "@/lib/animation/easing";

interface DarknessLayerProps {
  free: boolean;
  mask: MotionValue<string>;
}

export function DarknessLayer({ free, mask }: DarknessLayerProps) {
  return (
    <motion.div
      className="absolute inset-0 bg-black"
      style={{
        maskImage: free ? mask : undefined,
        WebkitMaskImage: free ? mask : undefined,
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: free ? 0.94 : 1 }}
      transition={{ duration: 1.6, ease: SMOOTH }}
    />
  );
}
