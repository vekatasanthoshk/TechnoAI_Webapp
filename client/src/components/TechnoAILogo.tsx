interface Props {
  className?: string;
  size?: number;
}

/**
 * TechnoAI brand logo — the original emblem artwork cropped from the
 * brand render (background keyed out), tinted with the brand blue→teal
 * gradient while keeping the metallic shading.
 */
export default function TechnoAILogo({ className = "", size = 40 }: Props) {
  return (
    <img
      src="/brand/logo-emblem-brand.png"
      alt="TechnoAI logo"
      width={size}
      height={size}
      className={`object-contain select-none ${className}`}
      style={{ width: size, height: size }}
      draggable={false}
    />
  );
}
