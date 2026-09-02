"use client";

import { DarknessLayer } from "./darkness-layer";
import { DragHint } from "./drag-hint";
import { DraggableCandle } from "./draggable-candle";
import { candleEndDate } from "./end-date";
import { useCandleLight, useCandlePosition } from "./hooks/use-candle-motion";
import { useLightFlicker } from "./hooks/use-light-flicker";
import { usePointerFollow } from "./hooks/use-pointer-follow";
import { useRitualPhase } from "./hooks/use-ritual-phase";
import { InvitationText } from "./invitation-text";
import { RevealedBackground } from "./revealed-background";
import { RitualMessage } from "./ritual-message";
import { RitualStage } from "./ritual-stage";
import { SourceFlame } from "./source-flame";
import { WarmHalo } from "./warm-halo";

interface RitualOverlayProps {
  onClose: () => void;
  name?: string;
}

export function RitualOverlay({ onClose, name }: RitualOverlayProps) {
  const { x, y, smoothX, smoothY, rotation } = useCandlePosition();
  const { phase, pinnedToPointer, setPinnedToPointer, byTouch, light } =
    useRitualPhase(onClose, x, y);

  const free = phase === "livre";
  const lit = phase === "acendendo" || free;

  const flicker = useLightFlicker(free);
  const { mask, halo } = useCandleLight(smoothX, smoothY, flicker);

  usePointerFollow(free && pinnedToPointer && !byTouch, x, y);

  function onStageClick(event: React.MouseEvent<HTMLDivElement>) {
    if (!free || byTouch) return;
    if ((event.target as HTMLElement).closest("button")) return;
    setPinnedToPointer((pinned) => !pinned);
  }

  return (
    <RitualStage pinnedToPointer={pinnedToPointer} onStageClick={onStageClick}>
      <RevealedBackground />
      <DarknessLayer free={free} mask={mask} />
      {free && <WarmHalo halo={halo} />}

      <SourceFlame visible={phase === "convite" || phase === "acendendo"} />
      <InvitationText visible={phase === "convite"} />

      <DraggableCandle
        phase={phase}
        lit={lit}
        byTouch={byTouch}
        pinnedToPointer={pinnedToPointer}
        x={smoothX}
        y={smoothY}
        rotation={rotation}
        onLight={light}
      />

      <DragHint visible={free} byTouch={byTouch} />

      <RitualMessage
        visible={free}
        name={name}
        endDate={candleEndDate()}
        onClose={onClose}
      />
    </RitualStage>
  );
}
