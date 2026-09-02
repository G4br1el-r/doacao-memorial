"use client";

import { motion } from "motion/react";
import { CARD_ITEM_VARIANTS } from "./card-variants";

interface CardSectionProps {
  className?: string;
  children: React.ReactNode;
}

export function CardSection({ className, children }: CardSectionProps) {
  return (
    <motion.div className={className} variants={CARD_ITEM_VARIANTS}>
      {children}
    </motion.div>
  );
}
