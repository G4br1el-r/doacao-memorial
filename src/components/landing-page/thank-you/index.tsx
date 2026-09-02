"use client";

import { AnimatePresence, motion } from "motion/react";
import { SMOOTH } from "@/lib/animation/easing";
import { Seal } from "./seal";
import { StatusLabel } from "./status-label";
import { ThankYouContent } from "./thank-you-content";
import { useThankYouState } from "./use-thank-you-state";

interface ThankYouProps {
  onLightCandle: () => void;
  name?: string;
  amount?: string;
  alreadyConfirmed?: boolean;
  onConfirmed?: () => void;
}

export function ThankYou({
  onLightCandle,
  name,
  amount,
  alreadyConfirmed,
  onConfirmed,
}: ThankYouProps) {
  const state = useThankYouState(alreadyConfirmed, onConfirmed);

  const firstName = name?.trim().split(/\s+/)[0];
  const confirmed = state !== "processando";

  return (
    <motion.div
      className="flex min-h-0 flex-col items-center overflow-y-auto rounded-2xl border border-[#d9c9a3]/20 bg-black/55 px-8 py-12 text-center shadow-xl backdrop-blur-xl [scrollbar-color:rgba(217,201,163,0.35)_transparent] [scrollbar-width:thin]"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1, ease: SMOOTH }}
    >
      <Seal confirmed={confirmed} />
      <StatusLabel confirmed={confirmed} />

      <AnimatePresence>
        {state === "pronto" && (
          <ThankYouContent
            firstName={firstName}
            amount={amount}
            onLightCandle={onLightCandle}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
