import Link from "next/link";
import { Video, CalendarDays, Clock } from "lucide-react";

export const metadata = { title: "Sessions live | Université Populaire | FINIDY Research Center" };

export default function SessionsLivePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <span className="eyebrow">Université Populaire</span>
      <h1 className="font-display font-bold text-display-md text-nihary-ambre-fonce mt-1 mb-4">
        Sessions live
      </h1>
      <p className="text-nihary-gris font-body mb-8 max-w-2xl">
        Cours en direct, webinaires et sessions interactives avec les formateurs de l'Université
        Populaire FINIDY Research Center. Posez vos questions en temps réel.
      </p>

      <div className="divider-or" />

      <div className="mt-8 card-sable p-12 text-center">
        <div className="flex justify-center mb-4 text-nihary-ambre">
          <Video size={48} strokeWidth={1.25} />
        </div>
        <h2 className="font-display font-semibold text-xl text-nihary-ambre-fonce mb-2">
          Bientôt disponible
        </h2>
        <p className="text-nihary-gris font-body mb-6 max-w-md mx-auto">
          Les sessions live de l'Université Populaire FINIDY Research Center sont en cours de préparation.
          Inscrivez-vous pour être informé·e des prochaines sessions.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/universite-populaire" className="btn-primary">
            Voir les cours en ligne
          </Link>
          <Link href="/contact" className="btn-outline">
            Proposer une session live
          </Link>
        </div>
      </div>

      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        {[
          {
            icon: Video,
            titre: "Webinaires",
            desc: "Conférences en direct avec questions-réponses en fin de session.",
          },
          {
            icon: CalendarDays,
            titre: "Ateliers thématiques",
            desc: "Sessions pratiques sur des méthodes de recherche en SHS.",
          },
          {
            icon: Clock,
            titre: "Rediffusions",
            desc: "Replay des sessions passées disponibles pour les inscrits.",
          },
        ].map((item) => (
          <div key={item.titre} className="card p-5 text-center">
            <div className="flex justify-center mb-3 text-nihary-or">
              <item.icon size={28} strokeWidth={1.25} />
            </div>
            <h3 className="font-display font-semibold text-nihary-ambre-fonce mb-2">
              {item.titre}
            </h3>
            <p className="text-sm text-nihary-gris font-body">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
