"use client";

import { motion } from "motion/react";
import { SMOOTH } from "@/lib/animation/easing";
import { TAGLINE } from "./constants";

export function HeroTagline() {
  return (
    <motion.blockquote
      className="relative z-30 hidden w-full max-w-md xl:mt-8 xl:block"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 1.5, ease: SMOOTH }}
    >
      <p className="font-serif text-xl italic leading-relaxed text-white/90">
        &ldquo;{TAGLINE}&rdquo;
      </p>
    </motion.blockquote>
  );
}
