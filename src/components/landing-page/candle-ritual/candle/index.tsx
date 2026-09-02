"use client";

import { useId } from "react";
import { cn } from "@/lib/utils/cn";
import { Flame } from "../flame";
import { CandleBody } from "./candle-body";
import { CandleDrips } from "./candle-drips";
import { CandleGradients } from "./candle-gradients";
import { CandleTop } from "./candle-top";
import { CandleWick } from "./candle-wick";

interface CandleProps {
  lit?: boolean;
  warmth?: number;
  className?: string;
}

export function Candle({ lit = false, warmth = 0, className }: CandleProps) {
  const id = useId();
  const waxId = `cera-${id}`;
  const waxLightId = `cera-luz-${id}`;
  const topId = `topo-${id}`;
  const blurId = `suavizar-${id}`;

  const light = lit ? 1 : warmth * 0.55;

  return (
    <div className={cn("relative", className)}>
      <div className="pointer-events-none absolute inset-x-0 -top-4 z-20 h-[42%]">
        <Flame active={lit} size={0.7} sway={0.3} />
      </div>

      <svg
        viewBox="0 0 120 210"
        fill="none"
        className="relative h-full w-full"
        aria-hidden="true"
      >
        <CandleGradients
          waxId={waxId}
          waxLightId={waxLightId}
          topId={topId}
          blurId={blurId}
        />
        <CandleBody waxId={waxId} waxLightId={waxLightId} light={light} />
        <CandleDrips />
        <CandleTop topId={topId} blurId={blurId} light={light} />
        <CandleWick lit={lit} warmth={warmth} />
        <ellipse cx="60" cy="195" rx="26" ry="4" fill="#000" opacity="0.55" />
      </svg>
    </div>
  );
}
