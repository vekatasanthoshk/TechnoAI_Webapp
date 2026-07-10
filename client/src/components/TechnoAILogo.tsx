interface Props {
  className?: string;
  size?: number;
}

/**
 * TechnoAI brand logo — transparent background SVG.
 * Faithful vector of the brand emblem: double-outlined shield holding the
 * "7/T + A-peak" monogram, upward growth arrows, a circuit swoosh ending
 * in an arrowhead with node dots, and a chevron base.
 */
export default function TechnoAILogo({ className = "", size = 40 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Shield outline: deep blue → teal → green sweep */}
        <linearGradient id="taiShield" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1A237B" />
          <stop offset="40%" stopColor="#2962FF" />
          <stop offset="100%" stopColor="#00CB53" />
        </linearGradient>
        {/* Monogram bar/stem: deep blue → blue */}
        <linearGradient id="taiMono" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1A237B" />
          <stop offset="100%" stopColor="#2962FF" />
        </linearGradient>
        {/* A-peak: light blue → teal */}
        <linearGradient id="taiPeak" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00C8B3" />
          <stop offset="100%" stopColor="#00B0FF" />
        </linearGradient>
        {/* Swoosh + arrows: blue → teal → green */}
        <linearGradient id="taiSwoosh" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2962FF" />
          <stop offset="60%" stopColor="#00C8B3" />
          <stop offset="100%" stopColor="#00CB53" />
        </linearGradient>
      </defs>

      {/* ── Shield: outer + inner outline ── */}
      <path
        d="M50 4 L90 20 L90 58 Q90 85 50 106 Q10 85 10 58 L10 20 Z"
        stroke="url(#taiShield)"
        strokeWidth="4.5"
        strokeLinejoin="round"
      />
      <path
        d="M50 12 L83 25.5 L83 57 Q83 80 50 97.5 Q17 80 17 57 L17 25.5 Z"
        stroke="url(#taiShield)"
        strokeWidth="2"
        strokeLinejoin="round"
        opacity="0.55"
      />

      {/* ── Chevron base ── */}
      <path
        d="M36 80 L50 89 L64 80 L64 87 L50 96 L36 87 Z"
        fill="url(#taiMono)"
        opacity="0.85"
      />

      {/* ── Growth arrows (left, tucked behind the monogram) ── */}
      <g fill="url(#taiSwoosh)">
        <rect x="27.5" y="54" width="4.5" height="17" rx="1" />
        <path d="M29.75 44 L23 55 L36.5 55 Z" />
        <g opacity="0.85">
          <rect x="37" y="60" width="4" height="11" rx="1" />
          <path d="M39 51.5 L33.5 60.5 L44.5 60.5 Z" />
        </g>
      </g>

      {/* ── Monogram: 7/T bar + diagonal stem ── */}
      <path d="M28 26 L66 26 L62 34 L24 34 Z" fill="url(#taiMono)" />
      <path d="M50 30 L59 30 L42 84 L34 78 Z" fill="url(#taiMono)" />

      {/* ── A-peak (mountain) ── */}
      <path
        d="M60 36 L74 74 L67.5 74 L60 52 L52.5 74 L46 74 Z"
        fill="url(#taiPeak)"
      />

      {/* ── Circuit swoosh: curve, arrowhead, node dots ── */}
      <path
        d="M31 90 C 44 80, 40 62, 52 53 C 59 47.5, 63 44, 68 40"
        stroke="url(#taiSwoosh)"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M75.5 32.5 L65.5 37 L71.5 43.5 Z" fill="#00CB53" />
      <line x1="57" y1="50" x2="64" y2="54" stroke="#00C8B3" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="66.5" cy="55.5" r="2.6" fill="none" stroke="#00C8B3" strokeWidth="2" />
      <line x1="63" y1="44" x2="69" y2="47" stroke="#00B0FF" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="71.5" cy="48.5" r="2.6" fill="none" stroke="#00B0FF" strokeWidth="2" />
    </svg>
  );
}
