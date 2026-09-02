"use client";

import { Flame } from "lucide-react";
import { motion } from "motion/react";
import { SMOOTH } from "@/lib/animation/easing";

interface LightCandleButtonProps {
  onClick: () => void;
}

export function LightCandleButton({ onClick }: LightCandleButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="group mt-5 flex min-h-11 items-center gap-3 rounded-lg bg-linear-to-r from-[#c9b184] via-[#f0e2c0] to-[#c9b184] px-8 py-3.5 text-[13px] font-semibold tracking-[0.15em] text-black transition-opacity hover:opacity-90"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.9, ease: SMOOTH }}
    >
      <Flame className="h-4 w-4 transition-transform group-hover:scale-110" />
      ACENDER UMA VELA
    </motion.button>
  );
}
