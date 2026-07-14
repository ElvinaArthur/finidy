import Link from "next/link";
import Image from "next/image";
import { Users, BookOpen, UserCircle, ShieldCheck } from "lucide-react";
import { MEMBRES_COMMUNAUTE } from "@/lib/communaute-scientifique";

export const metadata = {
  title: "Comité scientifique — SAONTSY | FINIDY Research Center",
  description:
    "Membres du comité scientifique de SAONTSY — Revue FINIDY Research Center : chercheurs et experts évaluant les articles soumis en Sciences Humaines et Sociales.",
  openGraph: {
    title: "Comité scientifique — SAONTSY",
    description: "Chercheurs et experts du comité scientifique de la revue SAONTSY (FINIDY Research Center).",
    type: "website" as const,
    url: "https://finidy.mg/revue/comite",
  },
  alternates: { canonical: "https://finidy.mg/revue/comite" },
};

export default function ComiteScientifiquePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <span className="eyebrow">SAONTSY — Revue scientifique</span>
      <h1 className="font-display font-bold text-display-md text-nihary-ambre-fonce mt-1 mb-4">
        Comité scientifique
      </h1>
      <p className="text-nihary-gris font-body mb-8 max-w-2xl">
        Le comité scientifique de SAONTSY est composé de chercheurs et
        d'enseignants-chercheurs reconnus dans leurs disciplines. Il garantit la rigueur du
        processus de révision par les pairs.
      </p>

      <div className="divider-or" />

      <div className="mt-8 space-y-12">
        {/* Rôle */}
        <section>
          <h2 className="font-display font-semibold text-xl text-nihary-ambre-fonce mb-4 flex items-center gap-2">
            <ShieldCheck size={20} strokeWidth={1.5} className="text-nihary-or" />
            Rôle du comité
          </h2>
          <div className="prose-nihary text-nihary-brun">
            <p>
              Le comité scientifique est chargé de l'évaluation des soumissions à la Revue FINIDY Research Center
              selon un processus de révision en double aveugle. Ses missions incluent :
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-1 font-body text-nihary-brun">
              <li>L'évaluation de la qualité scientifique des articles soumis</li>
              <li>La vérification de la rigueur méthodologique</li>
              <li>La définition de la politique éditoriale de la revue</li>
              <li>La constitution des numéros thématiques</li>
              <li>La promotion de la revue dans les milieux académiques</li>
            </ul>
          </div>
        </section>

        {/* ── Communauté scientifique ─────────────────────────────────── */}
        <section>
          <h2 className="font-display font-semibold text-xl text-nihary-ambre-fonce mb-2 flex items-center gap-2">
            <Users size={20} strokeWidth={1.5} className="text-nihary-or" />
            Communauté scientifique
          </h2>
          <p className="text-sm font-body text-nihary-gris mb-6">
            Chercheurs et chercheuses membres de la communauté scientifique SAONTSY — FINIDY Research Center.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MEMBRES_COMMUNAUTE.map((membre) => (
              <Link
                key={membre.id}
                href={`/revue/communaute/${membre.id}`}
                className="card p-4 flex items-center gap-4 hover:border-nihary-or hover:shadow-nihary transition-all group"
              >
                <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-nihary-sable-fonce group-hover:border-nihary-or transition-colors">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={membre.photo}
                    alt={membre.nom}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-display font-semibold text-nihary-ambre-fonce text-sm leading-snug group-hover:text-nihary-or transition-colors truncate">
                    {membre.nom}
                  </p>
                  <p className="text-xs font-body text-nihary-gris leading-snug mt-0.5 line-clamp-2">
                    {membre.titre}
                  </p>
                  <p className="text-xs font-mono text-nihary-gris-clair mt-1 truncate">
                    {membre.institution}
                  </p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <ShieldCheck size={11} strokeWidth={2} className="text-nihary-or flex-shrink-0" />
                    <span className="text-xs font-body text-nihary-gris">
                      {membre.articlesValides} articles validés
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Disciplines */}
        <section>
          <h2 className="font-display font-semibold text-xl text-nihary-ambre-fonce mb-4">
            Disciplines couvertes
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              "Sociologie", "Anthropologie", "Histoire", "Géographie humaine",
              "Économie", "Droit", "Science politique", "Philosophie",
              "Psychologie sociale", "Sciences de l'éducation", "Linguistique",
              "Communication", "Démographie", "Études de genre",
              "Études malgaches", "Relations internationales",
            ].map((d) => (
              <span key={d} className="badge">{d}</span>
            ))}
          </div>
        </section>

        {/* Rejoindre */}
        <section>
          <h2 className="font-display font-semibold text-xl text-nihary-ambre-fonce mb-4 flex items-center gap-2">
            <BookOpen size={20} strokeWidth={1.5} className="text-nihary-or" />
            Rejoindre le comité
          </h2>
          <div className="card-sable p-6">
            <p className="text-nihary-brun font-body mb-4">
              FINIDY Research Center enrichit régulièrement sa communauté scientifique. Si vous êtes
              chercheur·e ou enseignant·e-chercheur·e en SHS et souhaitez contribuer à
              l'évaluation des travaux soumis, nous vous invitons à nous contacter.
            </p>
            <a href="mailto:revue@finidy.mg" className="btn-primary">
              Candidater au comité
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
