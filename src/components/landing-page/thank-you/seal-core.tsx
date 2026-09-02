"use client";

import { AnimatePresence, motion } from "motion/react";
import { SMOOTH } from "@/lib/animation/easing";

interface SealCoreProps {
  confirmed: boolean;
}

export function SealCore({ confirmed }: SealCoreProps) {
  return (
    <AnimatePresence initial={false}>
      {confirmed ? (
        <motion.span
          key="check"
          className="absolute inset-[6px] flex items-center justify-center rounded-full bg-[#e8dcc0]"
          initial={{ opacity: 0, scale: 0.2 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.2 }}
          transition={{ duration: 0.55, delay: 0.2, ease: SMOOTH }}
        >
          <svg
            viewBox="0 0 40 40"
            className="h-2/5 w-2/5 overflow-visible"
            fill="none"
            aria-hidden="true"
          >
            <motion.path
              d="M6 21.5 L15.5 30.5 L34 9.5"
              stroke="#0b0b0b"
              strokeWidth={5}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.45, delay: 0.45, ease: SMOOTH }}
            />
          </svg>
        </motion.span>
      ) : (
        <motion.span
          key="brilho"
          className="h-3 w-3 rounded-full bg-[#d9c9a3]"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.15, 0.85] }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{
            opacity: {
              duration: 1.6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            },
            scale: {
              duration: 1.6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            },
          }}
        />
      )}
    </AnimatePresence>
  );
}
