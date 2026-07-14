"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

const DISCIPLINES = [
  ["SOCIOLOGIE", "Sociologie"],
  ["ANTHROPOLOGIE", "Anthropologie"],
  ["HISTOIRE", "Histoire"],
  ["GEOGRAPHIE_HUMAINE", "Géographie humaine"],
  ["ECONOMIE", "Économie"],
  ["DROIT", "Droit"],
  ["SCIENCE_POLITIQUE", "Science politique"],
  ["PHILOSOPHIE", "Philosophie"],
  ["PSYCHOLOGIE_SOCIALE", "Psychologie sociale"],
  ["SCIENCES_EDUCATION", "Sciences de l'éducation"],
  ["LINGUISTIQUE", "Linguistique"],
  ["COMMUNICATION", "Communication"],
  ["DEMOGRAPHIE", "Démographie"],
  ["ETUDES_GENRE", "Études de genre"],
  ["ETUDES_MALGACHES", "Études malgaches"],
  ["RELATIONS_INTERNATIONALES", "Relations internationales"],
];

export default function SoumettreArticlePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    titre: "",
    resume: "",
    motsClés: "",
    discipline: "",
    langue: "FR",
    accesLibre: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/revue/soumettre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          motsClés: form.motsClés
            .split(",")
            .map((m) => m.trim())
            .filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (step === 3)
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="flex justify-center mb-4 text-green-600">
          <CheckCircle2 size={48} strokeWidth={1.5} />
        </div>
        <h1 className="font-display font-bold text-2xl text-nihary-ambre-fonce mb-3">
          Article soumis
        </h1>
        <p className="text-nihary-gris font-body mb-6">
          Votre article est en attente de revue par le comité scientifique.
        </p>
        <button onClick={() => router.push("/revue")} className="btn-primary">
          Retour à la revue
        </button>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <span className="eyebrow">Revue scientifique</span>
      <h1 className="font-display font-bold text-display-md text-nihary-ambre-fonce mt-1 mb-8">
        Soumettre un article
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
            placeholder="Titre complet de l'article"
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
            Résumé *
          </label>
          <textarea
            className="input min-h-32 resize-y"
            required
            value={form.resume}
            onChange={(e) => setForm({ ...form, resume: e.target.value })}
            placeholder="Résumé de 150 à 300 mots..."
          />
        </div>
        <div>
          <label className="block text-sm font-body font-medium text-nihary-brun mb-1">
            Mots-clés
          </label>
          <input
            className="input"
            value={form.motsClés}
            onChange={(e) => setForm({ ...form, motsClés: e.target.value })}
            placeholder="Séparés par virgules : sociologie, travail, Madagascar"
          />
        </div>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-body font-medium text-nihary-brun mb-1">
              Langue
            </label>
            <select
              className="input"
              value={form.langue}
              onChange={(e) => setForm({ ...form, langue: e.target.value })}
            >
              <option value="FR">Français</option>
              <option value="MG">Malgache</option>
              <option value="EN">Anglais</option>
            </select>
          </div>
          <div className="flex items-center gap-2 pb-2.5">
            <input
              type="checkbox"
              id="acces"
              className="w-4 h-4 accent-nihary-or"
              checked={form.accesLibre}
              onChange={(e) =>
                setForm({ ...form, accesLibre: e.target.checked })
              }
            />
            <label
              htmlFor="acces"
              className="text-sm font-body text-nihary-brun"
            >
              Accès libre
            </label>
          </div>
        </div>
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
          {loading ? "Envoi..." : "Soumettre l'article"}
        </button>
        <p className="text-xs text-nihary-gris font-body text-center">
          Vous devez être connecté pour soumettre un article.
        </p>
      </form>
    </div>
  );
}
