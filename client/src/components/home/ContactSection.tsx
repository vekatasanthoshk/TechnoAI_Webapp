import SceneSection from "@/components/scroll/SceneSection";
import KineticHeading from "@/components/scroll/KineticHeading";
import ContactForm from "./contact-form";

export default function ContactSection() {
  return (
    <SceneSection sceneId="contact" anchorId="contact">
      <div className="container">
        <div className="text-center mb-12">
          <p className="text-[#00C8B3] text-sm font-semibold uppercase tracking-widest mb-3">
            <span className="text-white/35 tabular-nums mr-3">07</span>Get In Touch
          </p>
          <KineticHeading
            text="Ready to Transform Your Business?"
            className="text-4xl md:text-5xl font-bold mb-4 text-white"
          />
          <p className="text-[#8a9abf] max-w-2xl mx-auto">
            Contact us today for a free consultation and discover how AI can drive your growth.
          </p>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="glass-panel-dark rounded-2xl p-8">
            <ContactForm variant="section" />
          </div>
        </div>
      </div>
    </SceneSection>
  );
}
