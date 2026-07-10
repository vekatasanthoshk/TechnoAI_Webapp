interface Props {
  className?: string;
  size?: number;
}

/**
 * TechnoAI brand logo — transparent background SVG.
 * Gradient shield containing an upward arrow with circuit traces and
 * stepped chevrons, per the KVS TechnoAI brand board.
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
        {/* Shield outline: blue → teal sweep */}
        <linearGradient id="taiShield" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2962FF" />
          <stop offset="55%" stopColor="#00B0FF" />
          <stop offset="100%" stopColor="#00C8B3" />
        </linearGradient>
        {/* Arrow body: deep blue → light blue */}
        <linearGradient id="taiArrow" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1A237B" />
          <stop offset="45%" stopColor="#2962FF" />
          <stop offset="100%" stopColor="#00B0FF" />
        </linearGradient>
        {/* Steps / circuit: teal → green */}
        <linearGradient id="taiAccent" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00CB53" />
          <stop offset="100%" stopColor="#00C8B3" />
        </linearGradient>
      </defs>

      {/* ── Shield outline (transparent interior adapts to light/dark) ── */}
      <path
        d="M50 4 L90 20 L90 58 Q90 85 50 106 Q10 85 10 58 L10 20 Z"
        fill="none"
        stroke="url(#taiShield)"
        strokeWidth="5"
        strokeLinejoin="round"
      />

      {/* ── Upward arrow: one continuous polygon (shaft + head) ── */}
      <path
        d="M29.1 63.1 L55.1 37.1 L49.8 31.8 L72 28 L68.2 50.2 L62.9 44.9 L36.9 70.9 Z"
        fill="url(#taiArrow)"
      />

      {/* ── Trailing steps behind the arrow tail ── */}
      <line
        x1="24" y1="85" x2="33" y2="76"
        stroke="url(#taiAccent)"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <line
        x1="33" y1="93" x2="40" y2="86"
        stroke="url(#taiAccent)"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* ── Circuit traces + nodes flanking the arrow ── */}
      <polyline
        points="28,42 40,50 40,60"
        stroke="url(#taiAccent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <polyline
        points="64,72 72,64 72,54"
        stroke="url(#taiAccent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="28" cy="42" r="3" fill="none" stroke="#00C8B3" strokeWidth="2" />
      <circle cx="40" cy="60" r="2.5" fill="#00C8B3" />
      <circle cx="64" cy="72" r="3" fill="none" stroke="#00B0FF" strokeWidth="2" />
      <circle cx="72" cy="54" r="2.5" fill="#00CB53" />
    </svg>
  );
}
