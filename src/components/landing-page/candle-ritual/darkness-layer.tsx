"use client";

import { type MotionValue, motion } from "motion/react";
import { SMOOTH } from "@/lib/animation/easing";

interface DarknessLayerProps {
  free: boolean;
  mask: MotionValue<string>;
  complete: boolean;
}

export function DarknessLayer({ free, mask, complete }: DarknessLayerProps) {
  return (
    <motion.div
      className="absolute inset-0 bg-black"
      style={{
        /* com o ritual cumprido a mascara sai de cena: sem recorte, a camada
           inteira desaparece junto e a fotografia fica exposta */
        maskImage: free && !complete ? mask : undefined,
        WebkitMaskImage: free && !complete ? mask : undefined,
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: complete ? 0 : free ? 0.94 : 1 }}
      transition={{ duration: complete ? 2.4 : 1.6, ease: SMOOTH }}
    />
  );
}
