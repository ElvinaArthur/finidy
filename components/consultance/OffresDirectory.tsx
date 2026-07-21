"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, BriefcaseBusiness, CalendarDays, Clock3, MapPin, Search, SlidersHorizontal } from "lucide-react";
import { OFFRE_TYPE_LABELS, type Offre, type OffreType } from "@/lib/offres";

export default function OffresDirectory({ offres }: { offres: Offre[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("TOUS");
  const [mode, setMode] = useState("TOUS");
  const filtered = useMemo(() => offres.filter((offre) => (type === "TOUS" || offre.type === type) && (mode === "TOUS" || offre.mode === mode) && `${offre.titre} ${offre.organisation} ${offre.domaine} ${offre.lieu} ${offre.competences.join(" ")}`.toLowerCase().includes(query.toLowerCase())), [offres, query, type, mode]);
  return <section id="offres" className="scroll-mt-24">
    <div className="card mb-7 grid gap-4 p-5 md:grid-cols-[1fr_220px_190px]">
      <label className="relative"><Search className="absolute left-3 top-3 text-nihary-gris" size={17} /><input className="input pl-10" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Métier, domaine, organisation ou lieu…" /></label>
      <label className="relative"><SlidersHorizontal className="absolute left-3 top-3 text-nihary-gris" size={16} /><select className="input pl-10" value={type} onChange={(event) => setType(event.target.value)}><option value="TOUS">Tous les types</option>{Object.entries(OFFRE_TYPE_LABELS).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
      <select aria-label="Mode de travail" className="input" value={mode} onChange={(event) => setMode(event.target.value)}><option value="TOUS">Tous les modes</option><option>Présentiel</option><option>Hybride</option><option>À distance</option></select>
    </div>
    <div className="mb-5 flex items-end justify-between gap-4"><div><span className="eyebrow">Opportunités ouvertes</span><h2 className="mt-1 font-display text-2xl font-bold">{filtered.length} offre{filtered.length > 1 ? "s" : ""} à découvrir</h2></div><p className="hidden text-xs text-nihary-gris sm:block">Triées par publication récente</p></div>
    {filtered.length ? <div className="grid gap-5 lg:grid-cols-2">{filtered.map((offre) => <article className="card group overflow-hidden" key={offre.slug}><div className="grid h-full sm:grid-cols-[170px_1fr]"><Link href={`/consultance/offres/${offre.slug}`} className="relative min-h-44 overflow-hidden bg-nihary-sable"><Image src={offre.image} alt="" fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="170px" /><div className="absolute inset-0 bg-gradient-to-t from-nihary-ambre-fonce/50 to-transparent" /></Link><div className="flex flex-col p-5"><div className="flex flex-wrap items-center gap-2"><span className="badge">{OFFRE_TYPE_LABELS[offre.type as OffreType]}</span><span className="text-xs text-nihary-gris">{offre.domaine}</span></div><h3 className="mt-3 font-display text-xl font-semibold leading-snug text-nihary-ambre-fonce"><Link href={`/consultance/offres/${offre.slug}`} className="hover:text-nihary-or">{offre.titre}</Link></h3><p className="mt-1 text-sm font-medium">{offre.organisation}</p><p className="mt-3 line-clamp-2 text-sm leading-6 text-nihary-gris">{offre.resume}</p><div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-nihary-gris"><span className="flex items-center gap-1"><MapPin size={13} />{offre.lieu}</span><span className="flex items-center gap-1"><BriefcaseBusiness size={13} />{offre.mode}</span><span className="flex items-center gap-1"><CalendarDays size={13} />Avant le {new Date(offre.dateLimite).toLocaleDateString("fr-FR")}</span></div><Link href={`/consultance/offres/${offre.slug}`} className="mt-5 inline-flex items-center gap-1 self-start text-sm font-medium text-nihary-or">Voir l’offre <ArrowRight size={14} /></Link></div></div></article>)}</div> : <div className="card-sable p-12 text-center"><Clock3 className="mx-auto mb-3 text-nihary-or" size={36} /><h3 className="font-display text-xl font-semibold">Aucune offre ne correspond à ces critères</h3><button className="btn-outline mt-5" onClick={() => { setQuery(""); setType("TOUS"); setMode("TOUS"); }}>Réinitialiser les filtres</button></div>}
  </section>;
}
