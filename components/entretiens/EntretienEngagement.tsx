"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Lightbulb, MessageCircle, Send, ThumbsUp, Verified } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type ReactionType = "AIME" | "COEUR" | "INSPIRANT" | "PERTINENT";
type Comment = { id: string; contenu: string; createdAt: string; user: { name: string | null; image: string | null; institution: string | null } };
type Engagement = { comments: Comment[]; reactions: Record<ReactionType, number>; ownReaction: ReactionType | null; authenticated: boolean; canComment: boolean };

const REACTIONS: Array<{ type: ReactionType; label: string; icon: typeof Heart }> = [
  { type: "AIME", label: "J’aime", icon: ThumbsUp },
  { type: "COEUR", label: "J’adore", icon: Heart },
  { type: "INSPIRANT", label: "Inspirant", icon: Lightbulb },
  { type: "PERTINENT", label: "Pertinent", icon: Verified },
];

const emptyCounts: Record<ReactionType, number> = { AIME: 0, COEUR: 0, INSPIRANT: 0, PERTINENT: 0 };

export default function EntretienEngagement({ slug }: { slug: string }) {
  const [data, setData] = useState<Engagement | null>(null);
  const [contenu, setContenu] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      const response = await fetch(`/api/entretiens/${encodeURIComponent(slug)}/engagement`, { cache: "no-store" });
      if (!response.ok) throw new Error("Interactions indisponibles");
      setData(await response.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Interactions indisponibles");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => { void refresh(); }, [refresh]);

  const react = async (type: ReactionType) => {
    if (!data?.authenticated) { setError("Connectez-vous pour réagir à cet entretien."); return; }
    setError("");
    const previous = data.ownReaction;
    const next = previous === type ? null : type;
    setData({ ...data, ownReaction: next, reactions: { ...data.reactions, ...(previous ? { [previous]: Math.max(0, data.reactions[previous] - 1) } : {}), ...(next ? { [next]: data.reactions[next] + 1 } : {}) } });
    const response = await fetch(`/api/entretiens/${encodeURIComponent(slug)}/engagement`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "reaction", type }) });
    if (!response.ok) { setError((await response.json()).error || "Réaction impossible"); await refresh(); }
  };

  const comment = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!data?.canComment || !contenu.trim()) return;
    setSubmitting(true); setError("");
    const response = await fetch(`/api/entretiens/${encodeURIComponent(slug)}/engagement`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "comment", contenu }) });
    const body = await response.json();
    if (response.ok) { setData({ ...data, comments: [body.comment, ...data.comments] }); setContenu(""); } else setError(body.error || "Commentaire impossible");
    setSubmitting(false);
  };

  return (
    <section className="border-t border-nihary-sable-fonce bg-white/60">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="card overflow-hidden">
          <div className="border-b border-nihary-sable-fonce p-6 sm:p-8">
            <span className="eyebrow">La conversation continue</span>
            <h2 className="mt-1 font-display text-2xl font-bold text-nihary-ambre-fonce">Réagir à cet entretien</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {REACTIONS.map(({ type, label, icon: Icon }) => <button key={type} type="button" onClick={() => void react(type)} disabled={loading} className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-colors ${data?.ownReaction === type ? "border-nihary-or bg-nihary-or-pale text-nihary-ambre" : "border-nihary-sable-fonce bg-white text-nihary-gris hover:border-nihary-or hover:text-nihary-ambre"}`}><Icon size={15} fill={type === "COEUR" && data?.ownReaction === type ? "currentColor" : "none"} />{label}<span className="font-mono text-xs">{data?.reactions?.[type] ?? emptyCounts[type]}</span></button>)}
            </div>
            {error && <p className="mt-3 text-sm text-red-700">{error} {!data?.authenticated && <Link href="/auth/connexion" className="font-medium underline">Se connecter</Link>}</p>}
          </div>

          <div className="p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-2"><MessageCircle size={19} className="text-nihary-or" /><h3 className="font-display text-xl font-semibold text-nihary-ambre-fonce">Commentaires <span className="text-sm font-normal text-nihary-gris">({data?.comments.length || 0})</span></h3></div>
            {data?.canComment ? <form onSubmit={(event) => void comment(event)} className="mb-8"><textarea value={contenu} onChange={(event) => setContenu(event.target.value)} maxLength={1500} required className="input min-h-28 resize-y" placeholder="Apportez un éclairage, posez une question ou partagez une référence…" /><div className="mt-2 flex items-center justify-between gap-3"><p className="text-xs text-nihary-gris">Compte vérifié · {contenu.length}/1 500</p><button disabled={submitting || !contenu.trim()} className="btn-primary disabled:opacity-50"><Send size={14} />{submitting ? "Publication…" : "Publier"}</button></div></form> : <div className="card-sable mb-8 p-4 text-sm text-nihary-gris">{loading ? "Chargement…" : data?.authenticated ? "Vérifiez votre adresse e-mail pour participer à la discussion." : <><Link href="/auth/connexion" className="font-medium text-nihary-or hover:underline">Connectez-vous</Link> avec un compte vérifié pour commenter.</>}</div>}

            <div className="space-y-5">{data?.comments.map((comment) => <article key={comment.id} className="flex gap-3"><div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-nihary-or-pale">{comment.user.image ? <Image src={comment.user.image} alt={comment.user.name || "Membre FINIDY"} fill className="object-cover object-top" sizes="40px" /> : <span className="flex h-full items-center justify-center font-display font-bold text-nihary-ambre">{comment.user.name?.charAt(0) || "?"}</span>}</div><div className="min-w-0 flex-1 rounded-lg bg-nihary-ecru p-4"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="flex items-center gap-1 text-sm font-medium text-nihary-ambre-fonce">{comment.user.name}<Verified size={13} className="text-nihary-or" /></p>{comment.user.institution && <p className="text-[11px] text-nihary-gris">{comment.user.institution}</p>}</div><time className="text-[11px] text-nihary-gris" dateTime={comment.createdAt}>{new Date(comment.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}</time></div><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-nihary-brun">{comment.contenu}</p></div></article>)}{!loading && data?.comments.length === 0 && <p className="py-6 text-center text-sm text-nihary-gris">Soyez la première personne à commenter cet entretien.</p>}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
