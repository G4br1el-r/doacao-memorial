"use client";

import { motion } from "motion/react";
import { SMOOTH } from "@/lib/animation/easing";

interface FadeInProps {
  duration: number;
  delay?: number;
  y?: number;
  x?: number;
  className?: string;
  children: React.ReactNode;
}

export function FadeIn({
  duration,
  delay,
  y,
  x,
  className,
  children,
}: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration, delay, ease: SMOOTH }}
    >
      {children}
    </motion.div>
  );
}
