"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils/cn";
import { useFlameCanvas } from "./use-flame-canvas";

interface FlameProps {
  className?: string;
  size?: number;
  sway?: number;
  active?: boolean;
}

export function Flame({
  className,
  size = 1,
  sway = 0.35,
  active = true,
}: FlameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sizeRef = useRef(size);
  const swayRef = useRef(sway);
  sizeRef.current = size;
  swayRef.current = sway;

  useFlameCanvas(canvasRef, active, sizeRef, swayRef);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-none h-full w-full", className)}
      tabIndex={-1}
      aria-hidden="true"
    />
  );
}
