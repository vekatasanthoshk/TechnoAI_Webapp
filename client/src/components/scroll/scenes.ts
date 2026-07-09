// Scene configuration for the scroll-driven video experience.
// Video clips live in client/public/videos/ (served at /videos/*).
// NOTE: /videos/* is cached immutable on Vercel — when a clip is regenerated,
// rename it (e.g. orb-hero-v2.mp4) instead of replacing it in place.

export type SceneId =
  | "hero"
  | "services"
  | "metrics"
  | "portfolio"
  | "about"
  | "ecommerce"
  | "contact";

export interface SceneDef {
  id: SceneId;
  /** Anchor used by the nav, e.g. "#home" */
  anchor: string;
  /** Full-quality clip, generated in Google Veo (Flow) on a black background */
  video: string;
  /** Poster frame shown before playback / on mobile / reduced motion */
  poster: string;
  /** Where the copy sits so the orb stays visible */
  align: "center" | "left" | "right";
  /** object-position hint for the video so the orb avoids the copy */
  orbPosition: "center" | "left" | "right";
}

export const SCENES: SceneDef[] = [
  {
    id: "hero",
    anchor: "#home",
    video: "/videos/orb-hero.mp4",
    poster: "/videos/orb-hero.jpg",
    align: "center",
    orbPosition: "center",
  },
  {
    id: "services",
    anchor: "#services",
    video: "/videos/orb-brain.mp4",
    poster: "/videos/orb-brain.jpg",
    align: "left",
    orbPosition: "right",
  },
  {
    id: "metrics",
    anchor: "#metrics",
    video: "/videos/orb-circuit.mp4",
    poster: "/videos/orb-circuit.jpg",
    align: "center",
    orbPosition: "center",
  },
  {
    id: "portfolio",
    anchor: "#portfolio",
    video: "/videos/orb-circuit.mp4",
    poster: "/videos/orb-circuit.jpg",
    align: "center",
    orbPosition: "right",
  },
  {
    id: "about",
    anchor: "#about",
    video: "/videos/orb-hero.mp4",
    poster: "/videos/orb-hero.jpg",
    align: "left",
    orbPosition: "right",
  },
  {
    id: "ecommerce",
    anchor: "#ecommerce",
    video: "/videos/orb-chart.mp4",
    poster: "/videos/orb-chart.jpg",
    align: "right",
    orbPosition: "left",
  },
  {
    id: "contact",
    anchor: "#contact",
    video: "/videos/orb-disperse.mp4",
    poster: "/videos/orb-disperse.jpg",
    align: "center",
    orbPosition: "center",
  },
];

/** True when scene i uses the same clip as scene i-1 (skip the crossfade). */
export const SAME_AS_PREV: boolean[] = SCENES.map(
  (s, i) => i > 0 && s.video === SCENES[i - 1].video,
);
