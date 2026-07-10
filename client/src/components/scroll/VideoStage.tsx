import { useEffect, useMemo, useRef } from "react";
import { motion, useMotionValue, useMotionValueEvent, type MotionValue } from "framer-motion";
import { SCENES } from "./scenes";
import { useSceneContext } from "./SceneContext";

/**
 * Consecutive scenes sharing a clip collapse into one layer so a scene
 * never crossfades with itself; the layer's opacity is the max of its
 * member scenes' opacities.
 */
interface ClipGroup {
  video: string;
  poster: string;
  first: number;
  last: number;
  objectPosition: string;
}

const ORB_POSITION: Record<string, string> = {
  center: "50% 50%",
  left: "28% 50%",
  right: "72% 50%",
};

function buildGroups(): ClipGroup[] {
  const groups: ClipGroup[] = [];
  for (let i = 0; i < SCENES.length; i++) {
    const s = SCENES[i];
    const prev = groups[groups.length - 1];
    if (prev && prev.video === s.video && prev.last === i - 1) {
      prev.last = i;
    } else {
      groups.push({
        video: s.video,
        poster: s.poster,
        first: i,
        last: i,
        objectPosition: ORB_POSITION[s.orbPosition],
      });
    }
  }
  return groups;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Videos never reach full opacity — the orb is a backdrop, not the
 * subject. Keeps foreground copy readable over bright plasma frames.
 */
const STAGE_DIM = 0.55;

/** Opacity of a group: max over its scene indices of the triangular fade. */
function groupOpacity(v: number, first: number, last: number): number {
  if (v >= first && v <= last) return 1;
  return clamp01(1 - Math.min(Math.abs(v - first), Math.abs(v - last)));
}

function VideoLayer({
  group,
  sceneFloat,
  mounted,
}: {
  group: ClipGroup;
  sceneFloat: MotionValue<number>;
  mounted: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Eagerly-subscribed local value (lazy useTransform chains off context
  // values silently drop updates with this mount timing).
  const initialFade = groupOpacity(sceneFloat.get(), group.first, group.last);
  const opacity = useMotionValue(STAGE_DIM * initialFade);
  // Cinematic push-in: an incoming layer settles from 1.08 → 1.0 as it fades up
  const scale = useMotionValue(1 + 0.08 * (1 - initialFade));
  useMotionValueEvent(sceneFloat, "change", (v) => {
    const fade = groupOpacity(v, group.first, group.last);
    opacity.set(STAGE_DIM * fade);
    scale.set(1 + 0.08 * (1 - fade));
  });

  // Play only while visible; retry once on first pointer interaction if
  // autoplay is blocked (iOS Low-Power Mode) — the poster covers until then.
  useMotionValueEvent(opacity, "change", (o) => {
    const el = videoRef.current;
    if (!el) return;
    if (o > 0.01 && el.paused) void el.play().catch(() => {});
    else if (o <= 0.01 && !el.paused) el.pause();
  });

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !mounted) return;
    if (opacity.get() > 0.01) {
      void el.play().catch(() => {
        const retry = () => {
          if (opacity.get() > 0.01) void el.play().catch(() => {});
        };
        window.addEventListener("pointerdown", retry, { once: true });
      });
    }
    const onVisibility = () => {
      if (document.hidden) el.pause();
      else if (opacity.get() > 0.01) void el.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  if (!mounted) return null;

  return (
    <motion.video
      ref={videoRef}
      src={group.video}
      poster={group.poster}
      muted
      playsInline
      loop
      disablePictureInPicture
      preload="auto"
      className="absolute inset-0 h-full w-full object-cover will-change-[opacity,transform]"
      style={{
        opacity,
        scale,
        mixBlendMode: "screen",
        objectPosition: group.objectPosition,
      }}
    />
  );
}

function PosterLayer({
  group,
  sceneFloat,
  mounted,
}: {
  group: ClipGroup;
  sceneFloat: MotionValue<number>;
  mounted: boolean;
}) {
  const initialFade = groupOpacity(sceneFloat.get(), group.first, group.last);
  const opacity = useMotionValue(STAGE_DIM * initialFade);
  const scale = useMotionValue(1 + 0.08 * (1 - initialFade));
  useMotionValueEvent(sceneFloat, "change", (v) => {
    const fade = groupOpacity(v, group.first, group.last);
    opacity.set(STAGE_DIM * fade);
    scale.set(1 + 0.08 * (1 - fade));
  });
  if (!mounted) return null;
  return (
    <motion.img
      src={group.poster}
      alt=""
      aria-hidden
      className="absolute inset-0 h-full w-full object-cover will-change-[opacity,transform]"
      style={{ opacity, scale, mixBlendMode: "screen", objectPosition: group.objectPosition }}
    />
  );
}

/**
 * Fixed full-viewport stage behind the content. Videos autoplay-loop and
 * scroll only crossfades their opacities (compositor-only). The clips are
 * generated on black, so mix-blend-mode: screen sinks the background into
 * the page's navy gradient and only the glowing orb remains visible.
 */
export default function VideoStage() {
  const { sceneFloat, activeScene, videoMode } = useSceneContext();
  const groups = useMemo(buildGroups, []);

  const isNear = (g: ClipGroup) => activeScene >= g.first - 1 && activeScene <= g.last + 1;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden>
      {/* Base: deep navy radial glow — always visible, covers video load gaps */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(90% 70% at 50% 38%, #0a1330 0%, #071026 55%, #050a1f 100%)",
        }}
      />

      {videoMode === "full" &&
        groups.map((g) => (
          <VideoLayer key={g.first} group={g} sceneFloat={sceneFloat} mounted={isNear(g)} />
        ))}

      {videoMode === "poster" &&
        groups.map((g) => (
          <PosterLayer key={g.first} group={g} sceneFloat={sceneFloat} mounted={isNear(g)} />
        ))}

      {videoMode === "off" && (
        <img
          src={SCENES[activeScene]?.poster}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
          style={{ mixBlendMode: "screen", opacity: STAGE_DIM }}
        />
      )}

      {/* Center scrim + vignette keep copy readable over the orb */}
      <div className="absolute inset-0 stage-scrim" />
      <div className="absolute inset-0 stage-vignette" />
    </div>
  );
}
