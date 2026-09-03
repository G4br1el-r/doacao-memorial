"use client";

import { motion } from "motion/react";
import { SMOOTH } from "@/lib/animation/easing";
import { cn } from "@/lib/utils/cn";

interface RitualStageProps {
  pinnedToPointer: boolean;
  onStageClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  children: React.ReactNode;
}

export function RitualStage({
  pinnedToPointer,
  onStageClick,
  children,
}: RitualStageProps) {
  return (
    <motion.div
      className={cn(
        "fixed inset-0 z-100 overflow-hidden bg-black",
        pinnedToPointer && "cursor-none",
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: SMOOTH }}
      role="dialog"
      aria-modal="true"
      aria-label="Acenda sua vela"
      onClick={onStageClick}
    >
      {children}
    </motion.div>
  );
}
