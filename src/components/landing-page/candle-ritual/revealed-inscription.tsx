import type { Inscription } from "./types";

interface RevealedInscriptionProps {
  inscription: Inscription;
}

export function RevealedInscription({ inscription }: RevealedInscriptionProps) {
  return (
    <span
      className={`absolute max-w-[92vw] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-serif tracking-[0.2em] text-[#d9c9a3] ${inscription.size}`}
      style={{
        left: `${inscription.x}%`,
        top: `${inscription.y}%`,
        opacity: 0.16 + inscription.depth * 0.5,
      }}
    >
      {inscription.text}
    </span>
  );
}
