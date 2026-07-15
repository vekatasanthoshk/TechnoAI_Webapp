import { Shield, TrendingUp, Users } from "lucide-react";
import SceneSection from "@/components/scroll/SceneSection";
import KineticHeading from "@/components/scroll/KineticHeading";
import TechnoAILogo from "@/components/TechnoAILogo";

const FEATURES = [
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Enterprise-Grade Security",
    desc: "All solutions comply with industry standards and best practices.",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Expert Team",
    desc: "Dedicated professionals with proven track records in AI implementation.",
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: "Proven Results",
    desc: "Measurable improvements in efficiency, revenue, and customer satisfaction.",
  },
];

const TAGS = [
  { text: "AI Automation", cls: "bg-[rgba(41,98,255,0.12)] text-[#4d8dff] border-[rgba(41,98,255,0.3)]" },
  { text: "ML & NLP", cls: "bg-[rgba(0,200,179,0.1)] text-[#00C8B3] border-[rgba(0,200,179,0.3)]" },
  { text: "Growth", cls: "bg-[rgba(0,203,83,0.1)] text-[#3ddc78] border-[rgba(0,203,83,0.3)]" },
];

export default function AboutSection() {
  return (
    <SceneSection sceneId="about" anchorId="about">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[#00C8B3] text-sm font-semibold uppercase tracking-widest mb-3">
              <span className="text-white/35 tabular-nums mr-3">05</span>Who We Are
            </p>
            <KineticHeading
              text="About TechnoAI"
              className="text-4xl md:text-5xl font-bold mb-6 text-white"
            />
            <p className="text-[#8a9abf] mb-4 leading-relaxed">
              We are a team of AI specialists, engineers, and business strategists dedicated to transforming
              enterprises through intelligent automation and data-driven solutions.
            </p>
            <p className="text-[#8a9abf] mb-8 leading-relaxed">
              With deep expertise in machine learning, natural language processing, and enterprise software,
              we deliver solutions that create measurable impact on your bottom line.
            </p>
            <div className="space-y-5">
              {FEATURES.map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-[rgba(41,98,255,0.15)] text-[#4d8dff] flex-shrink-0 mt-0.5">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-white">{item.title}</h4>
                    <p className="text-sm text-[#8a9abf]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-panel-dark rounded-2xl p-10 flex flex-col items-center justify-center min-h-80 text-center">
            <TechnoAILogo size={112} className="mx-auto mb-5 drop-shadow-[0_0_28px_rgba(41,98,255,0.45)]" />
            <p className="brand-gradient-text text-3xl font-bold mb-2">TechnoAI</p>
            <p className="font-bold text-lg text-white">KVS TechnoAI LLC</p>
            <p className="text-[#8a9abf] text-sm mt-1">Business Automation & AI Solutions</p>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {TAGS.map((tag) => (
                <span key={tag.text} className={`px-3 py-1 rounded-full text-xs border ${tag.cls}`}>
                  {tag.text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SceneSection>
  );
}
