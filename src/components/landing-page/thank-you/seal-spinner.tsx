"use client";

import { motion } from "motion/react";
import { SMOOTH } from "@/lib/animation/easing";

interface SealSpinnerProps {
  confirmed: boolean;
}

export function SealSpinner({ confirmed }: SealSpinnerProps) {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
      <title>{confirmed ? "Doação confirmada" : "Processando"}</title>
      <motion.circle
        cx="50"
        cy="50"
        r="44"
        fill="none"
        stroke="#d9c9a3"
        strokeWidth="2.5"
        animate={{ strokeOpacity: confirmed ? 0 : 0.16 }}
        transition={{ duration: 0.3, delay: confirmed ? 0.5 : 0 }}
      />
      <motion.circle
        cx="50"
        cy="50"
        r="44"
        fill="none"
        stroke="#d9c9a3"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="70 210"
        animate={{
          rotate: confirmed ? 360 : [0, 360],
          opacity: confirmed ? 0 : 1,
        }}
        transition={{
          rotate: confirmed
            ? { duration: 0.6, ease: SMOOTH }
            : {
                duration: 1.15,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              },
          opacity: { duration: 0.25 },
        }}
        style={{ transformOrigin: "50% 50%" }}
      />
      <motion.circle
        cx="50"
        cy="50"
        r="44"
        fill="none"
        stroke="#e8dcc0"
        strokeWidth="2.5"
        strokeLinecap="round"
        pathLength={1}
        initial={{ pathLength: 0 }}
        animate={{
          pathLength: confirmed ? 1 : 0,
          opacity: confirmed ? 0 : 1,
        }}
        transition={{
          pathLength: { duration: 0.55, ease: SMOOTH },
          opacity: { duration: 0.3, delay: 0.5 },
        }}
        style={{ transformOrigin: "50% 50%", rotate: -90 }}
      />
    </svg>
  );
}
