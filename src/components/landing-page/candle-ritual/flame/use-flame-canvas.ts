"use client";

import { type RefObject, useEffect } from "react";
import { MAX_DEVICE_PIXEL_RATIO, PARTICLES_PER_FRAME } from "./constants";
import { drawHalo, drawParticle } from "./draw";
import { advanceParticle, spawnParticle } from "./particle";
import type { Particle } from "./types";

export function useFlameCanvas(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  active: boolean,
  scaleRef: RefObject<number>,
  swayRef: RefObject<number>,
) {
  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const stillness = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO);
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const particles: Particle[] = [];
    let frame = 0;
    let time = 0;
    let paused = document.hidden;

    const draw = (timestamp: number) => {
      if (paused) return;

      const scale = scaleRef.current;
      const baseX = width / 2;
      const baseY = height * 0.82;

      time = timestamp / 1000;

      const draft = stillness
        ? 0
        : (Math.sin(time * 1.7) * 0.35 + Math.sin(time * 0.63) * 0.2) *
          swayRef.current *
          scale;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      const births = stillness ? 1 : PARTICLES_PER_FRAME;
      for (let i = 0; i < births; i++) {
        particles.push(spawnParticle(baseX, baseY, scale, draft));
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.life++;

        if (particle.life >= particle.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        const lifeRatio = particle.life / particle.maxLife;
        if (!stillness) advanceParticle(particle, time, scale);
        drawParticle(ctx, particle, lifeRatio);
      }

      drawHalo(ctx, baseX, baseY, scale, draft, width, height);

      ctx.globalCompositeOperation = "source-over";
      frame = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      paused = document.hidden;
      if (!paused) frame = requestAnimationFrame(draw);
    };
    document.addEventListener("visibilitychange", onVisibility);

    if (!paused) frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [active, canvasRef, scaleRef, swayRef]);
}
