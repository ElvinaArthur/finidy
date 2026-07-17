"use client";
import { useState } from "react";
import { Mail, MapPin, CheckCircle2 } from "lucide-react";

export default function ContactForm() {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ nom: "", email: "", sujet: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erreur d’envoi");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur d’envoi");
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
          Message envoyé
        </h1>
        <p className="text-nihary-gris font-body">
          Merci pour votre message. Nous vous répondrons sous 3 jours ouvrés.
        </p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <span className="eyebrow">Nous écrire</span>
      <h1 className="font-display font-bold text-display-md text-nihary-ambre-fonce mt-1 mb-8">
        Contact
      </h1>

      <div className="grid lg:grid-cols-5 gap-10">
        {/* Formulaire */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-body font-medium text-nihary-brun mb-1">
                  Nom complet *
                </label>
                <input
                  className="input"
                  required
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <label className="block text-sm font-body font-medium text-nihary-brun mb-1">
                  Email *
                </label>
                <input
                  className="input"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="votre@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-body font-medium text-nihary-brun mb-1">
                Sujet *
              </label>
              <select
                className="input"
                required
                value={form.sujet}
                onChange={(e) => setForm({ ...form, sujet: e.target.value })}
              >
                <option value="">Choisir un sujet</option>
                <option value="submission">Question sur une soumission</option>
                <option value="consultance">Consultance / expertise</option>
                <option value="partenariat">Partenariat institutionnel</option>
                <option value="technique">Problème technique</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-body font-medium text-nihary-brun mb-1">
                Message *
              </label>
              <textarea
                className="input min-h-36 resize-y"
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Décrivez votre demande..."
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center"
            >
              {loading ? "Envoi..." : "Envoyer le message"}
            </button>
            {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
          </form>
        </div>

        {/* Infos */}
        <div className="lg:col-span-2 space-y-5">
          <div className="card-sable p-5">
            <div className="flex items-start gap-3">
              <Mail size={20} strokeWidth={1.5} className="text-nihary-or flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-display font-semibold text-nihary-ambre-fonce mb-1">Email</p>
                <a
                  href="mailto:contact@finidy.mg"
                  className="text-sm text-nihary-brun font-body hover:text-nihary-or transition-colors"
                >
                  contact@finidy.mg
                </a>
                <p className="text-xs text-nihary-gris font-body mt-1">
                  Réponse sous 3 jours ouvrés
                </p>
              </div>
            </div>
          </div>

          <div className="card-sable p-5">
            <div className="flex items-start gap-3">
              <MapPin size={20} strokeWidth={1.5} className="text-nihary-or flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-display font-semibold text-nihary-ambre-fonce mb-1">Adresse</p>
                <p className="text-sm text-nihary-brun font-body">
                  Antananarivo, Madagascar<br />
                  Océan Indien
                </p>
              </div>
            </div>
          </div>

          <div className="card-sable p-5">
            <p className="font-display font-semibold text-nihary-ambre-fonce mb-2">
              Soumissions
            </p>
            <p className="text-sm text-nihary-gris font-body">
              Pour soumettre un article, un manuscrit ou proposer un cours, utilisez les formulaires
              dédiés accessibles depuis le menu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
