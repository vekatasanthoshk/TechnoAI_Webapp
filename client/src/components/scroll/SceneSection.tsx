import { useRef, type ReactNode } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import type { SceneId } from "./scenes";
import { useSceneContext } from "./SceneContext";
import { useSectionProgress } from "@/hooks/useSectionProgress";

interface SceneSectionProps {
  sceneId: SceneId;
  /** DOM id for anchor navigation (without #) */
  anchorId: string;
  className?: string;
  /**
   * Pinned variant (hero): the section is taller than the viewport and its
   * content sticks while local progress runs 0→1 across the extra height.
   */
  pin?: boolean;
  /** Render prop receives the section's local scroll progress (0..1). */
  children: ReactNode | ((progress: MotionValue<number>) => ReactNode);
}

/**
 * A full-viewport scene. Registers itself with the scene context (drives the
 * VideoStage crossfade) and gives its content a scroll-linked reveal.
 */
export default function SceneSection({
  sceneId,
  anchorId,
  className = "",
  pin = false,
  children,
}: SceneSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const { registerSection } = useSceneContext();

  const progress = useSectionProgress(ref, pin);
  const y = useTransform(progress, [0, 1], pin ? [0, 0] : [64, 0]);
  const opacity = useTransform(progress, [0, 0.8], pin ? [1, 1] : [0, 1]);

  const setRef = (el: HTMLElement | null) => {
    (ref as React.MutableRefObject<HTMLElement | null>).current = el;
    registerSection(sceneId, el);
  };

  const body = typeof children === "function" ? children(progress) : children;

  if (pin) {
    return (
      <section ref={setRef} id={anchorId} className={`relative z-10 h-[220vh] ${className}`}>
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          {body}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={setRef}
      id={anchorId}
      className={`relative z-10 flex min-h-screen items-center py-24 ${className}`}
    >
      <motion.div className="w-full" style={{ y, opacity }}>
        {body}
      </motion.div>
    </section>
  );
}
