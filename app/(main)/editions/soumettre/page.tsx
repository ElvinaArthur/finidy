"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { DISCIPLINES } from "@/lib/disciplines";

export default function SoumettreManuscritPage() {
  const router = useRouter();
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    titre: "",
    description: "",
    discipline: "",
    annee: new Date().getFullYear().toString(),
    collection: "",
    isbn: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/editions/soumettre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, annee: parseInt(form.annee) }),
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
          Manuscrit soumis
        </h1>
        <p className="text-nihary-gris font-body mb-6">
          Votre manuscrit est en cours d'examen par le comité éditorial de FINIDY Research Center.
        </p>
        <button onClick={() => router.push("/editions")} className="btn-primary">
          Retour aux éditions
        </button>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <span className="eyebrow">Édition</span>
      <h1 className="font-display font-bold text-display-md text-nihary-ambre-fonce mt-1 mb-2">
        Soumettre un manuscrit
      </h1>
      <p className="text-nihary-gris font-body mb-8">
        Proposez votre ouvrage à la maison d'édition FINIDY Research Center. Notre comité éditorial
        examinera votre soumission sous 4 à 6 semaines.
      </p>

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
            placeholder="Titre complet de l'ouvrage"
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
              Année *
            </label>
            <input
              className="input"
              type="number"
              required
              min={2000}
              max={2030}
              value={form.annee}
              onChange={(e) => setForm({ ...form, annee: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-body font-medium text-nihary-brun mb-1">
            Résumé / Description *
          </label>
          <textarea
            className="input min-h-36 resize-y"
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Résumé de l'ouvrage, thématiques abordées, public visé..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-body font-medium text-nihary-brun mb-1">
              Collection (si applicable)
            </label>
            <input
              className="input"
              value={form.collection}
              onChange={(e) => setForm({ ...form, collection: e.target.value })}
              placeholder="Ex: Sciences de la société"
            />
          </div>
          <div>
            <label className="block text-sm font-body font-medium text-nihary-brun mb-1">
              ISBN (si existant)
            </label>
            <input
              className="input"
              value={form.isbn}
              onChange={(e) => setForm({ ...form, isbn: e.target.value })}
              placeholder="978-..."
            />
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
          {loading ? "Envoi en cours..." : "Soumettre le manuscrit"}
        </button>
        <p className="text-xs text-nihary-gris font-body text-center">
          Vous devez être connecté pour soumettre un manuscrit.
        </p>
      </form>
    </div>
  );
}
