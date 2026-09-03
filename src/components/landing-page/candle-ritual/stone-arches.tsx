const GOLD = "#d9c9a3";

export function StoneArches() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1000 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <title>Nave da igreja</title>

      <defs>
        <radialGradient id="ritual-rose" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={GOLD} stopOpacity="0.5" />
          <stop offset="60%" stopColor={GOLD} stopOpacity="0.22" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0.06" />
        </radialGradient>
      </defs>

      <g stroke={GOLD} strokeWidth="1.4" fill="none" opacity="0.2">
        <path d="M40 600 L40 210 Q40 120 128 120 Q216 120 216 210 L216 600" />
        <path d="M78 600 L78 232 Q78 158 128 158 Q178 158 178 232 L178 600" />
        <path d="M784 600 L784 210 Q784 120 872 120 Q960 120 960 210 L960 600" />
        <path d="M822 600 L822 232 Q822 158 872 158 Q922 158 922 232 L922 600" />
      </g>

      <g stroke={GOLD} strokeWidth="1.2" fill="none" opacity="0.16">
        <path d="M268 600 L268 250 Q268 168 348 168 Q428 168 428 250 L428 600" />
        <path d="M572 600 L572 250 Q572 168 652 168 Q732 168 732 250 L732 600" />
        <path d="M330 600 L330 300 Q330 236 392 236 Q454 236 454 300 L454 600" />
        <path d="M546 600 L546 300 Q546 236 608 236 Q670 236 670 300 L670 600" />
      </g>

      <g stroke={GOLD} strokeWidth="1.6" fill="none" opacity="0.26">
        <path d="M416 600 L416 268 Q416 150 500 150 Q584 150 584 268 L584 600" />
        <path d="M452 600 L452 470 L548 470 L548 600" />
        <path d="M440 470 L560 470" />
        <path d="M500 470 L500 424" />
        <path d="M474 448 L526 448" />
      </g>

      <g transform="translate(500 196)">
        <circle r="62" fill="url(#ritual-rose)" />
        <g stroke={GOLD} strokeWidth="1.3" fill="none" opacity="0.42">
          <circle r="62" />
          <circle r="42" />
          <circle r="18" />
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i * Math.PI) / 6;
            return (
              <line
                key={`raio-${i * 30}`}
                x1={Math.cos(angle) * 18}
                y1={Math.sin(angle) * 18}
                x2={Math.cos(angle) * 62}
                y2={Math.sin(angle) * 62}
              />
            );
          })}
          {Array.from({ length: 8 }, (_, i) => {
            const angle = (i * Math.PI) / 4;
            return (
              <circle
                key={`petala-${i * 45}`}
                cx={Math.cos(angle) * 42}
                cy={Math.sin(angle) * 42}
                r="12"
              />
            );
          })}
        </g>
      </g>

      <g stroke={GOLD} strokeWidth="1.1" fill="none" opacity="0.2">
        <path d="M112 400 L112 296 Q112 258 144 258 Q176 258 176 296 L176 400 Z" />
        <path d="M144 400 L144 258" />
        <path d="M824 400 L824 296 Q824 258 856 258 Q888 258 888 296 L888 400 Z" />
        <path d="M856 400 L856 258" />
      </g>

      <g stroke={GOLD} strokeWidth="0.9" fill="none" opacity="0.12">
        <path d="M0 600 L430 470" />
        <path d="M1000 600 L570 470" />
        <path d="M150 600 L455 500" />
        <path d="M850 600 L545 500" />
        <path d="M330 600 L470 530" />
        <path d="M670 600 L530 530" />
      </g>
    </svg>
  );
}
