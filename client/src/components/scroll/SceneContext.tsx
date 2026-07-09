import { createContext, useContext } from "react";
import type { MotionValue } from "framer-motion";
import type { SceneId } from "./scenes";

/**
 * full   — looping videos with scroll crossfades (desktop)
 * poster — static poster images crossfaded (mobile / Save-Data)
 * off    — active poster only, no motion (prefers-reduced-motion)
 */
export type VideoMode = "full" | "poster" | "off";

export interface SceneContextValue {
  registerSection: (id: SceneId, el: HTMLElement | null) => void;
  /** Continuous scene index 0..N-1; integers = one scene fully visible */
  sceneFloat: MotionValue<number>;
  /** Rounded sceneFloat, updated only when it changes */
  activeScene: number;
  videoMode: VideoMode;
  scrollToAnchor: (anchor: string) => void;
}

export const SceneContext = createContext<SceneContextValue | null>(null);

export function useSceneContext(): SceneContextValue {
  const ctx = useContext(SceneContext);
  if (!ctx) throw new Error("useSceneContext must be used within SceneContext.Provider");
  return ctx;
}

/** Ref callback that registers a section element as the anchor for a scene. */
export function useSceneRegister(id: SceneId) {
  const { registerSection } = useSceneContext();
  return (el: HTMLElement | null) => registerSection(id, el);
}
