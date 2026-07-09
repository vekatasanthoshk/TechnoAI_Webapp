import { useCallback, useEffect, type RefObject } from "react";
import { useMotionValue, useMotionValueEvent, useScroll, type MotionValue } from "framer-motion";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Scroll progress (0..1) for a section, computed manually from the window
 * scroll position. framer-motion's target-based useScroll proved unreliable
 * with this page's mount timing (subscriptions silently dying), so this
 * mirrors the approach used by useSceneProgress, which is deterministic.
 *
 * - pin=false: 0 when the section top reaches the viewport bottom,
 *   1 when it reaches 25% from the viewport top (reveal window).
 * - pin=true: 0 while the section top is at the viewport top,
 *   1 when its bottom reaches the viewport bottom (sticky scrub range).
 */
export function useSectionProgress(
  ref: RefObject<HTMLElement | null>,
  pin: boolean,
): MotionValue<number> {
  const progress = useMotionValue(0);
  const { scrollY } = useScroll();

  const compute = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const vh = window.innerHeight || 1;
    const rect = el.getBoundingClientRect();
    let p: number;
    if (pin) {
      const scrubRange = rect.height - vh;
      p = scrubRange > 0 ? -rect.top / scrubRange : 1;
    } else {
      p = (vh - rect.top) / (vh * 0.75);
    }
    progress.set(clamp01(p));
  }, [ref, pin, progress]);

  useMotionValueEvent(scrollY, "change", compute);

  useEffect(() => {
    compute();
    window.addEventListener("resize", compute);
    window.addEventListener("load", compute);
    return () => {
      window.removeEventListener("resize", compute);
      window.removeEventListener("load", compute);
    };
  }, [compute]);

  return progress;
}
