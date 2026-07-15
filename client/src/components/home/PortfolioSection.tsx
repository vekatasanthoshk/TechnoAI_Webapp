import { motion } from "framer-motion";
import SceneSection from "@/components/scroll/SceneSection";
import KineticHeading from "@/components/scroll/KineticHeading";

const CASE_STUDY = [
  {
    label: "Challenge",
    text: "A growing SaaS company was overwhelmed with customer support tickets, causing response delays and customer dissatisfaction.",
  },
  {
    label: "Solution",
    text: "We deployed a custom AI support agent that automatically handles common inquiries, routes complex issues, and learns from interactions.",
  },
  {
    label: "Outcome",
    text: "80% reduction in manual tickets, 60% faster response times, and 95% customer satisfaction improvement.",
  },
];

const IMPACT = [
  { label: "Leads Generated", value: "+85%", color: "text-[#4d8dff]" },
  { label: "Cost Reduction", value: "-40%", color: "text-[#00C8B3]" },
  { label: "ROI Improvement", value: "3.2x", color: "text-[#3ddc78]" },
];

export default function PortfolioSection() {
  return (
    <SceneSection sceneId="portfolio" anchorId="portfolio">
      <div className="container">
        <div className="text-center mb-14">
          <p className="text-[#00C8B3] text-sm font-semibold uppercase tracking-widest mb-3">
            <span className="text-white/35 tabular-nums mr-3">04</span>Case Studies
          </p>
          <KineticHeading
            text="Success Stories"
            className="text-4xl md:text-5xl font-bold mb-4 text-white"
          />
          <p className="text-[#8a9abf] max-w-2xl mx-auto">
            See how we've helped businesses transform with AI-powered solutions.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-panel-dark rounded-2xl p-8 group hover:-translate-y-1 transition-transform duration-300"
          >
            <div className="inline-flex px-3 py-1 rounded-full bg-[rgba(0,200,179,0.1)] border border-[rgba(0,200,179,0.3)] text-[#00C8B3] text-xs font-medium mb-6">
              SaaS Company
            </div>
            <h3 className="text-xl font-bold mb-6 text-white">Reducing Manual Support Tickets by 80%</h3>
            <div className="space-y-5">
              {CASE_STUDY.map((item) => (
                <div key={item.label}>
                  <h4 className="text-[#4d8dff] font-semibold text-sm mb-1">{item.label}</h4>
                  <p className="text-[#8a9abf] text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-panel-dark rounded-2xl p-8 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#2962FF]/10 rounded-bl-full pointer-events-none" />
            <div className="inline-flex px-3 py-1 rounded-full bg-[rgba(41,98,255,0.12)] border border-[rgba(41,98,255,0.35)] text-[#4d8dff] text-xs font-medium mb-6">
              Key Metrics
            </div>
            <h3 className="text-xl font-bold mb-8 text-white">Measurable Business Impact</h3>
            <div className="space-y-5 relative z-10">
              {IMPACT.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#aab8e0] text-sm font-medium">{item.label}</span>
                    <span className={`text-2xl font-bold ${item.color}`}>{item.value}</span>
                  </div>
                  <div className="h-px bg-gradient-to-r from-[rgba(41,98,255,0.35)] to-transparent" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </SceneSection>
  );
}
