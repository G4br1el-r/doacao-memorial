"use client";

import { motion } from "motion/react";
import {
  MASK_HEIGHT,
  MASK_TOP,
  SIGNATURE_STROKES,
  STROKE_DURATION,
} from "./constants";
import { strokeStartTimes } from "./stroke-timings";

interface SignatureMaskProps {
  id: string;
  delay: number;
}

export function SignatureMask({ id, delay }: SignatureMaskProps) {
  const startTimes = strokeStartTimes(delay);

  return (
    <mask id={id} maskUnits="userSpaceOnUse">
      {SIGNATURE_STROKES.map((stroke, index) => (
        <motion.rect
          key={`${stroke.x0}-${stroke.x1}`}
          x={stroke.x0}
          y={MASK_TOP}
          height={MASK_HEIGHT}
          fill="#fff"
          initial={{ width: 0 }}
          animate={{ width: stroke.x1 - stroke.x0 + 1 }}
          transition={{
            duration: STROKE_DURATION,
            delay: startTimes[index],
            ease: "linear",
          }}
        />
      ))}
    </mask>
  );
}
