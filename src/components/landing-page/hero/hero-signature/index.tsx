"use client";

import { motion } from "motion/react";
import { SIGNATURE_LABEL, SIGNATURE_VIEWBOX } from "./constants";
import { SignatureGradient } from "./signature-gradient";
import { SignatureMask } from "./signature-mask";
import { SIGNATURE_GLOW_PATH, SIGNATURE_SHAPE_PATH } from "./signature-paths";

const GRADIENT_ID = "assinatura-gold";
const MASK_ID = "assinatura-caneta";

interface SignatureProps {
  className?: string;
  delay?: number;
}

export function Signature({ className, delay = 1.9 }: SignatureProps) {
  return (
    <motion.svg
      viewBox={SIGNATURE_VIEWBOX}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={SIGNATURE_LABEL}
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      <defs>
        <SignatureGradient id={GRADIENT_ID} />
        <SignatureMask id={MASK_ID} delay={delay} />
      </defs>

      <g fillRule="evenodd" clipRule="evenodd" mask={`url(#${MASK_ID})`}>
        <path d={SIGNATURE_GLOW_PATH} fill="#D6A14B" opacity={0.35} />
        <path d={SIGNATURE_SHAPE_PATH} fill={`url(#${GRADIENT_ID})`} />
      </g>
    </motion.svg>
  );
}
