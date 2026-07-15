import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMotionValueEvent, useScroll } from "framer-motion";
import TechnoAILogo from "@/components/TechnoAILogo";
import { useSceneContext } from "@/components/scroll/SceneContext";

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "AI eCommerce", href: "#ecommerce" },
  { label: "Contact", href: "#contact" },
];

export default function NavBar({ onBookConsultation }: { onBookConsultation: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollToAnchor } = useSceneContext();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 80));

  const go = (href: string) => {
    scrollToAnchor(href);
    setMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 z-50 w-full border-b transition-colors duration-300 ${
        scrolled
          ? "glass-panel-dark border-white/10"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between gap-4 h-16">
        <div className="flex items-center gap-3 shrink-0">
          <TechnoAILogo size={40} />
          <div className="hidden sm:block whitespace-nowrap">
            <span className="font-bold text-lg text-white leading-tight">TechnoAI</span>
            <p className="text-[10px] text-[#8a9abf] leading-none">KVS TechnoAI LLC</p>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm text-[#aab8e0]">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => go(item.href)}
              className="focus-ring whitespace-nowrap hover:text-[#00C8B3] transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="hidden lg:flex shrink-0">
          <Button
            size="sm"
            className="brand-gradient text-white hover:opacity-90 border-0 whitespace-nowrap"
            onClick={onBookConsultation}
          >
            Book Consultation
          </Button>
        </div>
        <button
          className="focus-ring lg:hidden p-2 text-[#aab8e0]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel-dark border-b border-white/10">
          <div className="container py-4 flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => go(item.href)}
                className="focus-ring text-left text-sm text-[#aab8e0] hover:text-[#00C8B3] transition-colors"
              >
                {item.label}
              </button>
            ))}
            <Button
              size="sm"
              className="brand-gradient text-white border-0 w-full"
              onClick={() => {
                setMobileMenuOpen(false);
                onBookConsultation();
              }}
            >
              Book Consultation
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
