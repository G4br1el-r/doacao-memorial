"use client";

import { AnimatePresence, motion } from "motion/react";
import { SMOOTH } from "@/lib/animation/easing";

interface CollapseProps {
  open: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Collapse({ open, className, children }: CollapseProps) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          className={className}
          initial={{ height: 0, opacity: 0, marginTop: 0 }}
          animate={{ height: "auto", opacity: 1, marginTop: 12 }}
          exit={{ height: 0, opacity: 0, marginTop: 0 }}
          transition={{ duration: 0.35, ease: SMOOTH }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
