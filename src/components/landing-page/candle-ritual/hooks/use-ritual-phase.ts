"use client";

import type { MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { DARKENING_MS, LIGHTING_MS } from "../constants";
import type { RitualPhase } from "../types";

export function useRitualPhase(
  onClose: () => void,
  x: MotionValue<number>,
  y: MotionValue<number>,
) {
  const [phase, setPhase] = useState<RitualPhase>("fechado");
  const [pinnedToPointer, setPinnedToPointer] = useState(false);
  const [byTouch, setByTouch] = useState(false);

  useEffect(() => {
    x.set(0);
    y.set(0);
    setPhase("escurecendo");
    const timer = setTimeout(() => setPhase("convite"), DARKENING_MS);
    return () => clearTimeout(timer);
  }, [x, y]);

  function light(tappedByTouch: boolean) {
    if (phase !== "convite") return;
    setByTouch(tappedByTouch);
    setPhase("acendendo");
    if (!tappedByTouch) setPinnedToPointer(true);
    setTimeout(() => setPhase("livre"), LIGHTING_MS);
  }

  const lightRef = useRef(light);
  lightRef.current = light;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if ((event.key === "Enter" || event.key === " ") && phase === "convite") {
        event.preventDefault();
        lightRef.current(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, phase]);

  return { phase, pinnedToPointer, setPinnedToPointer, byTouch, light };
}
