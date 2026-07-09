import { motion, useTransform, type MotionValue } from "framer-motion";
import type { JSX } from "react";

interface KineticHeadingProps {
  text: string;
  as?: keyof Pick<JSX.IntrinsicElements, "h1" | "h2" | "h3">;
  className?: string;
  glow?: boolean;
  /**
   * When given, each word's reveal is scrubbed by this scroll progress
   * (0..1). Without it, words reveal once on entering the viewport.
   */
  progress?: MotionValue<number>;
  /** Progress window inside which the whole heading reveals (scrub mode). */
  window?: [number, number];
}

function ScrubWord({
  word,
  index,
  count,
  progress,
  window: [from, to],
}: {
  word: string;
  index: number;
  count: number;
  progress: MotionValue<number>;
  window: [number, number];
}) {
  const span = (to - from) / count;
  const start = from + index * span * 0.7; // overlap words for a fluid wave
  const end = Math.min(to, start + span * 1.6);
  const y = useTransform(progress, [start, end], ["110%", "0%"]);
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const rotate = useTransform(progress, [start, end], [6, 0]);

  return (
    <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
      <motion.span className="inline-block will-change-transform" style={{ y, opacity, rotate }}>
        {word}
      </motion.span>
      {" "}
    </span>
  );
}

/**
 * Masked per-word headline reveal — scroll-scrubbed when `progress` is
 * given (hero), otherwise a one-shot stagger on viewport entry.
 */
export default function KineticHeading({
  text,
  as: Tag = "h2",
  className = "",
  glow = false,
  progress,
  window: win = [0, 0.35],
}: KineticHeadingProps) {
  const words = text.split(" ");
  const cls = `${glow ? "glow-text " : ""}${className}`;

  if (progress) {
    return (
      <Tag className={cls}>
        {words.map((w, i) => (
          <ScrubWord key={i} word={w} index={i} count={words.length} progress={progress} window={win} />
        ))}
      </Tag>
    );
  }

  return (
    <Tag className={cls}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: "110%", opacity: 0, rotate: 6 }}
            whileInView={{ y: "0%", opacity: 1, rotate: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            {w}
          </motion.span>
          {" "}
        </span>
      ))}
    </Tag>
  );
}
