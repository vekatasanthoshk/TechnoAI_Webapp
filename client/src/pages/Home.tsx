import { lazy, Suspense, useCallback, useMemo, useState } from "react";
import { MotionConfig } from "framer-motion";
import { SceneContext, type VideoMode } from "@/components/scroll/SceneContext";
import VideoStage from "@/components/scroll/VideoStage";
import ScrollProgress from "@/components/scroll/ScrollProgress";
import NavBar from "@/components/home/NavBar";
import HeroScene from "@/components/home/HeroScene";
import ServicesSection from "@/components/home/ServicesSection";
import MetricsSection from "@/components/home/MetricsSection";
import PortfolioSection from "@/components/home/PortfolioSection";
import AboutSection from "@/components/home/AboutSection";
import EcommerceSection from "@/components/home/EcommerceSection";
import ContactSection from "@/components/home/ContactSection";
import Footer from "@/components/home/Footer";
import { useLenis } from "@/hooks/useLenis";
import { useSceneProgress } from "@/hooks/useSceneProgress";

const ContactModal = lazy(() => import("@/components/home/ContactModal"));
const ChatBot = lazy(() => import("@/components/ChatBot"));

const NAV_OFFSET = -64;

function detectEnvironment() {
  if (typeof window === "undefined") {
    return { videoMode: "full" as VideoMode, smoothScroll: false };
  }
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const saveData =
    (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
  const small = window.innerWidth < 768;

  const videoMode: VideoMode = reducedMotion ? "off" : small || saveData ? "poster" : "full";
  return { videoMode, smoothScroll: !reducedMotion && !coarsePointer };
}

export default function Home() {
  const [contactFormOpen, setContactFormOpen] = useState(false);
  const env = useMemo(detectEnvironment, []);

  const lenisRef = useLenis(env.smoothScroll);
  const { sceneFloat, activeScene, registerSection } = useSceneProgress();

  const scrollToAnchor = useCallback(
    (anchor: string) => {
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.scrollTo(anchor, { offset: NAV_OFFSET });
      } else {
        document.querySelector(anchor)?.scrollIntoView({
          behavior: env.videoMode === "off" ? "auto" : "smooth",
        });
      }
    },
    [lenisRef, env.videoMode],
  );

  const contextValue = useMemo(
    () => ({
      registerSection,
      sceneFloat,
      activeScene,
      videoMode: env.videoMode,
      scrollToAnchor,
    }),
    [registerSection, sceneFloat, activeScene, env.videoMode, scrollToAnchor],
  );

  const openConsultation = useCallback(() => setContactFormOpen(true), []);

  return (
    <MotionConfig reducedMotion="user">
      <SceneContext.Provider value={contextValue}>
        <div className="relative min-h-screen overflow-x-clip bg-[#050a1f] text-[#f0f4ff]">
          <VideoStage />
          <div className="fixed inset-0 z-[1] pointer-events-none noise-overlay" aria-hidden />

          <NavBar onBookConsultation={openConsultation} />
          <ScrollProgress />

          <HeroScene onBookConsultation={openConsultation} />
          <ServicesSection onLearnMore={openConsultation} />
          <MetricsSection />
          <PortfolioSection />
          <AboutSection />
          <EcommerceSection />
          <ContactSection />

          <Footer />

          <Suspense fallback={null}>
            {contactFormOpen && (
              <ContactModal open={contactFormOpen} onClose={() => setContactFormOpen(false)} />
            )}
            <ChatBot />
          </Suspense>
        </div>
      </SceneContext.Provider>
    </MotionConfig>
  );
}
