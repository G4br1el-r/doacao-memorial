"use client";

import { type MotionValue, useMotionValueEvent } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { WICK_OFFSET } from "../constants";

/* a chama descobre a palavra: enquanto passa por cima ela acende, e depois
   fica consagrada - nao apaga mais.

   a intensidade e arredondada em degraus e so vira estado quando muda de
   degrau. sem isso, cada pixel de movimento do mouse re-renderizaria as seis
   palavras, que e o que fazia o ritual travar */
const STEPS = 6;

export function useWordGlow(
  smoothX: MotionValue<number>,
  smoothY: MotionValue<number>,
  xPercent: number,
  yPercent: number,
  reach: number,
  enabled: boolean,
) {
  const [near, setNear] = useState(0);
  const [discovered, setDiscovered] = useState(false);
  const raf = useRef(0);
  const pending = useRef(false);

  const measure = useCallback(() => {
    pending.current = false;
    /* uma vez consagrada a palavra nao muda mais: nao ha o que medir */
    if (!enabled || discovered) return;

    const flameX = window.innerWidth / 2 + smoothX.get();
    const flameY = window.innerHeight / 2 + smoothY.get() - WICK_OFFSET;
    const wordX = (window.innerWidth * xPercent) / 100;
    const wordY = (window.innerHeight * yPercent) / 100;

    const distance = Math.hypot(flameX - wordX, flameY - wordY);
    const raw = Math.max(0, 1 - distance / reach);
    const stepped = Math.round(raw * STEPS) / STEPS;

    if (raw > 0.35) setDiscovered(true);
    setNear((current) => (current === stepped ? current : stepped));
  }, [smoothX, smoothY, xPercent, yPercent, reach, enabled, discovered]);

  const schedule = useCallback(() => {
    /* uma medicao por quadro, no maximo */
    if (pending.current) return;
    pending.current = true;
    raf.current = requestAnimationFrame(measure);
  }, [measure]);

  useMotionValueEvent(smoothX, "change", schedule);
  useMotionValueEvent(smoothY, "change", schedule);

  useEffect(() => {
    if (!enabled) {
      setNear(0);
      setDiscovered(false);
      return;
    }
    measure();
    return () => {
      cancelAnimationFrame(raf.current);
      pending.current = false;
    };
  }, [enabled, measure]);

  /* depois de descoberta a palavra nao muda mais: para de medir */
  return { near: discovered ? 1 : near, discovered };
}
