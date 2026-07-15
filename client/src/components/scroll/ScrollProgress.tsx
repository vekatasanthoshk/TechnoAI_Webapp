import { SCENES } from "./scenes";
import { useSceneContext } from "./SceneContext";

const LABELS: Record<string, string> = {
  hero: "Home",
  services: "Services",
  metrics: "Results",
  portfolio: "Portfolio",
  about: "About",
  ecommerce: "AI eCommerce",
  contact: "Contact",
};

/** Fixed right-edge scene dots — elongates + glows on the active scene. */
export default function ScrollProgress() {
  const { activeScene, scrollToAnchor } = useSceneContext();

  return (
    <nav
      aria-label="Page sections"
      className="fixed right-5 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex"
    >
      {SCENES.map((scene, i) => {
        const active = i === activeScene;
        return (
          <button
            key={scene.id}
            title={LABELS[scene.id]}
            aria-label={LABELS[scene.id]}
            aria-current={active ? "true" : undefined}
            onClick={() => scrollToAnchor(scene.anchor)}
            className={`focus-ring rounded-full transition-[height,background-color,box-shadow] duration-300 ${
              active
                ? "h-7 w-1.5 bg-[#00C8B3] shadow-[0_0_12px_rgba(0,200,179,0.8)]"
                : "h-1.5 w-1.5 bg-white/25 hover:bg-white/60"
            }`}
          />
        );
      })}
    </nav>
  );
}
