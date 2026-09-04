"use client";

import { AnimatePresence, motion } from "motion/react";
import { INSCRIPTIONS } from "./constants";

interface DragHintProps {
  visible: boolean;
  foundCount: number;
}

export function DragHint({ visible, foundCount }: DragHintProps) {
  const total = INSCRIPTIONS.length;
  const started = foundCount > 0;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute top-[calc(2.5rem+env(safe-area-inset-top))] left-1/2 z-30 flex max-w-[calc(100%-2rem)] -translate-x-1/2 flex-col items-center gap-2 text-center sm:max-w-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <motion.p
            className="text-[12px] tracking-[0.2em] text-[#e8dcc0] sm:whitespace-nowrap"
            animate={{ opacity: [0.45, 0.85, 0.45] }}
            transition={{
              duration: 4.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            LEVE A LUZ E REVELE AS PALAVRAS
          </motion.p>

          <motion.span
            className="text-[11px] tracking-[0.28em] text-[#d9c9a3]/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: started ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          >
            {foundCount} DE {total}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
