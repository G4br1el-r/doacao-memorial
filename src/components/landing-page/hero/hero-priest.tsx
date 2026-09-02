"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { SMOOTH } from "@/lib/animation/easing";

const MotionImage = motion.create(Image);

export function HeroPriest() {
  return (
    <MotionImage
      src="/padre.png"
      alt="Padre"
      width={1159}
      height={1358}
      priority
      sizes="(min-width: 1280px) 60vw, 100vw"
      className="absolute bottom-0 left-1/2 z-10 h-auto w-[clamp(19rem,78vw,42rem)] max-h-[74dvh] max-w-none -translate-x-1/2 object-contain object-bottom xl:h-[85dvh] xl:max-h-none xl:w-auto"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.8, delay: 0.3, ease: SMOOTH }}
    />
  );
}
