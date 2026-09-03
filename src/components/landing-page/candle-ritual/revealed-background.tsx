"use client";

import type { MotionValue } from "motion/react";
import Image from "next/image";
import { INSCRIPTIONS } from "./constants";
import { useGlowReach, useIsMobileStage } from "./hooks/use-light-flicker";
import { RevealedInscription } from "./revealed-inscription";
import { StoneArches } from "./stone-arches";

interface RevealedWordsProps {
  smoothX: MotionValue<number>;
  smoothY: MotionValue<number>;
  lit: boolean;
  onDiscover: (text: string) => void;
}

export function RevealedBackground({ complete }: { complete: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 select-none">
      <Image
        src="/images/webp/background-vela.webp"
        alt=""
        fill
        sizes="100vw"
        className="object-cover transition-[filter,transform] duration-2400ms ease-out"
        style={{
          filter: complete
            ? "grayscale(0.15) brightness(0.92) sepia(0.18)"
            : "grayscale(0.6) brightness(0.5) sepia(0.3)",
          transform: complete ? "scale(1)" : "scale(1.06)",
        }}
      />
      <div
        className="absolute inset-0 bg-black transition-opacity duration-2400ms ease-out"
        style={{ opacity: complete ? 0.32 : 0.62 }}
      />
      <div
        className="absolute inset-0 transition-opacity duration-1600ms ease-out"
        style={{ opacity: complete ? 0 : 1 }}
      >
        <StoneArches />
      </div>
    </div>
  );
}

export function RevealedWords({
  smoothX,
  smoothY,
  lit,
  onDiscover,
}: RevealedWordsProps) {
  const reach = useGlowReach();
  const mobile = useIsMobileStage();

  return (
    <div className="pointer-events-none absolute inset-0 z-10 select-none">
      {INSCRIPTIONS.map((inscription) => (
        <RevealedInscription
          key={inscription.text}
          inscription={inscription}
          mobile={mobile}
          smoothX={smoothX}
          smoothY={smoothY}
          reach={reach}
          lit={lit}
          onDiscover={onDiscover}
        />
      ))}
    </div>
  );
}
