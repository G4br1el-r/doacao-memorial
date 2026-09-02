"use client";

import { AnimatePresence, motion } from "motion/react";
import { SMOOTH } from "@/lib/animation/easing";

interface InvitationTextProps {
  visible: boolean;
}

export function InvitationText({ visible }: InvitationTextProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.p
          className="absolute left-1/2 top-[46%] z-10 -translate-x-1/2 px-8 text-center font-serif text-xl font-medium text-[#e8dcc0] sm:text-3xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          transition={{ duration: 0.9, delay: 0.45, ease: SMOOTH }}
        >
          Toque na vela para acendê-la.
        </motion.p>
      )}
    </AnimatePresence>
  );
}
