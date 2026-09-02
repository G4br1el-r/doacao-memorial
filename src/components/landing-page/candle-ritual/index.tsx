"use client";

import { AnimatePresence } from "motion/react";
import { RitualOverlay } from "./ritual-overlay";

interface CandleRitualProps {
  open: boolean;
  onClose: () => void;
  name?: string;
}

export function CandleRitual({ open, onClose, name }: CandleRitualProps) {
  return (
    <AnimatePresence>
      {open && <RitualOverlay key="ritual" onClose={onClose} name={name} />}
    </AnimatePresence>
  );
}
