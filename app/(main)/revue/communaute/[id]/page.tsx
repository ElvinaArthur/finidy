import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, GraduationCap, BookOpen, ShieldCheck,
  Briefcase, ExternalLink, Building, Globe,
} from "lucide-react";
import { MEMBRES_COMMUNAUTE } from "@/lib/communaute-scientifique";

export async function generateStaticParams() {
  return MEMBRES_COMMUNAUTE.map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const membre = MEMBRES_COMMUNAUTE.find((m) => m.id === id);
  if (!membre) return { title: "Membre introuvable | FINIDY Research Center" };
  return {
    title: `${membre.nom} | Communauté scientifique SAONTSY`,
    description: membre.biographie.slice(0, 160),
    openGraph: {
      title: membre.nom,
      description: membre.biographie.slice(0, 160),
      type: "profile" as const,
      url: `https://finidy.mg/revue/communaute/${id}`,
    },
    alternates: { canonical: `https://finidy.mg/revue/communaute/${id}` },
  };
}

export default async function MembreProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const membre = MEMBRES_COMMUNAUTE.find((m) => m.id === id);
  if (!membre) notFound();

  const totalPublications = membre.publications.length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: membre.nom,
    jobTitle: membre.titre,
    affiliation: { "@type": "Organization", name: membre.institution },
    description: membre.biographie,
    knowsAbout: membre.specialisations,
    ...(membre.orcid ? { identifier: { "@type": "PropertyValue", propertyID: "ORCID", value: membre.orcid } } : {}),
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Fil d'Ariane */}
      <nav className="flex items-center gap-2 text-sm font-body text-nihary-gris mb-8">
        <Link href="/revue" className="hover:text-nihary-or transition-colors">SAONTSY</Link>
        <span>/</span>
        <Link href="/revue/comite" className="hover:text-nihary-or transition-colors">Comité scientifique</Link>
        <span>/</span>
        <span className="text-nihary-brun truncate max-w-[14rem]">{membre.nom}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

        {/* ── Sidebar profil ───────────────────────────────────────── */}
        <aside className="space-y-5">

          {/* Photo + nom */}
          <div className="card p-6 text-center">
            <div className="w-28 h-28 rounded-full overflow-hidden mx-auto mb-4 border-4 border-nihary-or-pale">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={membre.photo}
                alt={membre.nom}
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="font-display font-bold text-nihary-ambre-fonce text-lg leading-snug mb-1">
              {membre.nom}
            </h1>
            <p className="text-xs font-body text-nihary-gris leading-snug">
              {membre.titre}
            </p>
          </div>

          {/* Institution */}
          <div className="card-sable p-4 space-y-2">
            <div className="flex items-start gap-2">
              <Building size={14} strokeWidth={1.75} className="text-nihary-or mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-mono text-nihary-gris uppercase tracking-wider mb-0.5">Institution</p>
                <p className="text-sm font-body font-medium text-nihary-ambre-fonce">{membre.institution}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Globe size={14} strokeWidth={1.75} className="text-nihary-or mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-mono text-nihary-gris uppercase tracking-wider mb-0.5">Pays</p>
                <p className="text-sm font-body font-medium text-nihary-ambre-fonce">{membre.pays}</p>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="card p-4 space-y-3">
            <h3 className="font-display font-semibold text-sm text-nihary-ambre-fonce">Contributions</h3>
            <div className="flex items-center gap-2 text-sm font-body text-nihary-gris">
              <ShieldCheck size={14} strokeWidth={1.75} className="text-nihary-or" />
              <span>{membre.articlesValides} articles évalués</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-body text-nihary-gris">
              <BookOpen size={14} strokeWidth={1.75} className="text-nihary-or" />
              <span>{totalPublications} publications référencées</span>
            </div>
          </div>

          {/* Disciplines */}
          <div className="card-sable p-4">
            <p className="text-xs font-mono text-nihary-gris uppercase tracking-wider mb-2">Disciplines</p>
            <div className="flex flex-wrap gap-1.5">
              {membre.disciplines.map((d) => (
                <span key={d} className="badge text-xs">{d}</span>
              ))}
            </div>
          </div>

          {/* ORCID */}
          {membre.orcid && (
            <a
              href={`https://orcid.org/${membre.orcid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost w-full justify-center text-sm"
            >
              <ExternalLink size={13} strokeWidth={1.75} />
              Profil ORCID
            </a>
          )}

          <Link href="/revue/comite" className="btn-ghost w-full justify-center text-sm">
            <ArrowLeft size={14} strokeWidth={1.75} />
            Retour au comité
          </Link>
        </aside>

        {/* ── Contenu principal ────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-10">

          {/* Biographie */}
          <section>
            <h2 className="font-display font-semibold text-xl text-nihary-ambre-fonce mb-4">
              Biographie
            </h2>
            <p className="font-body text-nihary-brun leading-relaxed text-[15px]">
              {membre.biographie}
            </p>
          </section>

          {/* Spécialisations */}
          <section>
            <h2 className="font-display font-semibold text-xl text-nihary-ambre-fonce mb-3">
              Spécialisations
            </h2>
            <div className="flex flex-wrap gap-2">
              {membre.specialisations.map((s) => (
                <span key={s} className="px-3 py-1 bg-nihary-sable border border-nihary-sable-fonce rounded-full text-sm font-body text-nihary-brun">
                  {s}
                </span>
              ))}
            </div>
          </section>

          {/* Parcours professionnel */}
          <section>
            <h2 className="font-display font-semibold text-xl text-nihary-ambre-fonce mb-4 flex items-center gap-2">
              <Briefcase size={18} strokeWidth={1.5} className="text-nihary-or" />
              Parcours professionnel
            </h2>
            <div className="space-y-4">
              {membre.parcours.map((p, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-nihary-or mt-1.5 flex-shrink-0" />
                    {i < membre.parcours.length - 1 && (
                      <div className="w-0.5 bg-nihary-sable-fonce flex-1 mt-1" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="text-xs font-mono text-nihary-gris mb-0.5">{p.annee}</p>
                    <p className="font-display font-semibold text-nihary-ambre-fonce text-sm">{p.poste}</p>
                    <p className="text-sm font-body text-nihary-gris">{p.institution}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Formation */}
          <section>
            <h2 className="font-display font-semibold text-xl text-nihary-ambre-fonce mb-4 flex items-center gap-2">
              <GraduationCap size={18} strokeWidth={1.5} className="text-nihary-or" />
              Formation académique
            </h2>
            <div className="space-y-3">
              {membre.formation.map((f, i) => (
                <div key={i} className="card-sable p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-display font-semibold text-nihary-ambre-fonce text-sm">{f.diplome}</p>
                      <p className="text-sm font-body text-nihary-gris mt-0.5">{f.institution}</p>
                    </div>
                    <span className="text-xs font-mono text-nihary-gris-clair flex-shrink-0">{f.annee}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Publications */}
          <section>
            <h2 className="font-display font-semibold text-xl text-nihary-ambre-fonce mb-4 flex items-center gap-2">
              <BookOpen size={18} strokeWidth={1.5} className="text-nihary-or" />
              Historique de publications
            </h2>
            <div className="space-y-4">
              {membre.publications.map((pub, i) => (
                <div key={i} className="card p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-mono text-nihary-or font-bold flex-shrink-0 mt-0.5">
                      {pub.annee}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-semibold text-nihary-ambre-fonce text-sm leading-snug mb-1">
                        {pub.titre}
                      </p>
                      <p className="text-xs font-body text-nihary-gris italic">{pub.revue}</p>
                      {pub.doi && (
                        <a
                          href={`https://doi.org/${pub.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-nihary-or hover:underline mt-1 font-mono"
                        >
                          <ExternalLink size={10} strokeWidth={2} />
                          {pub.doi}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Validation SAONTSY */}
          <section className="card-sable p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck size={20} strokeWidth={1.75} className="text-nihary-or flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-display font-semibold text-nihary-ambre-fonce mb-1">
                  Évaluateur·trice SAONTSY
                </h3>
                <p className="text-sm font-body text-nihary-brun leading-relaxed">
                  {membre.nom.split(' ').slice(-1)[0]} a évalué <strong>{membre.articlesValides} articles</strong> soumis à la revue SAONTSY dans le cadre du processus de révision en double aveugle.
                </p>
                <Link href="/revue/comite" className="mt-2 inline-flex items-center gap-1 text-xs text-nihary-or hover:underline font-body">
                  Voir le comité scientifique complet →
                </Link>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
