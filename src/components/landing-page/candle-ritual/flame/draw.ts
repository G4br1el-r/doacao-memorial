import { particleColor } from "./particle";
import type { Particle } from "./types";

export function drawParticle(
  ctx: CanvasRenderingContext2D,
  particle: Particle,
  lifeRatio: number,
) {
  const radius = particle.radius * (1 - lifeRatio * 0.55);
  const alpha = (1 - lifeRatio) ** 1.6;
  const { r, g, b } = particleColor(lifeRatio);

  const glow = ctx.createRadialGradient(
    particle.x,
    particle.y,
    0,
    particle.x,
    particle.y,
    radius,
  );
  glow.addColorStop(0, `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${alpha * 0.9})`);
  glow.addColorStop(
    0.5,
    `rgba(${r | 0}, ${(g * 0.7) | 0}, ${(b * 0.5) | 0}, ${alpha * 0.35})`,
  );
  glow.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
  ctx.fill();
}

export function drawHalo(
  ctx: CanvasRenderingContext2D,
  baseX: number,
  baseY: number,
  scale: number,
  draft: number,
  width: number,
  height: number,
) {
  const halo = ctx.createRadialGradient(
    baseX + draft * 2,
    baseY - 18 * scale,
    0,
    baseX,
    baseY - 18 * scale,
    46 * scale,
  );
  halo.addColorStop(0, "rgba(255, 190, 90, 0.30)");
  halo.addColorStop(0.4, "rgba(255, 140, 40, 0.12)");
  halo.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, width, height);
}
