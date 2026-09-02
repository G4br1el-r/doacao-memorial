import { EMBER_TRANSITION } from "./constants";

interface CandleWickProps {
  lit: boolean;
  warmth: number;
}

export function CandleWick({ lit, warmth }: CandleWickProps) {
  return (
    <>
      <path
        d="M60 62 Q59.3 55 60.4 49"
        stroke={lit ? "#3a2a1c" : "#4a3a2a"}
        strokeWidth="2.1"
        strokeLinecap="round"
        fill="none"
      />
      <circle
        cx="60.4"
        cy="48.6"
        r="2.4"
        fill="#ff9a3c"
        style={{
          opacity: lit ? 1 : warmth,
          transition: EMBER_TRANSITION,
        }}
      />
    </>
  );
}
