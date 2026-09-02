import { CANDLE_BODY_PATH, LIGHT_TRANSITION } from "./constants";

interface CandleBodyProps {
  waxId: string;
  waxLightId: string;
  light: number;
}

export function CandleBody({ waxId, waxLightId, light }: CandleBodyProps) {
  return (
    <>
      <path d={CANDLE_BODY_PATH} fill={`url(#${waxId})`} />

      <g opacity="0.22">
        <path d="M46 68 L44.5 190" stroke="#9c855f" strokeWidth="0.7" />
        <path d="M56 66 L55.5 191" stroke="#b09a72" strokeWidth="0.5" />
        <path d="M68 66 L69 191" stroke="#9c855f" strokeWidth="0.6" />
        <path d="M76 70 L77 189" stroke="#b09a72" strokeWidth="0.45" />
      </g>

      <path
        d={CANDLE_BODY_PATH}
        fill={`url(#${waxLightId})`}
        style={{ opacity: light, transition: LIGHT_TRANSITION }}
      />
    </>
  );
}
