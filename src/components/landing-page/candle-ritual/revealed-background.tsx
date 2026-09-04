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
  complete: boolean;
  onDiscover: (text: string) => void;
}

export function RevealedBackground({ complete }: { complete: boolean }) {
  const imageFilter = complete
    ? "grayscale(0.15) brightness(0.92) sepia(0.18)"
    : "grayscale(0.6) brightness(0.5) sepia(0.3)";
  const imageScale = complete ? "scale(1)" : "scale(1.015)";

  return (
    <div className="pointer-events-none absolute inset-0 select-none bg-black">
      <Image
        src="/images/webp/background-vela.webp"
        alt=""
        fill
        sizes="100vw"
        className="object-fill transition-[filter,transform] duration-5000ms ease-out"
        style={{
          filter: imageFilter,
          transform: imageScale,
        }}
      />
      <div
        className="absolute inset-0 bg-black transition-opacity duration-5000ms ease-out"
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
  complete,
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
          complete={complete}
          onDiscover={onDiscover}
        />
      ))}
    </div>
  );
}
