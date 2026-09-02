"use client";

import { motion } from "motion/react";
import { SMOOTH } from "@/lib/animation/easing";
import { EYEBROW } from "./constants";

export function HeroEyebrow() {
  return (
    <motion.div
      className="flex items-center gap-4"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2, ease: SMOOTH }}
    >
      <span className="text-base tracking-[0.3em] text-[#d9c9a3]">
        {EYEBROW}
      </span>
      <motion.span
        className="h-px bg-[#d9c9a3]/60"
        initial={{ width: 0 }}
        animate={{ width: 80 }}
        transition={{ duration: 1.2, delay: 0.6, ease: SMOOTH }}
      />
    </motion.div>
  );
}
