import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Banknote,
  Building2,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

async function getExpert(id: string) {
  try {
    return await prisma.expertProfile.findUnique({
      where: { id, disponible: true },
      include: { user: { select: { name: true, institution: true, bio: true, image: true, discipline: true } } },
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const expert = await getExpert(id);
  if (!expert) return { title: "Expert introuvable | FINIDY Research Center" };
  return {
    title: `${expert.user.name} — ${expert.titre} | Consultance FINIDY`,
    description: expert.user.bio?.slice(0, 160) || `Consultez le profil et les expertises de ${expert.user.name}.`,
    openGraph: { title: `${expert.user.name} | Consultance FINIDY`, description: expert.titre, images: expert.user.image ? [expert.user.image] : [] },
  };
}

export default async function ExpertProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const expert = await getExpert(id);
  if (!expert) notFound();

  const firstName = expert.user.name?.split(" ")[0] || "cet expert";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: expert.user.name,
    image: expert.user.image ? `https://finidy.mg${expert.user.image}` : undefined,
    jobTitle: expert.titre,
    affiliation: expert.user.institution ? { "@type": "Organization", name: expert.user.institution } : undefined,
    knowsAbout: expert.specialites,
    url: `https://finidy.mg/consultance/${expert.id}`,
  };

  return (
    <main className="min-h-screen bg-nihary-ecru">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="border-b border-nihary-sable-fonce bg-nihary-gradient">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <Link href="/consultance#experts" className="mb-7 inline-flex items-center gap-2 text-sm text-nihary-gris hover:text-nihary-or"><ArrowLeft size={15} />Retour aux experts</Link>
          <div className="grid gap-7 sm:grid-cols-[160px_1fr] sm:items-center">
            <div className="relative h-48 w-40 overflow-hidden rounded-xl border-4 border-white bg-nihary-sable shadow-nihary-md sm:h-52 sm:w-44">
              {expert.user.image ? <Image src={expert.user.image} alt={expert.user.name || "Expert FINIDY"} fill priority className="object-cover object-top" sizes="176px" /> : <div className="flex h-full items-center justify-center font-display text-6xl font-bold text-nihary-ambre">{expert.user.name?.charAt(0) || "?"}</div>}
            </div>
            <div>
              <div className="mb-3 flex flex-wrap gap-2"><span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800"><CheckCircle2 size={13} />Disponible pour une mission</span><span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-nihary-ambre shadow-sm"><ShieldCheck size={13} />Profil FINIDY</span></div>
              <h1 className="font-display text-3xl font-bold text-nihary-ambre-fonce sm:text-4xl">{expert.user.name}</h1>
              <p className="mt-2 max-w-3xl text-lg leading-7 text-nihary-brun">{expert.titre}</p>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-nihary-gris">
                {expert.user.institution && <span className="flex items-center gap-1.5"><Building2 size={15} />{expert.user.institution}</span>}
                {expert.ville && <span className="flex items-center gap-1.5"><MapPin size={15} />{expert.ville}</span>}
                {expert.tarifHeure && <span className="flex items-center gap-1.5"><Banknote size={15} />À partir de {expert.tarifHeure.toLocaleString("fr-FR")} Ar/heure</span>}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        <div className="space-y-6">
          <section className="card p-6 sm:p-8">
            <span className="eyebrow">Profil professionnel</span>
            <h2 className="mt-1 font-display text-2xl font-semibold text-nihary-ambre-fonce">À propos</h2>
            <p className="mt-4 whitespace-pre-line text-[15px] leading-7 text-nihary-brun">{expert.user.bio || `${expert.user.name} intervient sur des missions de conseil, d’étude et de recherche appliquée dans ses domaines de spécialité.`}</p>
          </section>

          <section className="card p-6 sm:p-8">
            <span className="eyebrow">Domaines d’intervention</span>
            <h2 className="mt-1 font-display text-2xl font-semibold text-nihary-ambre-fonce">Expertises</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {expert.specialites.map((specialite) => <div key={specialite} className="flex items-center gap-3 rounded-lg border border-nihary-sable-fonce bg-nihary-ecru p-3.5 text-sm font-medium text-nihary-brun"><CheckCircle2 className="shrink-0 text-nihary-or" size={17} />{specialite}</div>)}
            </div>
          </section>

          <section className="card p-6 sm:p-8">
            <span className="eyebrow">Formats de mission</span>
            <h2 className="mt-1 font-display text-2xl font-semibold text-nihary-ambre-fonce">Ce que vous pouvez demander</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-3">
              {[
                ["Diagnostic", "Cadrage, analyse du contexte et recommandations opérationnelles."],
                ["Étude", "Collecte de données, analyse rigoureuse et rapport structuré."],
                ["Accompagnement", "Conseil, formation ou facilitation selon vos objectifs."],
              ].map(([title, text], index) => <div key={title}><span className="font-mono text-xs text-nihary-or">0{index + 1}</span><h3 className="mt-2 font-display font-semibold text-nihary-ambre-fonce">{title}</h3><p className="mt-1 text-sm leading-6 text-nihary-gris">{text}</p></div>)}
            </div>
          </section>

          {expert.cvUrl && <section className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-nihary-or-pale text-nihary-ambre"><FileText size={19} /></span><div><h2 className="font-display font-semibold text-nihary-ambre-fonce">Parcours professionnel</h2><p className="text-xs text-nihary-gris">Consultez les expériences et références détaillées.</p></div></div><a href={expert.cvUrl} target="_blank" rel="noopener noreferrer" className="btn-outline justify-center">Voir le CV</a></section>}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-nihary-or">Demander une proposition</p>
            <h2 className="mt-2 font-display text-xl font-semibold text-nihary-ambre-fonce">Parlez de votre mission à {firstName}</h2>
            <p className="mt-2 text-sm leading-6 text-nihary-gris">Précisez le contexte, les résultats attendus, le calendrier et votre budget indicatif.</p>
            <Link href={`/consultance/devis?expertId=${expert.id}`} className="btn-primary mt-5 w-full justify-center"><Send size={16} />Demander un devis</Link>
            <div className="mt-5 space-y-3 border-t border-nihary-sable-fonce pt-5 text-xs text-nihary-gris"><p className="flex items-center gap-2"><Clock3 size={14} className="text-nihary-or" />Demande transmise directement</p><p className="flex items-center gap-2"><ShieldCheck size={14} className="text-nihary-or" />Coordonnées protégées</p><p className="flex items-center gap-2"><CheckCircle2 size={14} className="text-nihary-or" />Sans engagement</p></div>
          </div>

          <div className="card-sable p-5">
            <div className="flex items-center gap-2"><Sparkles size={15} className="text-nihary-or" /><h2 className="font-display font-semibold text-nihary-ambre-fonce">Besoin d’une équipe ?</h2></div>
            <p className="mt-2 text-sm leading-6 text-nihary-gris">FINIDY peut réunir plusieurs disciplines autour d’une mission complexe.</p>
            <Link href="/consultance/devis" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-nihary-or hover:underline">Demander un accompagnement <Send size={13} /></Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
