import { motion } from "framer-motion";
import { ArrowRight, Brain, Code, Zap } from "lucide-react";
import SceneSection from "@/components/scroll/SceneSection";
import KineticHeading from "@/components/scroll/KineticHeading";

const SERVICES = [
  {
    icon: <Zap className="w-7 h-7" />,
    title: "Business Automation",
    description:
      "Streamline workflows and eliminate manual processes with intelligent automation that scales with your business.",
    color: "from-blue-500 to-blue-700",
  },
  {
    icon: <Brain className="w-7 h-7" />,
    title: "Custom AI Agents",
    description:
      "Deploy specialized AI agents for sales, marketing, support, and operations — trained on your business data.",
    color: "from-teal-400 to-cyan-600",
  },
  {
    icon: <Code className="w-7 h-7" />,
    title: "Data Decision Systems",
    description:
      "Build intelligent systems that transform raw data into actionable insights and competitive advantages.",
    color: "from-green-400 to-emerald-600",
  },
];

export default function ServicesSection({ onLearnMore }: { onLearnMore: () => void }) {
  return (
    <SceneSection sceneId="services" anchorId="services">
      <div className="container">
        <div className="max-w-2xl mb-14">
          <p className="text-[#00C8B3] text-sm font-semibold uppercase tracking-widest mb-3">What We Do</p>
          <KineticHeading
            text="Our Core Services"
            className="text-4xl md:text-5xl font-bold mb-4 text-white"
          />
          <p className="text-[#8a9abf]">
            Comprehensive AI solutions designed to drive growth and efficiency across your entire organization.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {SERVICES.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="glass-panel-dark rounded-2xl p-8 group hover:-translate-y-2 hover:border-[rgba(0,200,179,0.3)] transition-all duration-300"
            >
              <div
                className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${service.color} mb-5 group-hover:scale-110 transition-transform`}
              >
                <div className="text-white">{service.icon}</div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{service.title}</h3>
              <p className="text-[#8a9abf] mb-6 text-sm leading-relaxed">{service.description}</p>
              <button
                onClick={onLearnMore}
                className="flex items-center gap-1 text-sm text-[#4d8dff] hover:text-[#00C8B3] transition-colors font-medium"
              >
                Learn More
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </SceneSection>
  );
}
