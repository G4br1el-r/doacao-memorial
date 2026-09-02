"use client";

import { motion } from "motion/react";
import { SMOOTH } from "@/lib/animation/easing";

interface AnimatedLetterProps {
  letter: string;
  delay: number;
}

export function AnimatedLetter({ letter, delay }: AnimatedLetterProps) {
  return (
    <motion.span
      className="inline-block"
      initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.9, delay, ease: SMOOTH }}
    >
      {letter === " " ? "\u00A0" : letter}
    </motion.span>
  );
}
