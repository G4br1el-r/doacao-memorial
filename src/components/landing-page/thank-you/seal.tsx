"use client";

import { motion } from "motion/react";
import { SMOOTH } from "@/lib/animation/easing";
import { SealCore } from "./seal-core";
import { SealSpinner } from "./seal-spinner";

interface SealProps {
  confirmed: boolean;
}

export function Seal({ confirmed }: SealProps) {
  return (
    <div className="relative flex h-28 w-28 items-center justify-center">
      <SealSpinner confirmed={confirmed} />
      <SealCore confirmed={confirmed} />
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(217,201,163,0.22), transparent 68%)",
        }}
        animate={{
          opacity: confirmed ? 1 : 0.35,
          scale: confirmed ? 1.3 : 1,
        }}
        transition={{ duration: 1.2, ease: SMOOTH }}
      />
    </div>
  );
}
