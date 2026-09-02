"use client";

import { motion } from "motion/react";
import { SMOOTH } from "@/lib/animation/easing";

export function HeroPriest() {
  return (
    <motion.img
      src="/padre.png"
      alt="Padre"
      className="absolute bottom-0 left-1/2 z-10 h-[85vh] w-auto max-w-none -translate-x-1/2 object-contain"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.8, delay: 0.3, ease: SMOOTH }}
    />
  );
}
