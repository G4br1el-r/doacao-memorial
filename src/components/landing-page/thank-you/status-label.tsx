"use client";

import { AnimatePresence, motion } from "motion/react";
import { SMOOTH } from "@/lib/animation/easing";

interface StatusLabelProps {
  confirmed: boolean;
}

export function StatusLabel({ confirmed }: StatusLabelProps) {
  return (
    <div className="mt-6 h-5">
      <AnimatePresence mode="wait">
        <motion.p
          key={confirmed ? "ok" : "processando"}
          className="text-[11px] tracking-[0.25em] text-[#d9c9a3]"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.45, ease: SMOOTH }}
        >
          {confirmed ? "DOAÇÃO CONFIRMADA" : "PROCESSANDO"}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
