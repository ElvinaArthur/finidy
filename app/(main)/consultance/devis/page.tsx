"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

interface ExpertOption {
  id: string;
  titre: string;
  user: { name: string | null };
}

function DevisForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedId = searchParams.get("expertId") || "";

  const [experts, setExperts] = useState<ExpertOption[]>([]);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    expertId: preselectedId,
    nomClient: "",
    emailClient: "",
    sujet: "",
    description: "",
    budget: "",
    delai: "",
  });

  useEffect(() => {
    fetch("/api/consultance")
      .then((r) => r.json())
      .then((data) => setExperts(data.experts || []))
      .catch(() => setExperts([]));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/consultance/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
          Demande envoyée
        </h1>
        <p className="text-nihary-gris font-body mb-6">
          L'expert recevra votre demande et vous recontactera directement par
          email.
        </p>
        <button
          onClick={() => router.push("/consultance")}
          className="btn-primary"
        >
          Retour à l'annuaire
        </button>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <span className="eyebrow">Consultance</span>
      <h1 className="font-display font-bold text-display-md text-nihary-ambre-fonce mt-1 mb-8">
        Demander un devis
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-body font-medium text-nihary-brun mb-1">
            Expert *
          </label>
          <select
            className="input"
            required
            value={form.expertId}
            onChange={(e) => setForm({ ...form, expertId: e.target.value })}
          >
            <option value="">Sélectionner un expert</option>
            {experts.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.user.name} — {ex.titre}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-body font-medium text-nihary-brun mb-1">
              Votre nom *
            </label>
            <input
              className="input"
              required
              value={form.nomClient}
              onChange={(e) => setForm({ ...form, nomClient: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-body font-medium text-nihary-brun mb-1">
              Votre email *
            </label>
            <input
              type="email"
              className="input"
              required
              value={form.emailClient}
              onChange={(e) =>
                setForm({ ...form, emailClient: e.target.value })
              }
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-body font-medium text-nihary-brun mb-1">
            Sujet *
          </label>
          <input
            className="input"
            required
            value={form.sujet}
            onChange={(e) => setForm({ ...form, sujet: e.target.value })}
            placeholder="Étude d'impact social, formation, audit..."
          />
        </div>

        <div>
          <label className="block text-sm font-body font-medium text-nihary-brun mb-1">
            Description *
          </label>
          <textarea
            className="input min-h-32 resize-y"
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Décrivez votre besoin en détail..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-body font-medium text-nihary-brun mb-1">
              Budget indicatif (Ar)
            </label>
            <input
              type="number"
              min="0"
              className="input"
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-body font-medium text-nihary-brun mb-1">
              Délai souhaité
            </label>
            <input
              className="input"
              value={form.delai}
              onChange={(e) => setForm({ ...form, delai: e.target.value })}
              placeholder="2 semaines, 1 mois..."
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
          {loading ? "Envoi..." : "Envoyer la demande"}
        </button>
      </form>
    </div>
  );
}

export default function DemandeDevisPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto px-4 py-20 text-center text-nihary-gris">
          Chargement…
        </div>
      }
    >
      <DevisForm />
    </Suspense>
  );
}
