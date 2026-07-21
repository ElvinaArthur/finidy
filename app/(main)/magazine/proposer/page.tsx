"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { DISCIPLINES } from "@/lib/disciplines";
import SubmissionEvidenceFields, { uploadSubmissionEvidence } from "@/components/submission/SubmissionEvidenceFields";

export default function ProposerArticlePage() {
  const router = useRouter();
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    titre: "",
    chapeau: "",
    contenu: "",
    discipline: "",
    tags: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formElement = e.currentTarget as HTMLFormElement;
    setLoading(true);
    setError("");
    try {
      const submissionEvidence = await uploadSubmissionEvidence(formElement);
      const res = await fetch("/api/magazine/proposer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          submissionEvidence,
          tags: form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setDone(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (done)
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="flex justify-center mb-4 text-green-600">
          <CheckCircle2 size={48} strokeWidth={1.5} />
        </div>
        <h1 className="font-display font-bold text-2xl text-nihary-ambre-fonce mb-3">
          Article proposé
        </h1>
        <p className="text-nihary-gris font-body mb-6">
          Votre article est en attente de relecture par l'équipe éditoriale.
        </p>
        <button
          onClick={() => router.push("/magazine")}
          className="btn-primary"
        >
          Retour au magazine
        </button>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <span className="eyebrow">Magazine</span>
      <h1 className="font-display font-bold text-display-md text-nihary-ambre-fonce mt-1 mb-8">
        Proposer un article
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-body font-medium text-nihary-brun mb-1">
            Titre *
          </label>
          <input
            className="input"
            required
            value={form.titre}
            onChange={(e) => setForm({ ...form, titre: e.target.value })}
            placeholder="Un titre accrocheur"
          />
        </div>

        <div>
          <label className="block text-sm font-body font-medium text-nihary-brun mb-1">
            Discipline *
          </label>
          <select
            className="input"
            required
            value={form.discipline}
            onChange={(e) => setForm({ ...form, discipline: e.target.value })}
          >
            <option value="">Sélectionner une discipline</option>
            {DISCIPLINES.map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-body font-medium text-nihary-brun mb-1">
            Chapeau *
          </label>
          <textarea
            className="input min-h-20 resize-y"
            required
            value={form.chapeau}
            onChange={(e) => setForm({ ...form, chapeau: e.target.value })}
            placeholder="Résumé accrocheur en 1-2 phrases, affiché en aperçu"
          />
        </div>

        <div>
          <label className="block text-sm font-body font-medium text-nihary-brun mb-1">
            Contenu *
          </label>
          <textarea
            className="input min-h-64 resize-y font-body"
            required
            value={form.contenu}
            onChange={(e) => setForm({ ...form, contenu: e.target.value })}
            placeholder="Corps de l'article, 300 à 800 mots conseillés..."
          />
        </div>

        <div>
          <label className="block text-sm font-body font-medium text-nihary-brun mb-1">
            Tags
          </label>
          <input
            className="input"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder="Séparés par virgules : madagascar, travail, jeunesse"
          />
        </div>

        <SubmissionEvidenceFields contentLabel="Version éditable de l’article" contentAccept=".pdf,.doc,.docx,.txt,application/pdf,text/plain" />
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-nihary text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center"
        >
          {loading ? "Envoi..." : "Proposer l'article"}
        </button>

        <p className="text-xs text-nihary-gris font-body text-center">
          Vous devez être connecté pour proposer un article.
        </p>
      </form>
    </div>
  );
}
