import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import CrmBoard from "@/components/admin/CrmBoard";

const profileFields = ["name", "institution", "discipline", "bio", "titreProfil", "telephone", "villeProfil", "pays"] as const;

export default async function Page() {
  const session = await auth();
  if ((session?.user as { role?: string } | undefined)?.role !== "ADMIN") redirect("/dashboard");

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const activityStart = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const [contacts, demandes, commandes, users] = await Promise.all([
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.demandeConsultance.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.commandePapier.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true, name: true, email: true, role: true, emailVerified: true, suspended: true,
        institution: true, discipline: true, bio: true, titreProfil: true, telephone: true,
        villeProfil: true, pays: true, langues: true, expertises: true, createdAt: true,
        _count: { select: { articles: true, articlesRevue: true, livres: true, entretiens: true, coursCreated: true } },
      },
    }),
  ]);

  const items = [
    ...contacts.map((item) => ({ id: item.id, type: "contact" as const, nom: item.nom, email: item.email, sujet: item.sujet, detail: item.message, statut: item.statut, notes: item.notes, createdAt: item.createdAt.toISOString() })),
    ...demandes.map((item) => ({ id: item.id, type: "consultance" as const, nom: item.nomClient, email: item.emailClient, sujet: item.sujet, detail: item.description, statut: item.statut, notes: item.notes, createdAt: item.createdAt.toISOString() })),
    ...commandes.map((item) => ({ id: item.id, type: "commande" as const, nom: item.nomClient, email: item.emailClient, sujet: `${item.titreProduit} · ${item.format}`, detail: `${item.quantite} exemplaire(s) · ${item.ville}, ${item.pays}\n${item.adresse}`, statut: item.statut, notes: item.notes, createdAt: item.createdAt.toISOString() })),
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const profiles = users.map((user) => {
    const scalarDone = profileFields.filter((field) => Boolean(user[field])).length;
    const completed = scalarDone + (user.langues.length ? 1 : 0) + (user.expertises.length ? 1 : 0);
    return {
      id: user.id, name: user.name, email: user.email, role: user.role, institution: user.institution,
      discipline: user.discipline, verified: Boolean(user.emailVerified), suspended: user.suspended,
      completion: Math.round((completed / 10) * 100), createdAt: user.createdAt.toISOString(),
      publications: Object.values(user._count).reduce((sum, count) => sum + count, 0),
    };
  });

  const roles = Object.entries(users.reduce<Record<string, number>>((acc, user) => ({ ...acc, [user.role]: (acc[user.role] || 0) + 1 }), {})).map(([role, count]) => ({ label: role, count }));
  const disciplines = Object.entries(users.reduce<Record<string, number>>((acc, user) => user.discipline ? ({ ...acc, [user.discipline]: (acc[user.discipline] || 0) + 1 }) : acc, {})).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([label, count]) => ({ label, count }));
  const activity = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
    const next = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    return { label: new Intl.DateTimeFormat("fr-FR", { month: "short" }).format(date), count: users.filter((user) => user.createdAt >= date && user.createdAt < next).length };
  });
  const pipeline = items.reduce<Record<string, number>>((acc, item) => ({ ...acc, [`${item.type}:${item.statut}`]: (acc[`${item.type}:${item.statut}`] || 0) + 1 }), {});
  const openStatuses = new Set(["NOUVEAU", "EN_COURS", "EN_ATTENTE", "NOUVELLE", "CONFIRMEE", "EN_PREPARATION"]);

  return <main className="mx-auto max-w-7xl px-4 py-10">
    <span className="eyebrow">Pilotage · Données · Relations</span>
    <h1 className="mt-1 font-display text-4xl font-bold">CRM scientifique</h1>
    <p className="mb-8 mt-2 max-w-3xl text-sm leading-6 text-nihary-gris">Une vue consolidée et actionnable des membres, auteurs, prospects, missions et commandes FINIDY.</p>
    <CrmBoard initialItems={items} profiles={profiles} analytics={{
      totalUsers: users.length,
      verified: profiles.filter((profile) => profile.verified).length,
      complete: profiles.filter((profile) => profile.completion === 100).length,
      authors: users.filter((user) => user.role === "AUTEUR").length,
      experts: users.filter((user) => user.role === "EXPERT" || user.role === "FORMATEUR").length,
      newThisMonth: users.filter((user) => user.createdAt >= monthStart).length,
      activePipeline: items.filter((item) => openStatuses.has(item.statut)).length,
      roles, disciplines, activity,
      completionBands: [
        { label: "Complet", count: profiles.filter((profile) => profile.completion === 100).length },
        { label: "À finaliser", count: profiles.filter((profile) => profile.completion >= 60 && profile.completion < 100).length },
        { label: "Incomplet", count: profiles.filter((profile) => profile.completion < 60).length },
      ],
      pipeline: Object.entries(pipeline).map(([label, count]) => ({ label, count })),
      activityStart: activityStart.toISOString(),
    }} />
  </main>;
}
