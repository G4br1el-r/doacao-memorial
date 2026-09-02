"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Chama procedural em canvas 2D.
 *
 * Optamos por particulas em vez de video/sprite: o movimento nunca repete,
 * o custo e de ~1KB de codigo (contra megabytes de video) e nao ha fundo
 * retangular para disfarcar. WebGL daria o mesmo resultado visual numa
 * chama deste tamanho, mas exigiria fallback para contexto perdido.
 */

interface ChamaProps {
  className?: string;
  /* escala do fogo todo - a vela usa menor que a chama-fonte */
  tamanho?: number;
  /* o quanto a chama balanca de lado, 0 a 1 */
  agitacao?: number;
  /* mata o desenho e economiza bateria quando a chama esta escondida */
  ativa?: boolean;
}

type Particula = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  vida: number;
  vidaMax: number;
  raio: number;
};

/* a chama nasce numa faixa estreita e sobe abrindo - estas constantes
   definem esse cone. valores achados no olho, ajustando ate parecer cera. */
const NASCIMENTO_LARGURA = 3;
const SUBIDA_BASE = 1.15;
const PARTICULAS_POR_FRAME = 3;

export function Chama({
  className,
  tamanho = 1,
  agitacao = 0.35,
  ativa = true,
}: ChamaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /* refs porque o loop de animacao le estes valores a cada frame sem
     poder ser recriado - recriar o loop mataria as particulas vivas */
  const tamanhoRef = useRef(tamanho);
  const agitacaoRef = useRef(agitacao);
  tamanhoRef.current = tamanho;
  agitacaoRef.current = agitacao;

  useEffect(() => {
    if (!ativa) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    /* respeita quem pediu menos movimento no sistema: a chama vira um
       brilho parado em vez de sumir - o simbolo continua la */
    const semMovimento = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    /* limita o DPR: em telas 3x o custo triplica sem ganho visivel num
       borrao de fogo */
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let largura = 0;
    let altura = 0;

    const redimensionar = () => {
      const rect = canvas.getBoundingClientRect();
      largura = rect.width;
      altura = rect.height;
      canvas.width = Math.round(largura * dpr);
      canvas.height = Math.round(altura * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    redimensionar();

    const observer = new ResizeObserver(redimensionar);
    observer.observe(canvas);

    const particulas: Particula[] = [];
    let frame = 0;
    let tempo = 0;
    /* pausa quando a aba sai de foco: sem isso o navegador acumula
       centenas de particulas mortas para processar na volta */
    let pausado = document.hidden;

    function nascer(
      baseX: number,
      baseY: number,
      escala: number,
      sopro: number,
    ) {
      particulas.push({
        x: baseX + (Math.random() - 0.5) * NASCIMENTO_LARGURA * escala,
        y: baseY,
        /* o sopro empurra a chama de lado; o resto e ruido proprio */
        vx: (Math.random() - 0.5) * 0.25 * escala + sopro,
        vy: -(SUBIDA_BASE + Math.random() * 0.7) * escala,
        vida: 0,
        vidaMax: 34 + Math.random() * 26,
        raio: (5 + Math.random() * 5) * escala,
      });
    }

    const desenhar = (ts: number) => {
      if (pausado) return;

      const escala = tamanhoRef.current;
      const baseX = largura / 2;
      /* a chama nasce um pouco acima da borda de baixo, onde estaria o pavio */
      const baseY = altura * 0.82;

      tempo = ts / 1000;

      /* duas senoides de periodos diferentes: o balanco nunca fecha ciclo,
         entao o olho nao percebe repeticao */
      const sopro = semMovimento
        ? 0
        : (Math.sin(tempo * 1.7) * 0.35 + Math.sin(tempo * 0.63) * 0.2) *
          agitacaoRef.current *
          escala;

      ctx.clearRect(0, 0, largura, altura);
      /* soma a luz em vez de cobrir: e o que faz o miolo estourar em branco
         onde muitas particulas se cruzam, como fogo de verdade */
      ctx.globalCompositeOperation = "lighter";

      const nascimentos = semMovimento ? 1 : PARTICULAS_POR_FRAME;
      for (let i = 0; i < nascimentos; i++) nascer(baseX, baseY, escala, sopro);

      for (let i = particulas.length - 1; i >= 0; i--) {
        const p = particulas[i];
        p.vida++;

        if (p.vida >= p.vidaMax) {
          particulas.splice(i, 1);
          continue;
        }

        const t = p.vida / p.vidaMax;

        if (!semMovimento) {
          p.x += p.vx;
          p.y += p.vy;
          /* acelera subindo: o ar quente ganha velocidade, e isso que da
             o formato de lagrima invertida em vez de bola */
          p.vy *= 0.985;
          p.vx +=
            (Math.sin(tempo * 3 + p.y * 0.05) * 0.04 - p.vx * 0.02) * escala;
        }

        /* o corpo encolhe no fim da vida - a chama afina no topo */
        const raio = p.raio * (1 - t * 0.55);
        const opacidade = (1 - t) ** 1.6;

        /* a cor viaja do branco-azulado da base ao laranja e ao vermelho
           que morre - e o gradiente termico real de uma chama */
        let r: number;
        let g: number;
        let b: number;
        if (t < 0.25) {
          r = 255;
          g = 250;
          b = 200 - t * 400;
        } else if (t < 0.6) {
          r = 255;
          g = 220 - (t - 0.25) * 300;
          b = 60;
        } else {
          r = 255 - (t - 0.6) * 180;
          g = 115 - (t - 0.6) * 180;
          b = 40;
        }

        const brilho = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, raio);
        brilho.addColorStop(
          0,
          `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${opacidade * 0.9})`,
        );
        brilho.addColorStop(
          0.5,
          `rgba(${r | 0}, ${(g * 0.7) | 0}, ${(b * 0.5) | 0}, ${opacidade * 0.35})`,
        );
        brilho.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = brilho;
        ctx.beginPath();
        ctx.arc(p.x, p.y, raio, 0, Math.PI * 2);
        ctx.fill();
      }

      /* halo quente ao redor: a luz que a chama joga no ar, desenhada
         por ultimo para somar por cima de tudo */
      const halo = ctx.createRadialGradient(
        baseX + sopro * 2,
        baseY - 18 * escala,
        0,
        baseX,
        baseY - 18 * escala,
        46 * escala,
      );
      halo.addColorStop(0, "rgba(255, 190, 90, 0.30)");
      halo.addColorStop(0.4, "rgba(255, 140, 40, 0.12)");
      halo.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, largura, altura);

      ctx.globalCompositeOperation = "source-over";
      frame = requestAnimationFrame(desenhar);
    };

    /* declarado depois de `desenhar` porque o retoma ao voltar o foco */
    const onVisibility = () => {
      pausado = document.hidden;
      if (!pausado) frame = requestAnimationFrame(desenhar);
    };
    document.addEventListener("visibilitychange", onVisibility);

    if (!pausado) frame = requestAnimationFrame(desenhar);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [ativa]);

  if (!ativa) return null;

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-none h-full w-full", className)}
      /* decoracao pura: sai da ordem de foco antes de ser escondido do
         leitor de tela, senao o foco cairia num elemento invisivel */
      tabIndex={-1}
      aria-hidden="true"
    />
  );
}
