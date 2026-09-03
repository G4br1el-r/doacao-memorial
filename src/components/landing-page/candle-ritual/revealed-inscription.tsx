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
  onDiscover: (text: string) => void;
}

/* tres camadas curtas em vez de seis longas. o raio maximo caiu de 240px pra
   42px: o navegador repinta uma area muito menor, e o halo largo fica por
   conta de uma copia borrada, que a gpu compoe sem repintar */
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
  onDiscover,
}: RevealedInscriptionProps) {
  const { near, discovered } = useWordGlow(
    smoothX,
    smoothY,
    inscription.x,
    inscription.y,
    reach,
    lit,
  );

  /* antes de a chama chegar a palavra fica invisivel: quem revela e a luz.
     depois de descoberta ela estoura e nao apaga mais */
  const glow = discovered ? 1 : near;
  const on = glow > 0.04;

  useEffect(() => {
    if (discovered) onDiscover(inscription.text);
  }, [discovered, onDiscover, inscription.text]);

  return (
    <span
      className={`absolute grid max-w-[92vw] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-serif tracking-[0.2em] ${inscription.size}`}
      style={{
        left: `${inscription.x}%`,
        top: `${inscription.y}%`,
        opacity: on ? Math.max(glow, 0.35) : 0,
        /* so a opacidade transiciona: o compositor resolve sem repintar.
           nada de contain aqui: ele recortaria o blur na caixa do texto e
           deixaria uma moldura retangular visivel em volta da palavra */
        transition: "opacity 420ms ease-out",
        willChange: on ? "opacity" : undefined,
      }}
    >
      {/* halo largo: copia borrada do texto, sem translateZ - a camada de
          composicao propria recortaria o blur e deixaria uma moldura */}
      <span
        aria-hidden="true"
        className="pointer-events-none col-start-1 row-start-1 select-none text-[#ffa844]"
        style={{ filter: "blur(20px)" }}
      >
        {inscription.text}
      </span>

      {/* nucleo nitido, com sombras de raio curto */}
      <span
        className="col-start-1 row-start-1 text-[#fffdf6]"
        style={{ textShadow: CORE_SHADOW }}
      >
        {inscription.text}
      </span>
    </span>
  );
}
