import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Inbox, Users, BarChart3, BookOpen } from "lucide-react";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";

async function getAdminStats() {
  try {
    const [pendingRevue, pendingMagazine, pendingEntretiens, pendingLivres, totalUsers] =
      await Promise.all([
        prisma.articleRevue.count({ where: { statut: "EN_ATTENTE" } }),
        prisma.article.count({ where: { statut: "EN_ATTENTE" } }),
        prisma.entretien.count({ where: { statut: "EN_ATTENTE" } }),
        prisma.livre.count({ where: { statut: "EN_ATTENTE" } }),
        prisma.user.count(),
      ]);
    return { pendingRevue, pendingMagazine, pendingEntretiens, pendingLivres, totalUsers };
  } catch {
    return { pendingRevue: 0, pendingMagazine: 0, pendingEntretiens: 0, pendingLivres: 0, totalUsers: 0 };
  }
}

export const metadata = { title: "Administration | FINIDY Research Center" };

export default async function AdminPage() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session?.user || role !== "ADMIN") redirect("/dashboard");

  const stats = await getAdminStats();
  const totalPending =
    stats.pendingRevue + stats.pendingMagazine + stats.pendingEntretiens + stats.pendingLivres;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-2">
        <ShieldCheck size={24} strokeWidth={1.5} className="text-nihary-or" />
        <span className="eyebrow">Administration</span>
      </div>
      <h1 className="font-display font-bold text-display-md text-nihary-ambre-fonce mb-8">
        Tableau de bord admin
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="card-sable p-4 text-center">
          <div className="font-display font-bold text-2xl text-nihary-ambre-fonce">{totalPending}</div>
          <div className="text-xs font-mono text-nihary-gris mt-0.5">En attente</div>
        </div>
        <div className="card-sable p-4 text-center">
          <div className="font-display font-bold text-2xl text-nihary-ambre-fonce">{stats.pendingRevue}</div>
          <div className="text-xs font-mono text-nihary-gris mt-0.5">Articles revue</div>
        </div>
        <div className="card-sable p-4 text-center">
          <div className="font-display font-bold text-2xl text-nihary-ambre-fonce">{stats.pendingMagazine}</div>
          <div className="text-xs font-mono text-nihary-gris mt-0.5">Articles magazine</div>
        </div>
        <div className="card-sable p-4 text-center">
          <div className="font-display font-bold text-2xl text-nihary-ambre-fonce">{stats.totalUsers}</div>
          <div className="text-xs font-mono text-nihary-gris mt-0.5">Utilisateurs</div>
        </div>
      </div>

      {/* Actions admin */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/admin/moderation"
          className="card p-6 group hover:border-nihary-or transition-colors"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-nihary bg-nihary-or-pale text-nihary-ambre">
              <Inbox size={24} strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="font-display font-semibold text-nihary-ambre-fonce group-hover:text-nihary-or transition-colors mb-1">
                Modération du contenu
              </h2>
              <p className="text-sm text-nihary-gris font-body">
                Valider ou rejeter les soumissions en attente.
              </p>
              {totalPending > 0 && (
                <span className="mt-2 inline-block text-xs font-mono px-2 py-0.5 rounded-full bg-nihary-or text-white">
                  {totalPending} en attente
                </span>
              )}
            </div>
          </div>
        </Link>

        <Link
          href="/admin/utilisateurs"
          className="card p-6 group hover:border-nihary-or transition-colors"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-nihary bg-nihary-or-pale text-nihary-ambre">
              <Users size={24} strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="font-display font-semibold text-nihary-ambre-fonce group-hover:text-nihary-or transition-colors mb-1">
                Gestion des utilisateurs
              </h2>
              <p className="text-sm text-nihary-gris font-body">
                Gérer les rôles, profils et accès des membres.
              </p>
              <span className="mt-2 inline-block text-xs font-mono text-nihary-gris-clair">
                {stats.totalUsers} membres inscrits
              </span>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/colloques"
          className="card p-6 group hover:border-nihary-or transition-colors"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-nihary bg-nihary-or-pale text-nihary-ambre">
              <BookOpen size={24} strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="font-display font-semibold text-nihary-ambre-fonce group-hover:text-nihary-or transition-colors mb-1">
                Gestion des colloques
              </h2>
              <p className="text-sm text-nihary-gris font-body">
                Créer et gérer les colloques, appels à communications.
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/stats"
          className="card p-6 group hover:border-nihary-or transition-colors"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-nihary bg-nihary-or-pale text-nihary-ambre">
              <BarChart3 size={24} strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="font-display font-semibold text-nihary-ambre-fonce group-hover:text-nihary-or transition-colors mb-1">
                Statistiques
              </h2>
              <p className="text-sm text-nihary-gris font-body">
                Vues, téléchargements, inscriptions et activité globale.
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
