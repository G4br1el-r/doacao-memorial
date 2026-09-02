"use client";

import { motion } from "motion/react";
import { SMOOTH } from "@/lib/animation/easing";
import { TAGLINE } from "./constants";

export function HeroTagline() {
  return (
    <motion.p
      className="relative z-30 mt-8 max-w-md text-lg leading-relaxed text-white/90"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 1.5, ease: SMOOTH }}
    >
      {TAGLINE}
    </motion.p>
  );
}
