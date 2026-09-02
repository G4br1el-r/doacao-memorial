"use client";

import { AnimatePresence, motion } from "motion/react";
import { SMOOTH } from "@/lib/animation/easing";
import { DAYS_LIT } from "./constants";

interface RitualMessageProps {
  visible: boolean;
  name?: string;
  endDate: string;
  onClose: () => void;
}

export function RitualMessage({
  visible,
  name,
  endDate,
  onClose,
}: RitualMessageProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute inset-x-0 bottom-8 z-30 flex cursor-default flex-col items-center px-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 5.4, ease: SMOOTH }}
        >
          <p className="font-serif text-2xl font-medium leading-snug text-[#e8dcc0] sm:text-3xl">
            {name ? `Sua vela está acesa, ${name}.` : "Sua vela está acesa."}
          </p>
          <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-white/70">
            Ela permanecerá acesa por {DAYS_LIT} dias, até {endDate}, e será
            lembrada nas intenções da missão.
          </p>

          <motion.button
            type="button"
            onClick={onClose}
            className="mt-6 rounded-lg border border-[#d9c9a3]/40 px-8 py-2.5 text-[12px] tracking-[0.2em] text-[#e8dcc0] transition-colors hover:border-[#d9c9a3]/80 hover:bg-[#d9c9a3]/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 6.4 }}
          >
            FINALIZAR
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
