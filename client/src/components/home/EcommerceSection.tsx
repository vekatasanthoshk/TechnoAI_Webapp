import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import SceneSection from "@/components/scroll/SceneSection";
import KineticHeading from "@/components/scroll/KineticHeading";

const FEATURES = [
  "Intelligent product recommendations",
  "Automated customer segmentation",
  "Dynamic pricing optimization",
  "Predictive inventory management",
  "AI-powered ad campaign optimization",
];

const SUCCESS_METRICS = [
  { value: "85%", label: "Increase in Leads", color: "text-[#4d8dff]", bar: "bg-[#2962FF]", pct: "85%" },
  { value: "40%", label: "Reduction in Op-Ex", color: "text-[#00C8B3]", bar: "bg-[#00C8B3]", pct: "40%" },
  { value: "+3.2x", label: "ROI on Ad Spend", color: "text-[#3ddc78]", bar: "bg-[#00CB53]", pct: "80%" },
];

export default function EcommerceSection() {
  return (
    <SceneSection sceneId="ecommerce" anchorId="ecommerce">
      <div className="container">
        <div className="md:ml-auto md:text-right max-w-2xl mb-14">
          <p className="text-[#3ddc78] text-sm font-semibold uppercase tracking-widest mb-3">
            <span className="text-white/35 tabular-nums mr-3">06</span>eCommerce AI
          </p>
          <KineticHeading
            text="AI eCommerce Solutions"
            className="text-4xl md:text-5xl font-bold mb-4 text-white"
          />
          <p className="text-[#8a9abf]">
            Omnichannel platform capabilities for custom growth, ROI, and business scalability.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-panel-dark rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-6 text-white">Growth & Automation Features</h3>
            <ul className="space-y-4">
              {FEATURES.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#00C8B3] flex-shrink-0" />
                  <span className="text-[#aab8e0] text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-panel-dark rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-6 text-white">Success Metrics</h3>
            <div className="space-y-6">
              {SUCCESS_METRICS.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#aab8e0] text-sm">{item.label}</span>
                    <span className={`text-xl font-bold ${item.color}`}>{item.value}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${item.bar} rounded-full`}
                      initial={{ width: 0 }}
                      whileInView={{ width: item.pct }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SceneSection>
  );
}
