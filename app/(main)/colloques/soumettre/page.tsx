"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { DISCIPLINES } from "@/lib/disciplines";
import SubmissionEvidenceFields, { uploadSubmissionEvidence } from "@/components/submission/SubmissionEvidenceFields";

export default function SoumettreCommunicationPage() {
  const router = useRouter();
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    titre: "",
    auteurs: "",
    resume: "",
    discipline: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formElement = e.currentTarget as HTMLFormElement;
    setLoading(true);
    setError("");
    try {
      const submissionEvidence = await uploadSubmissionEvidence(formElement);
      const res = await fetch("/api/colloques/soumettre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, submissionEvidence }),
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
          Communication soumise
        </h1>
        <p className="text-nihary-gris font-body mb-6">
          Votre communication est en attente d'examen par le comité scientifique du colloque.
        </p>
        <button onClick={() => router.push("/colloques")} className="btn-primary">
          Retour aux colloques
        </button>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <span className="eyebrow">Colloques</span>
      <h1 className="font-display font-bold text-display-md text-nihary-ambre-fonce mt-1 mb-2">
        Soumettre une communication
      </h1>
      <p className="text-nihary-gris font-body mb-8">
        Proposez une communication pour l'un des colloques organisés ou soutenus par FINIDY Research Center.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-body font-medium text-nihary-brun mb-1">
            Titre de la communication *
          </label>
          <input
            className="input"
            required
            value={form.titre}
            onChange={(e) => setForm({ ...form, titre: e.target.value })}
            placeholder="Titre de votre communication"
          />
        </div>

        <div>
          <label className="block text-sm font-body font-medium text-nihary-brun mb-1">
            Auteur(s) *
          </label>
          <input
            className="input"
            required
            value={form.auteurs}
            onChange={(e) => setForm({ ...form, auteurs: e.target.value })}
            placeholder="Prénom Nom (Institution) — séparer par des virgules si plusieurs"
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
            Résumé * (300 à 500 mots)
          </label>
          <textarea
            className="input min-h-40 resize-y"
            required
            value={form.resume}
            onChange={(e) => setForm({ ...form, resume: e.target.value })}
            placeholder="Présentez la problématique, la méthodologie et les résultats attendus..."
          />
        </div>

        <SubmissionEvidenceFields contentLabel="Communication complète" contentAccept=".pdf,.doc,.docx,application/pdf" />
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
          {loading ? "Envoi en cours..." : "Soumettre la communication"}
        </button>
        <p className="text-xs text-nihary-gris font-body text-center">
          Vous devez être connecté pour soumettre une communication.
        </p>
      </form>
    </div>
  );
}
