import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import SceneSection from "@/components/scroll/SceneSection";
import KineticHeading from "@/components/scroll/KineticHeading";

const METRICS = [
  { target: 85, format: (v: number) => `${Math.round(v)}%`, label: "Increase in Leads" },
  { target: 40, format: (v: number) => `${Math.round(v)}%`, label: "Cost Reduction" },
  { target: 3.2, format: (v: number) => `${v.toFixed(1)}x`, label: "ROI Improvement" },
];

function CountUp({ target, format }: { target: number; format: (v: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [text, setText] = useState(format(0));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setText(format(v)),
    });
    return () => controls.stop();
  }, [inView, target, format]);

  return <span ref={ref}>{text}</span>;
}

/** The energy-flow clip is the background — numbers sit directly on it. */
export default function MetricsSection() {
  return (
    <SceneSection sceneId="metrics" anchorId="metrics">
      <div className="container">
        <div className="max-w-3xl">
          <p className="text-[#00C8B3] text-sm font-semibold uppercase tracking-widest mb-3">
            <span className="text-white/35 tabular-nums mr-3">03</span>Results That Matter
          </p>
          <KineticHeading
            text="Digital Marketing: Optimized Campaigns & ROI"
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          />
          <p className="text-[#aab8e0] text-lg mb-16">
            Outcome-focused strategies with custom-built AI agents and data-driven optimization.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-10">
          {METRICS.map((metric) => (
            <div key={metric.label} className="border-t border-white/15 pt-6">
              <div className="text-7xl md:text-8xl lg:text-9xl font-bold brand-gradient-text mb-3 leading-none tracking-tight tabular-nums">
                <CountUp target={metric.target} format={metric.format} />
              </div>
              <p className="text-xs text-[#8a9abf] tracking-[0.25em] uppercase">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    </SceneSection>
  );
}
