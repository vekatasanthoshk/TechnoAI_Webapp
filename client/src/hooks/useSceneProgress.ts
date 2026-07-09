import { useCallback, useEffect, useRef, useState } from "react";
import { useMotionValue, useMotionValueEvent, useScroll } from "framer-motion";
import { SCENES, type SceneId } from "@/components/scroll/scenes";

/**
 * Fraction of the viewport height over which two adjacent scenes crossfade.
 * Scene i becomes dominant when a section's top crosses this line.
 */
const WINDOW_FRACTION = 0.55;

/**
 * Maps page scroll to a continuous scene index (sceneFloat, 0..N-1).
 * Between section triggers the value is flat (one video fully visible);
 * within a crossfade window it ramps linearly between the two indices.
 * Triggers are held in a ref and re-measured on register/resize/load so the
 * scroll handler never re-subscribes.
 */
export function useSceneProgress() {
  const sectionsRef = useRef(new Map<SceneId, HTMLElement>());
  const triggersRef = useRef<number[]>(SCENES.map((_, i) => (i === 0 ? 0 : Number.POSITIVE_INFINITY)));
  const sceneFloat = useMotionValue(0);
  const [activeScene, setActiveScene] = useState(0);
  const activeRef = useRef(0);
  const { scrollY } = useScroll();

  const update = useCallback(
    (y: number) => {
      const triggers = triggersRef.current;
      const W = WINDOW_FRACTION * window.innerHeight || 1;
      let v = 0;
      for (let i = 1; i < triggers.length; i++) {
        const t = triggers[i];
        if (!Number.isFinite(t)) break;
        if (y >= t) {
          v = i;
          continue;
        }
        if (y > t - W) v = i - 1 + (y - (t - W)) / W;
        break;
      }
      sceneFloat.set(v);
      const rounded = Math.round(v);
      if (rounded !== activeRef.current) {
        activeRef.current = rounded;
        setActiveScene(rounded);
      }
    },
    [sceneFloat],
  );

  const measure = useCallback(() => {
    const vh = window.innerHeight;
    triggersRef.current = SCENES.map((s, i) => {
      if (i === 0) return 0;
      const el = sectionsRef.current.get(s.id);
      if (!el) return Number.POSITIVE_INFINITY;
      const top = el.getBoundingClientRect().top + window.scrollY;
      return Math.max(1, top - WINDOW_FRACTION * vh);
    });
    update(window.scrollY);
  }, [update]);

  const registerSection = useCallback(
    (id: SceneId, el: HTMLElement | null) => {
      if (el) sectionsRef.current.set(id, el);
      else sectionsRef.current.delete(id);
      requestAnimationFrame(measure);
    },
    [measure],
  );

  useMotionValueEvent(scrollY, "change", update);

  useEffect(() => {
    measure();
    const onRemeasure = () => measure();
    window.addEventListener("resize", onRemeasure);
    window.addEventListener("load", onRemeasure);
    const ro = new ResizeObserver(onRemeasure);
    ro.observe(document.body);
    return () => {
      window.removeEventListener("resize", onRemeasure);
      window.removeEventListener("load", onRemeasure);
      ro.disconnect();
    };
  }, [measure]);

  return { sceneFloat, activeScene, registerSection };
}
