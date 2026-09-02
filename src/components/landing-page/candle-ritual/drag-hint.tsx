"use client";

import { AnimatePresence, motion } from "motion/react";

interface DragHintProps {
  visible: boolean;
  byTouch: boolean;
}

export function DragHint({ visible, byTouch }: DragHintProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.p
          className="absolute top-[calc(2.5rem+env(safe-area-inset-top))] left-1/2 z-30 max-w-[calc(100%-2rem)] -translate-x-1/2 text-center text-[12px] tracking-[0.2em] text-[#e8dcc0] sm:max-w-none sm:whitespace-nowrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 4.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          {byTouch
            ? "ARRASTE A VELA PARA ILUMINAR"
            : "MOVA O MOUSE PARA ILUMINAR"}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
