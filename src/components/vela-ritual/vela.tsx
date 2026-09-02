"use client";

import { useId } from "react";
import { cn } from "@/lib/utils/cn";
import { Chama } from "./chama";

/**
 * Vela de cera nua - sem copo, sem suporte.
 *
 * E SVG e nao imagem porque a cera precisa reagir ao fogo em tempo real:
 * quando o pavio pega, a luz atravessa a parafina de dentro para fora, e
 * um PNG nao faz isso. Os ids sao unicos por instancia (useId) para que
 * duas velas na mesma tela nao briguem pelos gradientes.
 */

interface VelaProps {
  acesa?: boolean;
  /* 0 a 1 - a mecha brasa antes de pegar fogo de vez */
  aquecimento?: number;
  className?: string;
}

export function Vela({ acesa = false, aquecimento = 0, className }: VelaProps) {
  const id = useId();
  const cera = `cera-${id}`;
  const ceraLuz = `cera-luz-${id}`;
  const topo = `topo-${id}`;
  const suavizar = `suavizar-${id}`;

  const luz = acesa ? 1 : aquecimento * 0.55;

  return (
    <div className={cn("relative", className)}>
      {/* a chama fica por cima do svg, ancorada no pavio */}
      <div className="pointer-events-none absolute inset-x-0 -top-4 z-20 h-[42%]">
        <Chama ativa={acesa} tamanho={0.7} agitacao={0.3} />
      </div>

      <svg
        viewBox="0 0 120 210"
        fill="none"
        className="relative h-full w-full"
        aria-hidden="true"
      >
        <defs>
          {/* cilindro de cera: a luz bate na frente-esquerda e a borda
              direita cai na sombra - e o sombreado que da volume */}
          <linearGradient id={cera} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#9c855f" />
            <stop offset="12%" stopColor="#dccdaa" />
            <stop offset="34%" stopColor="#fdf6e6" />
            <stop offset="52%" stopColor="#f6ecd6" />
            <stop offset="78%" stopColor="#d8c6a0" />
            <stop offset="100%" stopColor="#8f7a56" />
          </linearGradient>

          {/* a luz do pavio atravessando a parafina, forte no topo */}
          <linearGradient id={ceraLuz} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#ff8a2b" stopOpacity="0" />
            <stop offset="40%" stopColor="#ffab45" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffd89a" stopOpacity="0.9" />
          </linearGradient>

          {/* o poco derretido: escuro e molhado no centro, cera solida
              nas bordas */}
          <radialGradient id={topo} cx="0.46" cy="0.4" r="0.62">
            <stop offset="0%" stopColor="#8a6a3c" />
            <stop offset="48%" stopColor="#cbb389" />
            <stop offset="100%" stopColor="#f4e7cb" />
          </radialGradient>

          <filter id={suavizar} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3.4" />
          </filter>
        </defs>

        {/* ---------- corpo da vela ----------
            as laterais afinam de leve para baixo: cera moldada a mao
            nunca e um retangulo perfeito */}
        <path
          d="M38.5 62 L36 190 Q36 194 40 194 L80 194 Q84 194 84 190 L81.5 62 Z"
          fill={`url(#${cera})`}
        />

        {/* veios verticais da parafina */}
        <g opacity="0.22">
          <path d="M46 68 L44.5 190" stroke="#9c855f" strokeWidth="0.7" />
          <path d="M56 66 L55.5 191" stroke="#b09a72" strokeWidth="0.5" />
          <path d="M68 66 L69 191" stroke="#9c855f" strokeWidth="0.6" />
          <path d="M76 70 L77 189" stroke="#b09a72" strokeWidth="0.45" />
        </g>

        {/* luz atravessando a cera - so quando acende */}
        <path
          d="M38.5 62 L36 190 Q36 194 40 194 L80 194 Q84 194 84 190 L81.5 62 Z"
          fill={`url(#${ceraLuz})`}
          style={{ opacity: luz, transition: "opacity 900ms ease-out" }}
        />

        {/* ---------- escorridos de cera na lateral ----------
            e o detalhe que diferencia uma vela usada de um cilindro */}
        <path
          d="M39.5 64 Q37.6 82 39.4 98 Q41.2 108 43 98 Q44.6 82 43.4 64 Z"
          fill="#fdf6e6"
          opacity="0.9"
        />
        <path
          d="M75.5 64 Q74 88 76 106 Q77.8 118 79.6 106 Q81.4 86 80.4 64 Z"
          fill="#fdf6e6"
          opacity="0.8"
        />
        <path
          d="M57 64 Q56 74 57.4 82 Q58.6 87 59.8 82 Q60.8 74 60 64 Z"
          fill="#fdf6e6"
          opacity="0.6"
        />
        {/* uma gota parada no meio do escorrido */}
        <ellipse
          cx="41.2"
          cy="99"
          rx="2.6"
          ry="3.4"
          fill="#fdf6e6"
          opacity="0.9"
        />
        <ellipse
          cx="77.8"
          cy="107.5"
          rx="2.4"
          ry="3.2"
          fill="#fdf6e6"
          opacity="0.82"
        />

        {/* ---------- topo derretido ---------- */}
        <ellipse cx="60" cy="62" rx="21.6" ry="6.2" fill={`url(#${topo})`} />
        {/* borda alta do poco: a cera sobe em volta do buraco derretido */}
        <ellipse
          cx="60"
          cy="62"
          rx="21.6"
          ry="6.2"
          stroke="#fdf6e6"
          strokeWidth="1.4"
          fill="none"
          opacity="0.75"
        />
        {/* a cera liquida em volta do pavio */}
        <ellipse
          cx="60"
          cy="62.6"
          rx="11"
          ry="3.2"
          fill="#6b4f2a"
          style={{
            opacity: 0.3 + luz * 0.42,
            transition: "opacity 900ms ease-out",
          }}
        />
        {/* o reflexo da chama na poca */}
        <ellipse
          cx="60"
          cy="62"
          rx="15"
          ry="4.6"
          fill="#ffbe6a"
          filter={`url(#${suavizar})`}
          style={{ opacity: luz * 0.8, transition: "opacity 900ms ease-out" }}
        />

        {/* ---------- pavio ---------- */}
        <path
          d="M60 62 Q59.3 55 60.4 49"
          stroke={acesa ? "#3a2a1c" : "#4a3a2a"}
          strokeWidth="2.1"
          strokeLinecap="round"
          fill="none"
        />
        {/* a ponta brasa antes de pegar fogo */}
        <circle
          cx="60.4"
          cy="48.6"
          r="2.4"
          fill="#ff9a3c"
          style={{
            opacity: acesa ? 1 : aquecimento,
            transition: "opacity 320ms ease-out",
          }}
        />

        {/* sombra de contato: sem isso a vela flutua */}
        <ellipse cx="60" cy="195" rx="26" ry="4" fill="#000" opacity="0.55" />
      </svg>
    </div>
  );
}
