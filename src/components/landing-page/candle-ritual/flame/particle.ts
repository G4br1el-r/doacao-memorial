import { BASE_RISE, BIRTH_WIDTH } from "./constants";
import type { Particle } from "./types";

export function spawnParticle(
  baseX: number,
  baseY: number,
  scale: number,
  draft: number,
): Particle {
  return {
    x: baseX + (Math.random() - 0.5) * BIRTH_WIDTH * scale,
    y: baseY,
    vx: (Math.random() - 0.5) * 0.25 * scale + draft,
    vy: -(BASE_RISE + Math.random() * 0.7) * scale,
    life: 0,
    maxLife: 34 + Math.random() * 26,
    radius: (5 + Math.random() * 5) * scale,
  };
}

export function advanceParticle(
  particle: Particle,
  time: number,
  scale: number,
) {
  particle.x += particle.vx;
  particle.y += particle.vy;
  particle.vy *= 0.985;
  particle.vx +=
    (Math.sin(time * 3 + particle.y * 0.05) * 0.04 - particle.vx * 0.02) *
    scale;
}

export function particleColor(lifeRatio: number) {
  if (lifeRatio < 0.25) {
    return { r: 255, g: 250, b: 200 - lifeRatio * 400 };
  }
  if (lifeRatio < 0.6) {
    return { r: 255, g: 220 - (lifeRatio - 0.25) * 300, b: 60 };
  }
  return {
    r: 255 - (lifeRatio - 0.6) * 180,
    g: 115 - (lifeRatio - 0.6) * 180,
    b: 40,
  };
}
