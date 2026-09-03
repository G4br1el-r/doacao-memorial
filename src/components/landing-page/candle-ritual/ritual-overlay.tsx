"use client";

import { DarknessLayer } from "./darkness-layer";
import { DragHint } from "./drag-hint";
import { DraggableCandle } from "./draggable-candle";
import { candleEndDate } from "./end-date";
import { useCandleLight, useCandlePosition } from "./hooks/use-candle-motion";
import { useDiscovery } from "./hooks/use-discovery";
import { useLightFlicker } from "./hooks/use-light-flicker";
import { usePointerFollow } from "./hooks/use-pointer-follow";
import { useRitualPhase } from "./hooks/use-ritual-phase";
import { InvitationText } from "./invitation-text";
import { RevealedBackground, RevealedWords } from "./revealed-background";
import { RitualMessage } from "./ritual-message";
import { RitualStage } from "./ritual-stage";
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

  const { discover, complete, foundCount } = useDiscovery();

  const flicker = useLightFlicker(free);
  const { mask, halo } = useCandleLight(smoothX, smoothY, flicker);

  /* achadas todas as palavras o ritual se cumpre: a vela some, a escuridao
     se dissolve e a fotografia toma a cena */
  usePointerFollow(free && pinnedToPointer && !byTouch && !complete, x, y);

  function onStageClick(event: React.MouseEvent<HTMLDivElement>) {
    if (!free || byTouch || complete) return;
    if ((event.target as HTMLElement).closest("button")) return;
    setPinnedToPointer((pinned) => !pinned);
  }

  return (
    <RitualStage
      pinnedToPointer={pinnedToPointer && !complete}
      onStageClick={onStageClick}
    >
      <RevealedBackground complete={complete} />
      <DarknessLayer free={free} mask={mask} complete={complete} />
      {free && !complete && <WarmHalo halo={halo} />}
      <RevealedWords
        smoothX={smoothX}
        smoothY={smoothY}
        lit={free}
        onDiscover={discover}
      />

      <InvitationText visible={phase === "convite"} />

      {!complete && (
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
      )}

      <DragHint
        visible={free && !complete}
        byTouch={byTouch}
        foundCount={foundCount}
      />

      <RitualMessage
        visible={complete}
        name={name}
        endDate={candleEndDate()}
        onClose={onClose}
      />
    </RitualStage>
  );
}
