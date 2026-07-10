import { useSceneContext } from "@/components/scroll/SceneContext";

/** Opaque background so the fixed video stage doesn't bleed through. */
export default function Footer() {
  const { scrollToAnchor } = useSceneContext();

  return (
    <footer className="relative z-10 bg-[#030712] border-t border-white/10 py-12">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-1">
            <div className="mb-4">
              <p className="font-bold text-white text-lg">TechnoAI</p>
              <p className="text-[10px] text-[#8a9abf]">KVS TechnoAI LLC</p>
            </div>
            <p className="text-sm text-[#8a9abf]">Business Automation & AI Solutions</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-white mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-[#8a9abf]">
              {["Business Automation", "AI Agents", "Data Systems"].map((s) => (
                <li key={s}>
                  <button
                    onClick={() => scrollToAnchor("#services")}
                    className="hover:text-[#00C8B3] transition-colors"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-[#8a9abf]">
              {[
                { label: "About", href: "#about" },
                { label: "Portfolio", href: "#portfolio" },
                { label: "Contact", href: "#contact" },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => scrollToAnchor(item.href)}
                    className="hover:text-[#00C8B3] transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-[#8a9abf]">
              <li><a href="#" className="hover:text-[#00C8B3] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#00C8B3] transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center text-sm text-[#8a9abf]">
          <p>&copy; 2025 KVS TechnoAI LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
