"use client";

import { motion } from "motion/react";
import { SMOOTH } from "@/lib/animation/easing";
import { BackgroundVideo } from "./background-video";

export function HeroBackground() {
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0, scale: 1.06 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 2.4, ease: SMOOTH }}
    >
      <BackgroundVideo poster="/background.png" />
    </motion.div>
  );
}
