"use client";

import { AnimatePresence, motion } from "motion/react";
import { SMOOTH } from "@/lib/animation/easing";
import { Flame } from "./flame";

interface SourceFlameProps {
  visible: boolean;
}

export function SourceFlame({ visible }: SourceFlameProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pointer-events-none absolute left-1/2 top-[26%] h-24 w-24 -translate-x-1/2"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{
            opacity: 0,
            scale: 0.3,
            transition: { duration: 0.22, ease: "easeOut" },
          }}
          transition={{ duration: 0.9, ease: SMOOTH }}
        >
          <Flame active size={0.62} sway={0.42} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
