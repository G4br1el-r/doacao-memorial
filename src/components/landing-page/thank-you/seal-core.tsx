"use client";

import { Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { SMOOTH } from "@/lib/animation/easing";

interface SealCoreProps {
  confirmed: boolean;
}

export function SealCore({ confirmed }: SealCoreProps) {
  return (
    <AnimatePresence mode="wait">
      {confirmed ? (
        <motion.span
          key="check"
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.35, ease: SMOOTH }}
        >
          <Check className="h-11 w-11 text-[#e8dcc0]" strokeWidth={1.6} />
        </motion.span>
      ) : (
        <motion.span
          key="brilho"
          className="h-3 w-3 rounded-full bg-[#d9c9a3]"
          exit={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.15, 0.85] }}
          transition={{
            duration: 1.6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      )}
    </AnimatePresence>
  );
}
