import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  Handshake,
  MessageSquareText,
  Plus,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import ConsultanceDirectory from "@/components/consultance/ConsultanceDirectory";

async function getExperts() {
  try {
    return await prisma.expertProfile.findMany({
      where: { disponible: true },
      include: { user: { select: { name: true, institution: true, image: true, bio: true } } },
      orderBy: [{ createdAt: "desc" }, { user: { name: "asc" } }],
    });
  } catch {
    return [];
  }
}

export const metadata = {
  title: "Experts & consultance | FINIDY Research Center",
  description: "Trouvez un expert en Sciences Humaines et Sociales pour vos études, évaluations, audits, formations et recherches appliquées à Madagascar et dans l'Océan Indien.",
  keywords: ["consultance SHS Madagascar", "expert sciences humaines", "étude d'impact", "évaluation de politiques publiques", "FINIDY consultance"],
  openGraph: {
    title: "Experts & consultance — FINIDY Research Center",
    description: "Des experts SHS vérifiés pour transformer une question complexe en décision éclairée.",
    type: "website" as const,
    url: "https://finidy.mg/consultance",
  },
  alternates: { canonical: "https://finidy.mg/consultance" },
};

const services = [
  { icon: ClipboardCheck, title: "Études & évaluations", text: "Diagnostics, études d’impact, enquêtes terrain et évaluation de politiques publiques." },
  { icon: BarChart3, title: "Conseil stratégique", text: "Analyse institutionnelle, gouvernance, transformation sociale et aide à la décision." },
  { icon: GraduationCap, title: "Formation & facilitation", text: "Ateliers sur mesure, renforcement de capacités, médiation et transfert de méthodes." },
];

export default async function ConsultancePage() {
  const experts = await getExperts();
  const expertiseCount = new Set(experts.flatMap((expert) => expert.specialites)).size;

  return (
    <main>
      <section className="border-b border-nihary-sable-fonce bg-nihary-gradient">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:px-8 lg:py-16">
          <div>
            <span className="eyebrow">Expertise appliquée · Madagascar & Océan Indien</span>
            <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-tight text-nihary-ambre-fonce sm:text-5xl">
              Les bonnes expertises pour prendre de meilleures décisions
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-nihary-brun sm:text-lg">
              FINIDY met votre organisation en relation avec des chercheurs et consultants en Sciences Humaines et Sociales, sélectionnés pour comprendre le terrain et produire des recommandations directement utilisables.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="#experts" className="btn-primary"><Search size={16} />Trouver un expert</Link>
              <Link href="/consultance/devis" className="btn-outline"><MessageSquareText size={16} />Décrire ma mission</Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-xs text-nihary-gris">
              <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-nihary-or" />Profils vérifiés</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-nihary-or" />Devis sans engagement</span>
              <span className="flex items-center gap-1.5"><Users size={14} className="text-nihary-or" />Accompagnement FINIDY</span>
            </div>
          </div>

          <div className="relative">
            <div className="card overflow-hidden p-6 sm:p-8">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-nihary-or">Un besoin, un parcours clair</p>
              <ol className="mt-6 space-y-5">
                {[
                  ["01", "Cadrez votre besoin", "Objectifs, livrables, calendrier et budget indicatif."],
                  ["02", "Comparez les expertises", "Profils, spécialités, expérience et ancrage territorial."],
                  ["03", "Lancez la mission", "Mise en relation et suivi dans un cadre professionnel."],
                ].map(([number, title, text]) => (
                  <li key={number} className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-nihary-or-pale font-mono text-xs font-semibold text-nihary-ambre">{number}</span>
                    <div><h2 className="font-display font-semibold text-nihary-ambre-fonce">{title}</h2><p className="mt-1 text-sm leading-6 text-nihary-gris">{text}</p></div>
                  </li>
                ))}
              </ol>
              <Link href="/consultance/devis" className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-nihary-or hover:underline">Recevoir une orientation <ArrowRight size={14} /></Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <section aria-labelledby="services-title" className="mb-14">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div><span className="eyebrow">Ce que vous pouvez confier</span><h2 id="services-title" className="mt-1 font-display text-2xl font-bold text-nihary-ambre-fonce">De la question au résultat exploitable</h2></div>
            <div className="flex gap-5 text-sm text-nihary-gris"><span><strong className="text-nihary-ambre-fonce">{experts.length}</strong> experts</span><span><strong className="text-nihary-ambre-fonce">{expertiseCount}</strong> expertises</span></div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {services.map(({ icon: Icon, title, text }) => (
              <article key={title} className="card p-6"><span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-nihary-or-pale text-nihary-ambre"><Icon size={20} /></span><h3 className="font-display text-lg font-semibold text-nihary-ambre-fonce">{title}</h3><p className="mt-2 text-sm leading-6 text-nihary-gris">{text}</p></article>
            ))}
          </div>
        </section>

        {experts.length === 0 ? (
          <div className="card-sable p-12 text-center"><Handshake className="mx-auto mb-4 text-nihary-or" size={44} /><h2 className="font-display text-xl font-semibold text-nihary-ambre-fonce">Le réseau d’experts est en cours de constitution</h2><p className="mt-2 text-nihary-gris">Proposez votre profil ou confiez-nous votre besoin pour une recherche ciblée.</p><div className="mt-6 flex flex-wrap justify-center gap-3"><Link href="/consultance/rejoindre" className="btn-primary"><Plus size={16} />Devenir expert</Link><Link href="/consultance/devis" className="btn-outline">Décrire une mission</Link></div></div>
        ) : (
          <ConsultanceDirectory experts={experts} />
        )}

        <section className="mt-14 rounded-xl bg-nihary-ambre-fonce px-6 py-8 text-white sm:px-9 sm:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div><p className="text-xs font-medium uppercase tracking-[0.18em] text-nihary-or-clair">Vous êtes consultant ou chercheur ?</p><h2 className="mt-2 font-display text-2xl font-semibold">Rejoignez un réseau dédié aux expertises SHS</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">Présentez clairement vos compétences, recevez des demandes qualifiées et rendez vos travaux utiles aux organisations.</p></div>
            <Link href="/consultance/rejoindre" className="btn-primary shrink-0"><Plus size={16} />Créer mon profil expert</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
