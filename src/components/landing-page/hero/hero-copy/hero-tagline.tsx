"use client";

import { motion } from "motion/react";
import { SMOOTH } from "@/lib/animation/easing";
import { TAGLINE } from "./constants";

export function HeroTagline() {
  return (
    <motion.p
      className="relative z-30 hidden w-full max-w-md text-lg leading-relaxed text-white/90 xl:mt-8 xl:block"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 1.5, ease: SMOOTH }}
    >
      {TAGLINE}
    </motion.p>
  );
}
