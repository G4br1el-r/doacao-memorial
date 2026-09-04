"use client";

import type { MotionValue } from "motion/react";
import { useEffect } from "react";
import { useWordGlow } from "./hooks/use-word-glow";
import type { Inscription } from "./types";

interface RevealedInscriptionProps {
  inscription: Inscription;
  smoothX: MotionValue<number>;
  smoothY: MotionValue<number>;
  reach: number;
  lit: boolean;
  mobile: boolean;
  complete: boolean;
  onDiscover: (text: string) => void;
}

const CORE_SHADOW = [
  "0 0 5px rgba(255,255,255,0.95)",
  "0 0 14px rgba(255,240,200,0.9)",
  "0 0 34px rgba(255,200,105,0.8)",
].join(", ");

export function RevealedInscription({
  inscription,
  smoothX,
  smoothY,
  reach,
  lit,
  mobile,
  complete,
  onDiscover,
}: RevealedInscriptionProps) {
  const x = mobile ? inscription.mobileX : inscription.x;
  const y = mobile ? inscription.mobileY : inscription.y;

  const { near, discovered } = useWordGlow(smoothX, smoothY, x, y, reach, lit);

  const glow = discovered ? 1 : near;
  const on = glow > 0.04 && !complete;

  useEffect(() => {
    if (discovered) onDiscover(inscription.text);
  }, [discovered, onDiscover, inscription.text]);

  return (
    <span
      className={`absolute grid max-w-[92vw] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-serif tracking-[0.2em] ${inscription.size}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        opacity: on ? Math.max(glow, 0.35) : 0,
        transition: complete
          ? "opacity 1400ms ease-out"
          : "opacity 420ms ease-out",
        willChange: on ? "opacity" : undefined,
      }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none col-start-1 row-start-1 select-none text-[#ffa844]"
        style={{ filter: "blur(20px)" }}
      >
        {inscription.text}
      </span>

      <span
        className="col-start-1 row-start-1 text-[#fffdf6]"
        style={{ textShadow: CORE_SHADOW }}
      >
        {inscription.text}
      </span>
    </span>
  );
}
