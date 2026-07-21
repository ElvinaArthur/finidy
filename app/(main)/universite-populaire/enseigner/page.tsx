"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { DISCIPLINES } from "@/lib/disciplines";
import SubmissionEvidenceFields, { uploadSubmissionEvidence } from "@/components/submission/SubmissionEvidenceFields";

export default function EnseignerPage() {
  const router = useRouter();
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    titre: "",
    description: "",
    discipline: "",
    niveau: "DEBUTANT",
    dureeHeures: "",
    gratuit: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formElement = e.currentTarget as HTMLFormElement;
    setLoading(true);
    setError("");
    try {
      const submissionEvidence = await uploadSubmissionEvidence(formElement);
      const res = await fetch("/api/universite-populaire/enseigner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          submissionEvidence,
          dureeHeures: form.dureeHeures ? parseInt(form.dureeHeures) : null,
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
          Cours soumis
        </h1>
        <p className="text-nihary-gris font-body mb-6">
          Votre proposition de cours est en cours d'examen par l'équipe FINIDY Research Center.
          Nous vous contacterons sous 5 jours ouvrés.
        </p>
        <button onClick={() => router.push("/universite-populaire")} className="btn-primary">
          Voir les cours
        </button>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <span className="eyebrow">Université Populaire</span>
      <h1 className="font-display font-bold text-display-md text-nihary-ambre-fonce mt-1 mb-2">
        Proposer un cours
      </h1>
      <p className="text-nihary-gris font-body mb-8">
        Partagez votre savoir avec la communauté SHS de Madagascar et de l'océan Indien.
        Les cours sont publiés gratuitement sur la plateforme FINIDY Research Center.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-body font-medium text-nihary-brun mb-1">
            Titre du cours *
          </label>
          <input
            className="input"
            required
            value={form.titre}
            onChange={(e) => setForm({ ...form, titre: e.target.value })}
            placeholder="Ex: Introduction à la sociologie des organisations"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
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
              <option value="">Sélectionner</option>
              {DISCIPLINES.map(([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-body font-medium text-nihary-brun mb-1">
              Niveau *
            </label>
            <select
              className="input"
              value={form.niveau}
              onChange={(e) => setForm({ ...form, niveau: e.target.value })}
            >
              <option value="DEBUTANT">Débutant</option>
              <option value="INTERMEDIAIRE">Intermédiaire</option>
              <option value="AVANCE">Avancé</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-body font-medium text-nihary-brun mb-1">
            Description *
          </label>
          <textarea
            className="input min-h-36 resize-y"
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Décrivez les objectifs pédagogiques, le contenu et le public visé..."
          />
        </div>

        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-body font-medium text-nihary-brun mb-1">
              Durée estimée (heures)
            </label>
            <input
              className="input"
              type="number"
              min={1}
              max={200}
              value={form.dureeHeures}
              onChange={(e) => setForm({ ...form, dureeHeures: e.target.value })}
              placeholder="Ex: 10"
            />
          </div>
          <div className="flex items-center gap-2 pb-2.5">
            <input
              type="checkbox"
              id="gratuit"
              className="w-4 h-4 accent-nihary-or"
              checked={form.gratuit}
              onChange={(e) => setForm({ ...form, gratuit: e.target.checked })}
            />
            <label htmlFor="gratuit" className="text-sm font-body text-nihary-brun">
              Cours gratuit
            </label>
          </div>
        </div>

        <SubmissionEvidenceFields contentLabel="Premier module du cours" contentAccept=".pdf,.doc,.docx,.txt,audio/*,video/*" />
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
          {loading ? "Envoi en cours..." : "Soumettre le cours"}
        </button>
        <p className="text-xs text-nihary-gris font-body text-center">
          Vous devez être connecté pour proposer un cours.
        </p>
      </form>
    </div>
  );
}
