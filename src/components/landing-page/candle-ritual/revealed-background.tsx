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

/* a fotografia e a arquitetura ficam atras da escuridao. enquanto o ritual
   corre so aparecem no facho da vela; ao fim, quando a escuridao se dissolve,
   a foto assume a cena inteira */
export function RevealedBackground({ complete }: { complete: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 select-none">
      {/* a foto e paisagem (1672x941): num celular em pe o object-cover
          cortaria 75% da largura e sobraria so a faixa central. o contain
          mostra a cena inteira, e a partir de sm o cover volta porque ali a
          tela ja e larga o bastante pra nao perder quase nada */}
      <Image
        src="/images/webp/background-vela.webp"
        alt=""
        fill
        sizes="100vw"
        className="object-contain transition-[filter,transform] duration-[2400ms] ease-out sm:object-cover"
        style={{
          filter: complete
            ? "grayscale(0.15) brightness(0.92) sepia(0.18)"
            : "grayscale(0.6) brightness(0.5) sepia(0.3)",
          transform: complete ? "scale(1)" : "scale(1.03)",
        }}
      />
      <div
        className="absolute inset-0 bg-black transition-opacity duration-[2400ms] ease-out"
        style={{ opacity: complete ? 0.32 : 0.62 }}
      />
      {/* a arquitetura desenhada acompanha o ritual e sai de cena quando a
          fotografia assume: as duas juntas competiriam pelo olhar */}
      <div
        className="absolute inset-0 transition-opacity duration-[1600ms] ease-out"
        style={{ opacity: complete ? 0 : 1 }}
      >
        <StoneArches />
      </div>
    </div>
  );
}

/* as palavras ficam ACIMA da escuridao: enquanto escondidas nao aparecem,
   e ao serem descobertas estouram de luz sem nada por cima abafando */
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
    /* cumprido o ritual as palavras recuam: quem fica em cena e a fotografia */
    <div
      className="pointer-events-none absolute inset-0 z-10 select-none transition-opacity duration-[2000ms] ease-out"
      style={{ opacity: complete ? 0.22 : 1 }}
    >
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
