"use client";

import { useMemo, useState } from "react";
import { Activity, BookOpenCheck, CheckCircle2, CircleDollarSign, Search, ShieldCheck, UserRoundCheck, Users } from "lucide-react";

type Item = { id: string; type: "contact" | "consultance" | "commande"; nom: string; email: string; sujet: string; detail: string; statut: string; notes: string | null; createdAt: string };
type Profile = { id: string; name: string | null; email: string; role: string; institution: string | null; discipline: string | null; verified: boolean; suspended: boolean; completion: number; publications: number; createdAt: string };
type Slice = { label: string; count: number };
type Analytics = { totalUsers: number; verified: number; complete: number; authors: number; experts: number; newThisMonth: number; activePipeline: number; roles: Slice[]; disciplines: Slice[]; activity: Slice[]; completionBands: Slice[]; pipeline: Slice[]; activityStart: string };
const STATUS = { contact: ["NOUVEAU", "EN_COURS", "EN_ATTENTE", "RESOLU", "ARCHIVE"], consultance: ["EN_ATTENTE", "EN_COURS", "CLOTURE"], commande: ["NOUVELLE", "CONFIRMEE", "EN_PREPARATION", "EXPEDIEE", "LIVREE", "ANNULEE"] };
const TYPE_LABELS = { contact: "Messages", consultance: "Consultance", commande: "Commandes papier" };

function Bars({ data, tone = "gold" }: { data: Slice[]; tone?: "gold" | "brown" }) {
  const maximum = Math.max(...data.map((item) => item.count), 1);
  return <div className="space-y-3">{data.map((item) => <div key={item.label}><div className="mb-1 flex justify-between gap-3 text-xs"><span className="truncate text-nihary-gris">{item.label.replaceAll("_", " ")}</span><strong>{item.count}</strong></div><div className="h-2 overflow-hidden rounded-full bg-nihary-sable"><div className={`h-full rounded-full ${tone === "gold" ? "bg-nihary-or" : "bg-nihary-ambre"}`} style={{ width: `${Math.max(4, Math.round(item.count / maximum * 100))}%` }} /></div></div>)}</div>;
}

export default function CrmBoard({ initialItems, profiles, analytics }: { initialItems: Item[]; profiles: Profile[]; analytics: Analytics }) {
  const [items, setItems] = useState(initialItems);
  const [tab, setTab] = useState<"overview" | "pipeline" | "profiles">("overview");
  const [filter, setFilter] = useState("TOUS");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const shown = useMemo(() => items.filter((item) => (filter === "TOUS" || item.type === filter) && `${item.nom} ${item.email} ${item.sujet} ${item.detail}`.toLowerCase().includes(query.toLowerCase())), [items, filter, query]);
  const shownProfiles = useMemo(() => profiles.filter((profile) => `${profile.name} ${profile.email} ${profile.institution} ${profile.discipline} ${profile.role}`.toLowerCase().includes(query.toLowerCase())), [profiles, query]);
  async function update(item: Item, statut: string, notes = item.notes || "") { const response = await fetch("/api/admin/crm", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id, type: item.type, statut, notes }) }); const data = await response.json(); if (!response.ok) { setError(data.error); return; } setItems((rows) => rows.map((row) => row.id === item.id && row.type === item.type ? { ...row, statut, notes } : row)); }
  const completion = analytics.totalUsers ? Math.round(analytics.complete / analytics.totalUsers * 100) : 0;
  const verification = analytics.totalUsers ? Math.round(analytics.verified / analytics.totalUsers * 100) : 0;
  const metrics = [
    { label: "Utilisateurs", value: analytics.totalUsers, detail: `+${analytics.newThisMonth} ce mois`, icon: Users },
    { label: "Profils complets", value: `${completion}%`, detail: `${analytics.complete} dossiers qualifiés`, icon: UserRoundCheck },
    { label: "Comptes vérifiés", value: `${verification}%`, detail: `${analytics.verified} membres`, icon: ShieldCheck },
    { label: "Auteurs", value: analytics.authors, detail: "profils éditoriaux", icon: BookOpenCheck },
    { label: "Pipeline actif", value: analytics.activePipeline, detail: "actions à suivre", icon: Activity },
  ];

  return <div className="space-y-8">
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{metrics.map(({ label, value, detail, icon: Icon }) => <div className="card p-5" key={label}><Icon className="mb-3 text-nihary-or" size={21} /><p className="text-xs uppercase tracking-wider text-nihary-gris">{label}</p><p className="mt-1 font-display text-3xl font-bold text-nihary-ambre-fonce">{value}</p><p className="mt-1 text-xs text-nihary-gris">{detail}</p></div>)}</section>

    <nav className="flex flex-wrap gap-2 border-b border-nihary-sable-fonce pb-4" aria-label="Vues du CRM">{[["overview", "Vue analytique"], ["pipeline", "Pipeline relationnel"], ["profiles", "Base membres & auteurs"]].map(([value, label]) => <button key={value} onClick={() => setTab(value as typeof tab)} className={tab === value ? "btn-primary" : "btn-ghost"}>{label}</button>)}</nav>

    {tab === "overview" && <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
      <section className="card p-6 lg:col-span-2"><div className="mb-6 flex items-start justify-between"><div><span className="eyebrow">Acquisition</span><h2 className="mt-1 text-xl font-semibold">Nouveaux membres sur 6 mois</h2></div><Activity className="text-nihary-or" /></div><div className="flex h-48 items-end gap-3 sm:gap-6">{analytics.activity.map((item) => { const max = Math.max(...analytics.activity.map((value) => value.count), 1); return <div key={item.label} className="flex flex-1 flex-col items-center"><strong className="mb-2 text-sm">{item.count}</strong><div className="w-full rounded-t-md bg-gradient-to-t from-nihary-ambre to-nihary-or" style={{ height: `${Math.max(10, item.count / max * 140)}px` }} /><span className="mt-2 text-xs capitalize text-nihary-gris">{item.label}</span></div>; })}</div></section>
      <section className="card p-6"><span className="eyebrow">Qualité des données</span><h2 className="mb-6 mt-1 text-xl font-semibold">Complétude des profils</h2><Bars data={analytics.completionBands} /><div className="mt-6 rounded-lg bg-nihary-sable p-4 text-sm"><strong>{profiles.filter((profile) => profile.completion < 100).length}</strong> profils nécessitent encore un enrichissement.</div></section>
      <section className="card p-6"><span className="eyebrow">Segmentation</span><h2 className="mb-6 mt-1 text-xl font-semibold">Répartition par rôle</h2><Bars data={analytics.roles} /></section>
      <section className="card p-6"><span className="eyebrow">Expertise</span><h2 className="mb-6 mt-1 text-xl font-semibold">Disciplines représentées</h2>{analytics.disciplines.length ? <Bars data={analytics.disciplines} tone="brown" /> : <p className="text-sm text-nihary-gris">Les disciplines apparaîtront dès que les profils seront complétés.</p>}</section>
      <section className="card p-6"><span className="eyebrow">Flux commercial</span><h2 className="mb-6 mt-1 text-xl font-semibold">Dossiers par statut</h2><Bars data={analytics.pipeline.sort((a, b) => b.count - a.count).slice(0, 7)} /></section>
    </div>}

    {tab === "pipeline" && <section><div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><div className="flex flex-wrap gap-2">{[["TOUS", "Tout"], ...Object.entries(TYPE_LABELS)].map(([value, label]) => <button key={value} className={filter === value ? "btn-primary" : "btn-outline"} onClick={() => setFilter(value)}>{label}</button>)}</div><SearchInput query={query} setQuery={setQuery} /></div>{error && <p className="mb-3 text-red-700">{error}</p>}<p className="mb-4 text-xs text-nihary-gris">{shown.length} dossier{shown.length > 1 ? "s" : ""} affiché{shown.length > 1 ? "s" : ""}</p><div className="grid gap-4 xl:grid-cols-2">{shown.map((item) => <article key={`${item.type}-${item.id}`} className="card p-5"><div className="flex justify-between gap-3"><div><span className="badge">{TYPE_LABELS[item.type]}</span><h2 className="mt-2 font-semibold">{item.sujet}</h2><p className="text-sm">{item.nom} · <a href={`mailto:${item.email}`} className="text-nihary-or hover:underline">{item.email}</a></p></div><select aria-label={`Statut de ${item.sujet}`} className="input h-fit !w-auto" value={item.statut} onChange={(event) => void update(item, event.target.value)}>{STATUS[item.type].map((status) => <option key={status}>{status}</option>)}</select></div><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-nihary-gris">{item.detail}</p><textarea className="input mt-4 min-h-20" defaultValue={item.notes || ""} placeholder="Notes internes…" onBlur={(event) => void update(item, item.statut, event.target.value)} /><p className="mt-2 text-[11px] text-nihary-gris">{new Date(item.createdAt).toLocaleString("fr-FR")}</p></article>)}</div></section>}

    {tab === "profiles" && <section><div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-xl font-semibold">Référentiel des talents</h2><p className="text-sm text-nihary-gris">Qualification des membres, auteurs et experts.</p></div><SearchInput query={query} setQuery={setQuery} /></div><div className="card overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-nihary-sable/60 text-xs uppercase tracking-wide text-nihary-gris"><tr><th className="p-4">Profil</th><th>Segment</th><th>Institution / discipline</th><th>Publications</th><th className="pr-4">Complétude</th></tr></thead><tbody>{shownProfiles.map((profile) => <tr key={profile.id} className="border-t border-nihary-sable-fonce"><td className="p-4"><p className="font-medium">{profile.name || "Profil sans nom"}</p><p className="text-xs text-nihary-gris">{profile.email}</p></td><td><span className="badge">{profile.role}</span>{profile.verified && <CheckCircle2 className="ml-2 inline text-emerald-600" size={15} />}</td><td><p>{profile.institution || "Institution non renseignée"}</p><p className="text-xs text-nihary-gris">{profile.discipline || "Discipline à compléter"}</p></td><td><span className="inline-flex items-center gap-1"><CircleDollarSign className="text-nihary-or" size={14} />{profile.publications}</span></td><td className="pr-4"><div className="flex items-center gap-3"><div className="h-2 w-24 overflow-hidden rounded-full bg-nihary-sable"><div className={profile.completion === 100 ? "h-full bg-emerald-600" : "h-full bg-nihary-or"} style={{ width: `${profile.completion}%` }} /></div><strong>{profile.completion}%</strong></div></td></tr>)}</tbody></table></div></section>}
  </div>;
}

function SearchInput({ query, setQuery }: { query: string; setQuery: (value: string) => void }) { return <label className="relative block w-full sm:max-w-sm"><Search className="absolute left-3 top-3 text-nihary-gris" size={16} /><input className="input pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher dans le CRM…" /></label>; }
