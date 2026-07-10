interface Props {
  className?: string;
  size?: number;
}

/**
 * TechnoAI brand logo — the original emblem artwork (silver shield with
 * 7/A monogram and swoosh), cropped from the brand render with its flat
 * navy background keyed out so it sits on any surface.
 */
export default function TechnoAILogo({ className = "", size = 40 }: Props) {
  return (
    <img
      src="/brand/logo-emblem-alpha.png"
      alt="TechnoAI logo"
      width={size}
      height={size}
      className={`object-contain select-none ${className}`}
      style={{ width: size, height: size }}
      draggable={false}
    />
  );
}
