"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { PILIERS } from "@/lib/piliers";

const PILIER_LINKS: Record<string, { label: string; href: string }[]> = {
  revue: [
    { label: "Tous les articles", href: "/revue" },
    { label: "Soumettre un article", href: "/revue/soumettre" },
    { label: "Comité scientifique", href: "/revue/comite" },
  ],
  consultance: [
    { label: "Trouver un expert", href: "/consultance" },
    { label: "Offres de recherche", href: "/consultance/offres" },
    { label: "Devenir expert", href: "/consultance/rejoindre" },
    { label: "Demander un devis", href: "/consultance/devis" },
  ],
  magazine: [
    { label: "Tous les articles", href: "/magazine" },
    { label: "Proposer un article", href: "/magazine/proposer" },
  ],
  entretiens: [
    { label: "Tous les entretiens", href: "/entretiens" },
    { label: "Podcasts", href: "/entretiens?format=PODCAST" },
    { label: "Vidéos", href: "/entretiens?format=VIDEO" },
  ],
  editions: [
    { label: "Catalogue", href: "/editions" },
    { label: "Soumettre un manuscrit", href: "/editions/soumettre" },
  ],
  colloques: [
    { label: "Événements à venir", href: "/colloques" },
    { label: "Call for Papers", href: "/colloques/appel" },
    { label: "Actes & Proceedings", href: "/colloques/actes" },
  ],
  "universite-populaire": [
    { label: "Tous les cours", href: "/universite-populaire" },
    { label: "Sessions live", href: "/universite-populaire/live" },
    { label: "Proposer un cours", href: "/universite-populaire/enseigner" },
  ],
};

export default function MegaMenu() {
  const [open, setOpen] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Ferme sur clic extérieur
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpen(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(null), 120);
  };

  const openMenu = (id: string) => {
    cancelClose();
    setOpen(id);
  };

  return (
    <nav ref={navRef} className="hidden xl:flex items-center gap-1">
      {PILIERS.map((pilier) => {
        const Icon = pilier.icon;
        const links = PILIER_LINKS[pilier.id] || [];
        const isOpen = open === pilier.id;

        return (
          <div
            key={pilier.id}
            className="relative"
            onMouseEnter={() => openMenu(pilier.id)}
            onMouseLeave={scheduleClose}
          >
            <button
              onClick={() => (isOpen ? setOpen(null) : openMenu(pilier.id))}
              className={`flex items-center gap-1 px-2.5 py-2 rounded-nihary text-sm font-body font-medium
                whitespace-nowrap transition-colors duration-150 select-none
                ${isOpen
                  ? "text-nihary-or bg-nihary-sable"
                  : "text-nihary-brun hover:text-nihary-or hover:bg-nihary-sable"
                }`}
            >
              {pilier.label}
              <ChevronDown
                size={14}
                strokeWidth={2}
                className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Pont invisible qui comble le gap entre le bouton et le dropdown */}
            {isOpen && (
              <div className="absolute top-full left-0 w-full h-2" />
            )}

            {isOpen && (
              <div
                className="absolute top-[calc(100%+4px)] left-0 w-64 bg-white border border-nihary-sable-fonce
                  rounded-lg shadow-nihary-lg z-50 overflow-hidden"
              >
                {/* En-tête pilier */}
                <div className="p-3 bg-nihary-sable border-b border-nihary-sable-fonce">
                  <Link
                    href={pilier.href}
                    onClick={() => setOpen(null)}
                    className="flex items-center gap-2 font-display font-semibold text-nihary-ambre-fonce
                      text-base hover:text-nihary-or transition-colors"
                  >
                    <Icon size={18} strokeWidth={1.75} />
                    {pilier.label}
                  </Link>
                  <p className="text-xs text-nihary-gris font-body mt-0.5 leading-snug">
                    {pilier.description}
                  </p>
                </div>

                {/* Sous-liens */}
                <div className="py-1">
                  {links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(null)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-body text-nihary-brun
                        hover:bg-nihary-sable hover:text-nihary-or transition-colors duration-100"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-nihary-or flex-shrink-0" />
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
