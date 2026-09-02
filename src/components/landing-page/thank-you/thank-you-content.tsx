"use client";

import { motion } from "motion/react";
import { SMOOTH } from "@/lib/animation/easing";
import { LightCandleButton } from "./light-candle-button";
import { ThankYouMessage } from "./thank-you-message";

interface ThankYouContentProps {
  firstName?: string;
  amount?: string;
  onLightCandle: () => void;
}

export function ThankYouContent({
  firstName,
  amount,
  onLightCandle,
}: ThankYouContentProps) {
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: SMOOTH }}
    >
      <ThankYouMessage firstName={firstName} amount={amount} />

      <motion.div
        className="mt-8 h-px w-24 bg-linear-to-r from-transparent via-[#d9c9a3]/60 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.4, ease: SMOOTH }}
      />

      <motion.p
        className="mt-8 text-[13px] leading-relaxed text-white/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.7, ease: SMOOTH }}
      >
        Antes de ir, acenda uma vela pela sua intenção.
      </motion.p>

      <LightCandleButton onClick={onLightCandle} />
    </motion.div>
  );
}
