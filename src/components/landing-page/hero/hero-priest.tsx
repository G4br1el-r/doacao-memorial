"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { SMOOTH } from "@/lib/animation/easing";

const MotionImage = motion.create(Image);

export function HeroPriest() {
  return (
    <MotionImage
      src="/images/webp/padre.webp"
      alt="Padre"
      width={1024}
      height={1536}
      priority
      sizes="(min-width: 1280px) 60vw, 100vw"
      className="absolute bottom-0 left-1/2 z-10 h-[clamp(34rem,30vw+74dvh,52rem)] max-[359px]:max-h-[91dvh] w-auto max-w-[120%] -translate-x-1/2 object-contain object-bottom xl:bottom-[-30dvh] xl:h-[130dvh] xl:w-auto"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.8, delay: 0.3, ease: SMOOTH }}
    />
  );
}
