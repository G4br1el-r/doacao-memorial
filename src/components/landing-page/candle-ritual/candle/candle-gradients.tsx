interface CandleGradientsProps {
  waxId: string;
  waxLightId: string;
  topId: string;
  blurId: string;
}

export function CandleGradients({
  waxId,
  waxLightId,
  topId,
  blurId,
}: CandleGradientsProps) {
  return (
    <defs>
      <linearGradient id={waxId} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#9c855f" />
        <stop offset="12%" stopColor="#dccdaa" />
        <stop offset="34%" stopColor="#fdf6e6" />
        <stop offset="52%" stopColor="#f6ecd6" />
        <stop offset="78%" stopColor="#d8c6a0" />
        <stop offset="100%" stopColor="#8f7a56" />
      </linearGradient>

      <linearGradient id={waxLightId} x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor="#ff8a2b" stopOpacity="0" />
        <stop offset="40%" stopColor="#ffab45" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#ffd89a" stopOpacity="0.9" />
      </linearGradient>

      <radialGradient id={topId} cx="0.46" cy="0.4" r="0.62">
        <stop offset="0%" stopColor="#8a6a3c" />
        <stop offset="48%" stopColor="#cbb389" />
        <stop offset="100%" stopColor="#f4e7cb" />
      </radialGradient>

      <filter id={blurId} x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="3.4" />
      </filter>
    </defs>
  );
}
