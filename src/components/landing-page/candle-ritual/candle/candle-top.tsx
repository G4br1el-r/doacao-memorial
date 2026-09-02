import { LIGHT_TRANSITION } from "./constants";

interface CandleTopProps {
  topId: string;
  blurId: string;
  light: number;
}

export function CandleTop({ topId, blurId, light }: CandleTopProps) {
  return (
    <>
      <ellipse cx="60" cy="62" rx="21.6" ry="6.2" fill={`url(#${topId})`} />
      <ellipse
        cx="60"
        cy="62"
        rx="21.6"
        ry="6.2"
        stroke="#fdf6e6"
        strokeWidth="1.4"
        fill="none"
        opacity="0.75"
      />
      <ellipse
        cx="60"
        cy="62.6"
        rx="11"
        ry="3.2"
        fill="#6b4f2a"
        style={{
          opacity: 0.3 + light * 0.42,
          transition: LIGHT_TRANSITION,
        }}
      />
      <ellipse
        cx="60"
        cy="62"
        rx="15"
        ry="4.6"
        fill="#ffbe6a"
        filter={`url(#${blurId})`}
        style={{ opacity: light * 0.8, transition: LIGHT_TRANSITION }}
      />
    </>
  );
}
