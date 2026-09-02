"use client";

import { motion } from "motion/react";

export function FieldSpinner() {
  return (
    <motion.span
      className="flex shrink-0 items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      role="status"
      aria-label="Buscando endereço"
    >
      <motion.span
        className="block h-4 w-4 rounded-full border-[1.5px] border-[#d9c9a3]/25 border-t-[#d9c9a3]"
        animate={{ rotate: 360 }}
        transition={{
          duration: 0.7,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
    </motion.span>
  );
}
