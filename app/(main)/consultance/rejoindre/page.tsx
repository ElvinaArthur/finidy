"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import SubmissionEvidenceFields, { uploadSubmissionEvidence } from "@/components/submission/SubmissionEvidenceFields";

export default function RejoindreExpertPage() {
  const router = useRouter();
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    titre: "",
    specialites: "",
    ville: "",
    tarifHeure: "",
    cvUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formElement = e.currentTarget as HTMLFormElement;
    setLoading(true);
    setError("");
    try {
      const submissionEvidence = await uploadSubmissionEvidence(formElement);
      const res = await fetch("/api/consultance/rejoindre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          submissionEvidence,
          specialites: form.specialites
            .split(",")
            .map((s) => s.trim())
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
          Profil expert créé
        </h1>
        <p className="text-nihary-gris font-body mb-6">
          Votre profil est désormais visible dans l'annuaire de consultance
          FINIDY Research Center.
        </p>
        <button
          onClick={() => router.push("/consultance")}
          className="btn-primary"
        >
          Voir l'annuaire
        </button>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <span className="eyebrow">Consultance</span>
      <h1 className="font-display font-bold text-display-md text-nihary-ambre-fonce mt-1 mb-8">
        Devenir expert référencé
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-body font-medium text-nihary-brun mb-1">
            Titre professionnel *
          </label>
          <input
            className="input"
            required
            value={form.titre}
            onChange={(e) => setForm({ ...form, titre: e.target.value })}
            placeholder="Sociologue spécialiste du travail"
          />
        </div>

        <div>
          <label className="block text-sm font-body font-medium text-nihary-brun mb-1">
            Spécialités *
          </label>
          <input
            className="input"
            required
            value={form.specialites}
            onChange={(e) => setForm({ ...form, specialites: e.target.value })}
            placeholder="Séparées par virgules : sociologie du travail, RH, Madagascar"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-body font-medium text-nihary-brun mb-1">
              Ville
            </label>
            <input
              className="input"
              value={form.ville}
              onChange={(e) => setForm({ ...form, ville: e.target.value })}
              placeholder="Antananarivo"
            />
          </div>
          <div>
            <label className="block text-sm font-body font-medium text-nihary-brun mb-1">
              Tarif horaire (Ar)
            </label>
            <input
              type="number"
              min="0"
              className="input"
              value={form.tarifHeure}
              onChange={(e) => setForm({ ...form, tarifHeure: e.target.value })}
              placeholder="50000"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-body font-medium text-nihary-brun mb-1">
            Lien vers le CV
          </label>
          <input
            className="input"
            value={form.cvUrl}
            onChange={(e) => setForm({ ...form, cvUrl: e.target.value })}
            placeholder="https://..."
          />
        </div>

        <SubmissionEvidenceFields contentLabel="Portfolio ou publication de référence" contentAccept=".pdf,.doc,.docx,application/pdf" />
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
          {loading ? "Création..." : "Créer mon profil expert"}
        </button>

        <p className="text-xs text-nihary-gris font-body text-center">
          Vous devez être connecté pour créer un profil expert.
        </p>
      </form>
    </div>
  );
}
