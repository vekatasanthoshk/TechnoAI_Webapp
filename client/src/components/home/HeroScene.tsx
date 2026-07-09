import { motion, useTransform, type MotionValue } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import SceneSection from "@/components/scroll/SceneSection";
import KineticHeading from "@/components/scroll/KineticHeading";
import { useSceneContext } from "@/components/scroll/SceneContext";

const METRICS = [
  { value: "85%", label: "Increase in Leads", color: "text-[#4d8dff]" },
  { value: "40%", label: "Cost Reduction", color: "text-[#00C8B3]" },
  { value: "3.2x", label: "ROI Improvement", color: "text-[#3ddc78]" },
];

function HeroBody({
  progress,
  onBookConsultation,
}: {
  progress: MotionValue<number>;
  onBookConsultation: () => void;
}) {
  const { scrollToAnchor } = useSceneContext();
  // Beat 1: headline settles, then hands off to the manifesto while pinned
  const opacity = useTransform(progress, [0.3, 0.5], [1, 0]);
  const scale = useTransform(progress, [0.3, 0.55], [1, 0.94]);
  const y = useTransform(progress, [0.3, 0.55], [0, -48]);
  const hintOpacity = useTransform(progress, [0, 0.12], [0.8, 0]);
  // Beat 2: full-screen manifesto — Ducati-style scrolly-telling reveal
  const manifestoOpacity = useTransform(progress, [0.55, 0.7, 0.88, 1], [0, 1, 1, 0]);
  const manifestoScale = useTransform(progress, [0.55, 0.75], [0.92, 1]);
  const manifestoTracking = useTransform(progress, [0.55, 0.8], ["0.12em", "0em"]);

  return (
    <>
      <motion.div style={{ opacity, scale, y }} className="container relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(0,200,179,0.35)] bg-[rgba(0,200,179,0.08)] backdrop-blur-md text-xs font-medium tracking-widest uppercase text-[#00C8B3] mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#00C8B3] animate-pulse" />
          Business Automation & AI Solutions
        </motion.div>

        <KineticHeading
          as="h1"
          text="Transforming Businesses with AI"
          glow
          className="mx-auto max-w-5xl text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight text-white"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mx-auto mt-8 max-w-2xl text-lg md:text-xl text-[#aab8e0] leading-relaxed"
        >
          Automate workflows, improve decision-making, and reduce operational costs
          with custom AI solutions built for your business.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            size="lg"
            className="brand-gradient gradient-animate text-white border-0 glow-blue px-8 relative overflow-hidden group"
            onClick={onBookConsultation}
          >
            <span className="relative z-10 flex items-center">
              Book Consultation
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/20 bg-white/5 backdrop-blur-md text-[#dce4ff] hover:border-[#00C8B3] hover:text-[#00C8B3] hover:bg-white/5"
            onClick={() => scrollToAnchor("#services")}
          >
            Explore Services
          </Button>
        </motion.div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 + i * 0.12 }}
            >
              <div className={`text-3xl font-bold ${m.color} glow-text`}>{m.value}</div>
              <div className="text-xs text-[#8a9abf] font-medium tracking-wide">{m.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Beat 2: manifesto takes the full frame while the hero stays pinned */}
      <motion.div
        style={{ opacity: manifestoOpacity, scale: manifestoScale }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        <motion.p
          style={{ letterSpacing: manifestoTracking }}
          className="brand-gradient-text px-6 text-center text-5xl md:text-7xl lg:text-8xl font-bold leading-tight"
        >
          Intelligence in Motion.
        </motion.p>
      </motion.div>

      <motion.div
        style={{ opacity: hintOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[#8a9abf]"
        aria-hidden
      >
        <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </>
  );
}

export default function HeroScene({ onBookConsultation }: { onBookConsultation: () => void }) {
  return (
    <SceneSection sceneId="hero" anchorId="home" pin>
      {(progress) => <HeroBody progress={progress} onBookConsultation={onBookConsultation} />}
    </SceneSection>
  );
}
