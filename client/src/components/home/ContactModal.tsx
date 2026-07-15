import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import ContactForm from "./contact-form";

export default function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (!panelRef.current?.contains(e.target as Node)) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="consultation-title"
        className="glass-panel-dark bg-[#0a1330]/90 rounded-2xl max-w-md w-full p-7 relative shadow-2xl max-h-[90vh] overflow-y-auto overscroll-contain"
      >
        <button
          onClick={onClose}
          className="focus-ring absolute top-4 right-4 text-[#8a9abf] hover:text-white transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="mb-6">
          <h3 id="consultation-title" className="text-2xl font-bold text-white">
            Book a Consultation
          </h3>
          <p className="text-[#8a9abf] text-sm mt-1">
            Pick a date and time slot — we'll confirm your appointment within 24 hours.
          </p>
        </div>
        <ContactForm variant="modal" onSuccess={onClose} />
      </div>
    </div>
  );
}
