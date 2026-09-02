"use client";

import { motion } from "motion/react";

export function CandlePulse() {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 -z-10 rounded-full"
      style={{
        background:
          "radial-gradient(circle at 50% 40%, rgba(217,201,163,0.20), transparent 62%)",
      }}
      animate={{
        opacity: [0.25, 0.8, 0.25],
        scale: [0.9, 1.14, 0.9],
      }}
      transition={{
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    />
  );
}
