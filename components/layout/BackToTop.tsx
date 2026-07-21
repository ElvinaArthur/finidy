"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setVisible(window.scrollY > 520);
          ticking = false;
        });
        ticking = true;
      }
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  function scrollToTop() {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Retour en haut de la page"
      title="Retour en haut"
      tabIndex={visible ? 0 : -1}
      style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
      className={`fixed right-4 z-40 inline-flex min-h-12 min-w-12 items-center justify-center gap-2 rounded-full border border-nihary-or/40 bg-nihary-ambre-fonce px-3 text-sm font-medium text-white shadow-nihary-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-nihary-ambre focus:outline-none focus:ring-2 focus:ring-nihary-or focus:ring-offset-2 sm:right-6 sm:px-4 ${visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
    >
      <ArrowUp size={19} aria-hidden="true" />
      <span className="hidden sm:inline">Retour en haut</span>
    </button>
  );
}
