import { redirect } from "next/navigation";
import Link from "next/link";
import {
  User,
  FileText,
  BookOpen,
  Mic,
  GraduationCap,
  PenLine,
  Settings,
  Plus,
  Clock,
} from "lucide-react";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import EditorialRequestsPanel from "@/components/dashboard/EditorialRequestsPanel";

async function getDashboardData(userId: string) {
  try {
    const [user, articlesRevue, articlesMagazine, entretiens, livres, cours, inscriptions, editorialRequests, notifications] =
      await Promise.all([
        prisma.user.findUnique({ where: { id: userId } }),
        prisma.articleRevue.findMany({
          where: { auteurId: userId },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: { id: true, titre: true, statut: true, createdAt: true },
        }),
        prisma.article.findMany({
          where: { auteurId: userId },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: { id: true, titre: true, slug: true, statut: true, createdAt: true },
        }),
        prisma.entretien.findMany({
          where: { auteurId: userId },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: { id: true, titre: true, slug: true, statut: true, createdAt: true },
        }),
        prisma.livre.findMany({
          where: { auteurId: userId },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: { id: true, titre: true, slug: true, statut: true, createdAt: true },
        }),
        prisma.cours.findMany({
          where: { formateurId: userId },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: { id: true, titre: true, slug: true, statut: true, createdAt: true },
        }),
        prisma.inscription.findMany({
          where: { userId },
          include: { cours: { select: { titre: true, slug: true } } },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
        prisma.editorialRequest.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 20, select: { id: true, contentTitle: true, kind: true, statut: true, message: true, response: true, createdAt: true } }),
        prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 8 }),
      ]);
    return { user, articlesRevue, articlesMagazine, entretiens, livres, cours, inscriptions, editorialRequests, notifications };
  } catch {
    return null;
  }
}

const STATUT_COLOR: Record<string, string> = {
  PUBLIE: "text-green-700 bg-green-50",
  ACCEPTE: "text-blue-700 bg-blue-50",
  EN_REVISION: "text-yellow-700 bg-yellow-50",
  EN_ATTENTE: "text-nihary-ambre bg-nihary-or-pale",
  BROUILLON: "text-nihary-gris bg-nihary-sable",
  REJETE: "text-red-700 bg-red-50",
};

const STATUT_LABELS: Record<string, string> = {
  PUBLIE: "Publié",
  ACCEPTE: "Accepté",
  EN_REVISION: "En révision",
  EN_ATTENTE: "En attente",
  BROUILLON: "Brouillon",
  REJETE: "Rejeté",
};

function StatutBadge({ statut }: { statut: string }) {
  return (
    <span
      className={`text-xs font-mono px-2 py-0.5 rounded-full ${STATUT_COLOR[statut] ?? "text-nihary-gris bg-nihary-sable"}`}
    >
      {STATUT_LABELS[statut] ?? statut}
    </span>
  );
}

function fmt(d: Date) {
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/connexion?callbackUrl=/dashboard");

  const data = await getDashboardData(session.user.id);
  if (!data?.user) redirect("/auth/connexion");

  const { user, articlesRevue, articlesMagazine, entretiens, livres, cours, inscriptions, editorialRequests, notifications } = data;
  const isAdmin = (user as any).role === "ADMIN";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="eyebrow">Mon espace</span>
          <h1 className="font-display font-bold text-display-md text-nihary-ambre-fonce mt-1">
            Bonjour, {user.name?.split(" ")[0] ?? "chercheur·e"} !
          </h1>
          <p className="text-nihary-gris font-body mt-1 text-sm">
            {user.email} · {user.institution ?? "Institution non renseignée"}
          </p>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <Link href="/admin" className="btn-outline text-xs !py-2">
              Administration
            </Link>
          )}
          <Link href="/dashboard/profil" className="btn-ghost text-xs">
            <Settings size={14} strokeWidth={1.75} />
            Mon profil
          </Link>
        </div>
      </div>

      {/* Compteurs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {[
          { label: "Articles revue", count: articlesRevue.length, icon: FileText, href: "/revue/soumettre" },
          { label: "Articles magazine", count: articlesMagazine.length, icon: PenLine, href: "/magazine/proposer" },
          { label: "Cours créés", count: cours.length, icon: GraduationCap, href: "/universite-populaire/enseigner" },
          { label: "Cours suivis", count: inscriptions.length, icon: BookOpen, href: "/universite-populaire" },
        ].map((s) => (
          <Link key={s.label} href={s.href} className="card-sable p-4 text-center hover:shadow-nihary-md transition-shadow">
            <div className="flex justify-center mb-2 text-nihary-ambre">
              <s.icon size={22} strokeWidth={1.75} />
            </div>
            <div className="font-display font-bold text-xl text-nihary-ambre-fonce">{s.count}</div>
            <div className="text-xs font-mono text-nihary-gris mt-0.5">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {notifications.length > 0 && <section className="card-sable p-5 lg:col-span-2"><h2 className="font-display font-semibold mb-3">Notifications du comité</h2><div className="grid md:grid-cols-2 gap-3">{notifications.map((notification)=><div key={notification.id} className="bg-white rounded p-3"><p className="font-medium text-sm">{notification.titre}</p><p className="text-xs text-nihary-gris mt-1">{notification.message}</p></div>)}</div></section>}
        <EditorialRequestsPanel contents={[...articlesRevue.map((item)=>({id:item.id,type:'revue',title:item.titre,status:item.statut})),...articlesMagazine.map((item)=>({id:item.id,type:'magazine',title:item.titre,status:item.statut})),...entretiens.map((item)=>({id:item.id,type:'entretien',title:item.titre,status:item.statut})),...livres.map((item)=>({id:item.id,type:'livre',title:item.titre,status:item.statut})),...cours.map((item)=>({id:item.id,type:'cours',title:item.titre,status:item.statut}))]} initialRequests={editorialRequests.map((item)=>({...item,createdAt:item.createdAt.toISOString()}))} />
        {/* Articles revue */}
        <section className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-nihary-ambre-fonce flex items-center gap-2">
              <FileText size={17} strokeWidth={1.75} className="text-nihary-or" />
              Revue scientifique
            </h2>
            <Link href="/revue/soumettre" className="btn-ghost !py-1 !px-2 text-xs">
              <Plus size={13} /> Soumettre
            </Link>
          </div>
          {articlesRevue.length === 0 ? (
            <p className="text-sm text-nihary-gris font-body">Aucun article soumis.</p>
          ) : (
            <ul className="space-y-2">
              {articlesRevue.map((a) => (
                <li key={a.id} className="flex items-start justify-between gap-2">
                  {a.statut === "EN_REVISION" ? <Link href={`/dashboard/revision/${a.id}`} className="text-sm text-nihary-or font-medium line-clamp-1 flex-1">Réviser : {a.titre}</Link> : <span className="text-sm text-nihary-brun font-body line-clamp-1 flex-1">{a.titre}</span>}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatutBadge statut={a.statut} />
                    <span className="text-xs text-nihary-gris-clair font-mono hidden sm:block">
                      {fmt(a.createdAt)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Articles magazine */}
        <section className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-nihary-ambre-fonce flex items-center gap-2">
              <PenLine size={17} strokeWidth={1.75} className="text-nihary-or" />
              Magazine
            </h2>
            <Link href="/magazine/proposer" className="btn-ghost !py-1 !px-2 text-xs">
              <Plus size={13} /> Proposer
            </Link>
          </div>
          {articlesMagazine.length === 0 ? (
            <p className="text-sm text-nihary-gris font-body">Aucun article proposé.</p>
          ) : (
            <ul className="space-y-2">
              {articlesMagazine.map((a) => (
                <li key={a.id} className="flex items-start justify-between gap-2">
                  <Link
                    href={a.statut === "PUBLIE" ? `/magazine/${a.slug}` : "#"}
                    className="text-sm text-nihary-brun font-body line-clamp-1 flex-1 hover:text-nihary-or transition-colors"
                  >
                    {a.titre}
                  </Link>
                  <StatutBadge statut={a.statut} />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Entretiens */}
        {entretiens.length > 0 && (
          <section className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-nihary-ambre-fonce flex items-center gap-2">
                <Mic size={17} strokeWidth={1.75} className="text-nihary-or" />
                Entretiens
              </h2>
              <Link href="/entretiens/proposer" className="btn-ghost !py-1 !px-2 text-xs">
                <Plus size={13} /> Proposer
              </Link>
            </div>
            <ul className="space-y-2">
              {entretiens.map((e) => (
                <li key={e.id} className="flex items-start justify-between gap-2">
                  <span className="text-sm text-nihary-brun font-body line-clamp-1 flex-1">{e.titre}</span>
                  <StatutBadge statut={e.statut} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Manuscrits */}
        {livres.length > 0 && (
          <section className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-nihary-ambre-fonce flex items-center gap-2">
                <BookOpen size={17} strokeWidth={1.75} className="text-nihary-or" />
                Manuscrits
              </h2>
              <Link href="/editions/soumettre" className="btn-ghost !py-1 !px-2 text-xs">
                <Plus size={13} /> Soumettre
              </Link>
            </div>
            <ul className="space-y-2">
              {livres.map((l) => (
                <li key={l.id} className="flex items-start justify-between gap-2">
                  <span className="text-sm text-nihary-brun font-body line-clamp-1 flex-1">{l.titre}</span>
                  <StatutBadge statut={l.statut} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Cours créés */}
        <section className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-nihary-ambre-fonce flex items-center gap-2">
              <GraduationCap size={17} strokeWidth={1.75} className="text-nihary-or" />
              Mes cours
            </h2>
            <Link href="/universite-populaire/enseigner" className="btn-ghost !py-1 !px-2 text-xs">
              <Plus size={13} /> Proposer
            </Link>
          </div>
          {cours.length === 0 ? (
            <p className="text-sm text-nihary-gris font-body">Aucun cours créé.</p>
          ) : (
            <ul className="space-y-2">
              {cours.map((c) => (
                <li key={c.id} className="flex items-start justify-between gap-2">
                  <Link
                    href={c.statut === "PUBLIE" ? `/universite-populaire/${c.slug}` : "#"}
                    className="text-sm text-nihary-brun font-body line-clamp-1 flex-1 hover:text-nihary-or transition-colors"
                  >
                    {c.titre}
                  </Link>
                  <StatutBadge statut={c.statut} />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Cours suivis */}
        <section className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-nihary-ambre-fonce flex items-center gap-2">
              <Clock size={17} strokeWidth={1.75} className="text-nihary-or" />
              Cours en cours
            </h2>
            <Link href="/universite-populaire" className="btn-ghost !py-1 !px-2 text-xs">
              Explorer
            </Link>
          </div>
          {inscriptions.length === 0 ? (
            <p className="text-sm text-nihary-gris font-body">
              Vous n'êtes inscrit à aucun cours.{" "}
              <Link href="/universite-populaire" className="text-nihary-or hover:underline">
                Découvrir les cours
              </Link>
            </p>
          ) : (
            <ul className="space-y-2">
              {inscriptions.map((i) => (
                <li key={i.id}>
                  <Link
                    href={`/universite-populaire/${i.cours.slug}`}
                    className="text-sm text-nihary-brun font-body hover:text-nihary-or transition-colors"
                  >
                    {i.cours.titre}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Actions rapides */}
      <div className="mt-8 card-sable p-6">
        <h2 className="font-display font-semibold text-nihary-ambre-fonce mb-4">
          Actions rapides
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/revue/soumettre" className="btn-outline text-xs">
            <FileText size={14} strokeWidth={1.75} /> Soumettre un article
          </Link>
          <Link href="/magazine/proposer" className="btn-outline text-xs">
            <PenLine size={14} strokeWidth={1.75} /> Proposer au magazine
          </Link>
          <Link href="/entretiens/proposer" className="btn-outline text-xs">
            <Mic size={14} strokeWidth={1.75} /> Proposer un entretien
          </Link>
          <Link href="/editions/soumettre" className="btn-outline text-xs">
            <BookOpen size={14} strokeWidth={1.75} /> Soumettre un manuscrit
          </Link>
          <Link href="/universite-populaire/enseigner" className="btn-outline text-xs">
            <GraduationCap size={14} strokeWidth={1.75} /> Proposer un cours
          </Link>
          <Link href="/consultance/rejoindre" className="btn-outline text-xs">
            <User size={14} strokeWidth={1.75} /> Devenir expert
          </Link>
        </div>
      </div>
    </div>
  );
}
