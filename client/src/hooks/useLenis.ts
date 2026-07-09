import { useEffect, useRef } from "react";
import Lenis from "lenis";

/**
 * Inertial smooth scrolling for the immersive Home page.
 * Lenis mutates the real scrollTop, so framer-motion's useScroll keeps
 * working unchanged. Disabled (returns a null ref) when `enabled` is false —
 * reduced-motion users and touch devices keep native scrolling.
 */
export function useLenis(enabled: boolean) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, syncTouch: false });
    lenisRef.current = lenis;
    // Exposed so anchor links, tests, and console debugging can drive the
    // same scroll pipeline users get (direct scrollTo calls are reverted).
    (window as Window & { __lenis?: Lenis }).__lenis = lenis;
    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as Window & { __lenis?: Lenis }).__lenis;
    };
  }, [enabled]);

  return lenisRef;
}
