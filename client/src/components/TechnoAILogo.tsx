interface Props {
  className?: string;
  size?: number;
}

/**
 * TechnoAI brand logo — transparent background SVG.
 * Shield shape with gradient "T" + upward arrow/chart motif matching the KVS TechnoAI brand.
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
        {/* Main blue-to-teal brand gradient */}
        <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1A237B" />
          <stop offset="35%" stopColor="#2962FF" />
          <stop offset="70%" stopColor="#0080FF" />
          <stop offset="100%" stopColor="#00C8B3" />
        </linearGradient>
        {/* Lighter accent gradient for inner elements */}
        <linearGradient id="accentGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00C8B3" />
          <stop offset="50%" stopColor="#2962FF" />
          <stop offset="100%" stopColor="#00CB53" />
        </linearGradient>
        {/* Shield fill — dark navy with slight transparency */}
        <linearGradient id="shieldFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1A237B" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#0d1b3e" stopOpacity="0.95" />
        </linearGradient>
      </defs>

      {/* ── Outer shield border (gradient stroke) ── */}
      <path
        d="M50 4 L90 20 L90 58 Q90 85 50 106 Q10 85 10 58 L10 20 Z"
        fill="url(#shieldFill)"
        stroke="url(#brandGrad)"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* ── Inner shield inset line ── */}
      <path
        d="M50 13 L82 26 L82 57 Q82 79 50 97 Q18 79 18 57 L18 26 Z"
        fill="none"
        stroke="url(#accentGrad)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        opacity="0.5"
      />

      {/* ── "T" crossbar (top horizontal) ── */}
      <rect x="28" y="34" width="44" height="7" rx="3.5" fill="url(#brandGrad)" />

      {/* ── "T" vertical stem ── */}
      <rect x="44" y="34" width="12" height="28" rx="3" fill="url(#brandGrad)" />

      {/* ── Upward arrow / chart line (teal accent) ── */}
      {/* Rising line from bottom-left to top-right */}
      <polyline
        points="30,72 42,60 54,65 68,48"
        stroke="url(#accentGrad)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Arrow head */}
      <polyline
        points="62,44 68,48 64,55"
        stroke="#00C8B3"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* ── Small dot accents ── */}
      <circle cx="30" cy="72" r="2.5" fill="#00C8B3" />
      <circle cx="42" cy="60" r="2" fill="#2962FF" />
      <circle cx="54" cy="65" r="2" fill="#0080FF" />
      <circle cx="68" cy="48" r="2.5" fill="#00CB53" />
    </svg>
  );
}
