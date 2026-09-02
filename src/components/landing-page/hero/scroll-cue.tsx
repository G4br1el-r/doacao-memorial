"use client";

import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { SMOOTH } from "@/lib/animation/easing";
import { SCROLL_CUE_LABEL } from "./hero-copy/constants";

export function ScrollCue() {
  return (
    <motion.div
      className="absolute inset-x-0 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] z-30 flex flex-col items-center gap-2 xl:hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay: 2.6, ease: SMOOTH }}
      aria-hidden="true"
    >
      <span className="flex h-9 w-[22px] items-start justify-center rounded-full border border-[#d9c9a3]/50 pt-1.5">
        <motion.span
          className="h-1.5 w-[3px] rounded-full bg-[#d9c9a3]"
          animate={{ y: [0, 9, 0], opacity: [0, 1, 0] }}
          transition={{
            duration: 1.8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </span>

      <span className="text-[10px] tracking-[0.22em] text-[#e8dcc0]/80">
        {SCROLL_CUE_LABEL}
      </span>

      <motion.span
        animate={{ y: [0, 4, 0] }}
        transition={{
          duration: 1.8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <ChevronDown className="h-3.5 w-3.5 text-[#d9c9a3]" />
      </motion.span>
    </motion.div>
  );
}
