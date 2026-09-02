"use client";

import { useInView } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { HERO_BACKGROUND_VIDEO_LEGACY_INLINE_ATTRS } from "@/lib/utils/constants";

interface BackgroundVideoProps {
  sources?: { src: string; type: string }[];
  className?: string;
  playOnInView?: boolean;
  poster?: string;
}

const DEFAULT_SOURCES = [{ src: "/background-video.mp4", type: "video/mp4" }];

export function BackgroundVideo({
  sources = DEFAULT_SOURCES,
  className,
  playOnInView = false,
  poster,
}: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);
  const isInView = useInView(videoRef, { once: true, amount: 0.5 });
  const shouldPlay = !playOnInView || isInView;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldPlay) return;

    video.muted = true;
    video.defaultMuted = true;

    const tryPlay = () => {
      const attempt = video.play();
      if (attempt) {
        attempt.catch(() => {});
      }
    };

    video.load();
    tryPlay();

    const onCanPlay = () => {
      setIsReady(true);
      tryPlay();
    };
    video.addEventListener("canplay", onCanPlay);

    if (video.readyState >= video.HAVE_CURRENT_DATA) setIsReady(true);

    const onVisibility = () => {
      if (!document.hidden) tryPlay();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onFirstInteraction = () => tryPlay();
    document.addEventListener("touchstart", onFirstInteraction, { once: true });
    document.addEventListener("click", onFirstInteraction, { once: true });

    return () => {
      video.removeEventListener("canplay", onCanPlay);
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("touchstart", onFirstInteraction);
      document.removeEventListener("click", onFirstInteraction);
    };
  }, [shouldPlay]);

  /**
   * Loop "boomerang": o video vai ate o fim e volta de tras para frente,
   * sem cortes secos no reinicio.
   *
   * Nao da para usar playbackRate negativo (os navegadores nao suportam),
   * entao a volta e feita no braco: pausamos o video e avancamos o
   * currentTime para tras a cada frame, no ritmo do tempo real decorrido.
   */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldPlay) return;

    let frame = 0;
    let ultimoTs = 0;
    let voltando = false;

    const pararVolta = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      voltando = false;
    };

    // rebobina manualmente, respeitando o tempo real entre os frames
    const rebobinar = (ts: number) => {
      if (!ultimoTs) ultimoTs = ts;
      const delta = (ts - ultimoTs) / 1000;
      ultimoTs = ts;

      const proximo = video.currentTime - delta;

      if (proximo <= 0) {
        // chegou no comeco: volta a tocar para a frente
        video.currentTime = 0;
        pararVolta();
        video.play().catch(() => {});
        return;
      }

      video.currentTime = proximo;
      frame = requestAnimationFrame(rebobinar);
    };

    // ao chegar no fim, inverte o sentido em vez de reiniciar
    const onTimeUpdate = () => {
      if (voltando || !video.duration) return;

      // 'timeupdate' dispara a cada ~250ms: a margem precisa ser maior que
      // esse intervalo, senao o fim passa batido e o video corta no 'ended'
      if (video.currentTime >= video.duration - 0.3) {
        voltando = true;
        ultimoTs = 0;
        video.pause();
        frame = requestAnimationFrame(rebobinar);
      }
    };

    // se o 'ended' escapar, garante a inversao mesmo assim
    const onEnded = () => {
      if (voltando) return;
      voltando = true;
      ultimoTs = 0;
      video.currentTime = video.duration;
      frame = requestAnimationFrame(rebobinar);
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("ended", onEnded);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("ended", onEnded);
      pararVolta();
    };
  }, [shouldPlay]);

  return (
    <>
      {poster && (
        <Image
          src={poster}
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className={cn(
            "absolute inset-0 h-full w-full object-cover",
            className,
          )}
        />
      )}
      <video
        ref={videoRef}
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out",
          isReady ? "opacity-100" : "opacity-0",
          className,
        )}
        autoPlay={!playOnInView}
        muted
        playsInline
        {...HERO_BACKGROUND_VIDEO_LEGACY_INLINE_ATTRS}
        preload={poster ? "metadata" : "none"}
        disablePictureInPicture
        disableRemotePlayback
        controls={false}
        tabIndex={-1}
        aria-hidden="true"
      >
        {sources.map(({ src, type }) => (
          <source key={src} src={src} type={type} />
        ))}
      </video>
    </>
  );
}
