"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Banknote,
  BriefcaseBusiness,
  Building2,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";

export type DirectoryExpert = {
  id: string;
  titre: string;
  specialites: string[];
  tarifHeure: number | null;
  ville: string | null;
  user: {
    name: string | null;
    institution: string | null;
    image: string | null;
    bio: string | null;
  };
};

type SortMode = "pertinence" | "tarif-asc" | "tarif-desc" | "nom";

const normalize = (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function relevanceScore(expert: DirectoryExpert, query: string) {
  if (!query.trim()) return 0;
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  const fields = [
    [expert.user.name || "", 7],
    [expert.titre, 6],
    [expert.specialites.join(" "), 5],
    [expert.user.institution || "", 3],
    [expert.ville || "", 2],
    [expert.user.bio || "", 1],
  ] as const;

  return terms.reduce(
    (score, term) => score + fields.reduce((sum, [value, weight]) => sum + (normalize(value).includes(term) ? weight : 0), 0),
    0,
  );
}

export default function ConsultanceDirectory({ experts }: { experts: DirectoryExpert[] }) {
  const [query, setQuery] = useState("");
  const [specialite, setSpecialite] = useState("");
  const [ville, setVille] = useState("");
  const [maxTarif, setMaxTarif] = useState("");
  const [sort, setSort] = useState<SortMode>("pertinence");

  const specialites = useMemo(
    () => Array.from(new Set(experts.flatMap((expert) => expert.specialites))).sort((a, b) => a.localeCompare(b, "fr")),
    [experts],
  );
  const villes = useMemo(
    () => Array.from(new Set(experts.map((expert) => expert.ville).filter((value): value is string => Boolean(value)))).sort(),
    [experts],
  );

  const results = useMemo(() => {
    const ceiling = Number(maxTarif);
    return experts
      .map((expert) => ({ expert, score: relevanceScore(expert, query) }))
      .filter(({ expert, score }) => {
        if (query.trim() && score === 0) return false;
        if (specialite && !expert.specialites.includes(specialite)) return false;
        if (ville && expert.ville !== ville) return false;
        if (maxTarif && (!expert.tarifHeure || expert.tarifHeure > ceiling)) return false;
        return true;
      })
      .sort((a, b) => {
        if (sort === "tarif-asc") return (a.expert.tarifHeure ?? Infinity) - (b.expert.tarifHeure ?? Infinity);
        if (sort === "tarif-desc") return (b.expert.tarifHeure ?? -1) - (a.expert.tarifHeure ?? -1);
        if (sort === "nom") return (a.expert.user.name || "").localeCompare(b.expert.user.name || "", "fr");
        return b.score - a.score;
      })
      .map(({ expert }) => expert);
  }, [experts, maxTarif, query, sort, specialite, ville]);

  const hasFilters = Boolean(query || specialite || ville || maxTarif);
  const reset = () => {
    setQuery("");
    setSpecialite("");
    setVille("");
    setMaxTarif("");
    setSort("pertinence");
  };

  return (
    <section id="experts" className="scroll-mt-24">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="eyebrow">Annuaire vérifié</span>
          <h2 className="mt-1 font-display text-2xl font-bold text-nihary-ambre-fonce">Trouvez le bon profil pour votre mission</h2>
        </div>
        <p className="text-sm text-nihary-gris">{results.length} expert{results.length !== 1 ? "s" : ""} disponible{results.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="card mb-6 p-4 sm:p-5">
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-nihary-gris" size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="input py-3 pl-11"
            placeholder="Compétence, mission, expert ou institution…"
            aria-label="Rechercher un expert"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <select className="input" value={specialite} onChange={(event) => setSpecialite(event.target.value)} aria-label="Spécialité">
            <option value="">Toutes les spécialités</option>
            {specialites.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select className="input" value={ville} onChange={(event) => setVille(event.target.value)} aria-label="Ville">
            <option value="">Toutes les villes</option>
            {villes.map((item) => <option key={item}>{item}</option>)}
          </select>
          <input className="input" type="number" min="0" value={maxTarif} onChange={(event) => setMaxTarif(event.target.value)} placeholder="Tarif max. / heure" aria-label="Tarif horaire maximum" />
          <select className="input" value={sort} onChange={(event) => setSort(event.target.value as SortMode)} aria-label="Trier les résultats">
            <option value="pertinence">Plus pertinents</option>
            <option value="tarif-asc">Tarif croissant</option>
            <option value="tarif-desc">Tarif décroissant</option>
            <option value="nom">Nom A–Z</option>
          </select>
          <button onClick={reset} disabled={!hasFilters} className="btn-ghost justify-center disabled:cursor-not-allowed disabled:opacity-40">
            <X size={15} /> Effacer
          </button>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="card-sable p-10 text-center">
          <SlidersHorizontal className="mx-auto mb-3 text-nihary-or" size={32} />
          <h3 className="font-display text-lg font-semibold text-nihary-ambre-fonce">Aucun profil ne correspond exactement</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-nihary-gris">Élargissez vos filtres ou décrivez votre mission : FINIDY peut identifier un profil dans son réseau.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button onClick={reset} className="btn-outline">Réinitialiser</button>
            <Link href="/consultance/devis" className="btn-primary">Confier la recherche à FINIDY</Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {results.map((expert) => (
            <article key={expert.id} className="card group flex h-full flex-col overflow-hidden">
              <Link href={`/consultance/${expert.id}`} className="relative block h-48 overflow-hidden bg-nihary-sable">
                {expert.user.image ? (
                  <Image src={expert.user.image} alt={expert.user.name || "Expert FINIDY"} fill className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]" sizes="(max-width: 768px) 100vw, 33vw" />
                ) : (
                  <div className="flex h-full items-center justify-center font-display text-5xl font-bold text-nihary-ambre">{expert.user.name?.charAt(0) || "?"}</div>
                )}
                <span className="absolute left-4 top-4 rounded-full bg-emerald-50/95 px-3 py-1 text-xs font-medium text-emerald-800 shadow-sm">Disponible</span>
              </Link>
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-3">
                  <Link href={`/consultance/${expert.id}`} className="font-display text-lg font-semibold text-nihary-ambre-fonce hover:text-nihary-or">{expert.user.name}</Link>
                  <p className="mt-1 line-clamp-2 text-sm leading-5 text-nihary-brun">{expert.titre}</p>
                </div>
                {expert.user.institution && <p className="mb-4 flex items-start gap-1.5 text-xs leading-5 text-nihary-gris"><Building2 className="mt-0.5 shrink-0" size={13} />{expert.user.institution}</p>}
                <div className="mb-5 flex flex-wrap gap-1.5">
                  {expert.specialites.slice(0, 3).map((item) => <span key={item} className="badge">{item}</span>)}
                  {expert.specialites.length > 3 && <span className="badge">+{expert.specialites.length - 3}</span>}
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-nihary-sable-fonce pt-4 text-xs text-nihary-gris">
                  <span className="flex items-center gap-1"><MapPin size={13} />{expert.ville || "À distance"}</span>
                  {expert.tarifHeure && <span className="flex items-center gap-1 font-medium text-nihary-brun"><Banknote size={13} />{expert.tarifHeure.toLocaleString("fr-FR")} Ar/h</span>}
                </div>
                <Link href={`/consultance/${expert.id}`} className="btn-outline mt-4 w-full justify-center">Voir le profil <ArrowRight size={14} /></Link>
              </div>
            </article>
          ))}
        </div>
      )}

      <aside className="mt-8 overflow-hidden rounded-xl border border-nihary-sable-fonce bg-white" aria-label="Espace partenaire">
        <div className="grid md:grid-cols-[1fr_auto] md:items-center">
          <div className="p-6 sm:p-7">
            <div className="mb-2 flex items-center gap-2"><Sparkles size={15} className="text-nihary-or" /><span className="text-[11px] font-medium uppercase tracking-[0.18em] text-nihary-gris">Espace partenaire</span></div>
            <h3 className="font-display text-xl font-semibold text-nihary-ambre-fonce">Votre organisation accompagne la recherche et l’expertise ?</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-nihary-gris">Présentez une solution, un programme ou une marque utile aux chercheurs et décideurs, dans un format sobre, identifié et validé par FINIDY.</p>
          </div>
          <div className="border-t border-nihary-sable-fonce p-6 md:border-l md:border-t-0">
            <Link href="/contact" className="btn-outline whitespace-nowrap"><BriefcaseBusiness size={15} />Devenir partenaire</Link>
          </div>
        </div>
      </aside>
    </section>
  );
}
