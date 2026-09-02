"use client";

import { type MotionValue, motion } from "motion/react";
import { SMOOTH } from "@/lib/animation/easing";
import { cn } from "@/lib/utils/cn";
import { Candle } from "./candle";
import { CandlePulse } from "./candle-pulse";
import type { RitualPhase } from "./types";

interface DraggableCandleProps {
  phase: RitualPhase;
  lit: boolean;
  byTouch: boolean;
  pinnedToPointer: boolean;
  x: MotionValue<number>;
  y: MotionValue<number>;
  rotation: MotionValue<number>;
  onLight: (byTouch: boolean) => void;
}

export function DraggableCandle({
  phase,
  lit,
  byTouch,
  pinnedToPointer,
  x,
  y,
  rotation,
  onLight,
}: DraggableCandleProps) {
  const free = phase === "livre";

  return (
    <motion.div
      className="absolute left-1/2 z-20 h-56 w-32 touch-none sm:h-64 sm:w-36"
      style={{
        x,
        y,
        rotate: rotation,
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{
        top: phase === "convite" ? "70%" : "52%",
        scale: lit ? 1.05 : 1,
        opacity: phase === "escurecendo" ? 0 : 1,
      }}
      initial={{ top: "70%", opacity: 0 }}
      transition={{
        duration: 1.9,
        ease: SMOOTH,
        opacity: { duration: 0.9, ease: SMOOTH },
      }}
      drag={free && byTouch}
      dragMomentum={false}
      dragElastic={0.08}
      onTap={(event) => {
        const pointerType = (event as PointerEvent).pointerType;
        const tappedByTouch = pointerType === "touch" || pointerType === "pen";
        if (phase === "convite") onLight(tappedByTouch);
      }}
      whileDrag={{ cursor: "grabbing" }}
    >
      {phase === "convite" && <CandlePulse />}

      <Candle
        lit={lit}
        className={cn(
          "h-full w-full",
          phase === "convite" && "cursor-pointer",
          free && pinnedToPointer && "cursor-none",
          free && !pinnedToPointer && "cursor-pointer",
        )}
      />
    </motion.div>
  );
}
