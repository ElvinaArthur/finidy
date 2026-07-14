export const metadata = {
  title: "Politique éditoriale | FINIDY Research Center",
  description:
    "Politique éditoriale de SAONTSY — Revue FINIDY Research Center : normes de soumission, processus de révision par les pairs et critères d'évaluation scientifique.",
  keywords: ['politique éditoriale', 'soumission article', 'peer review SAONTSY', 'normes publication SHS'],
  openGraph: {
    title: "Politique éditoriale — SAONTSY FINIDY Research Center",
    description: "Normes de soumission et processus de révision par les pairs de la revue SAONTSY.",
    type: 'website' as const,
    url: 'https://finidy.mg/politique-editoriale',
  },
  alternates: { canonical: 'https://finidy.mg/politique-editoriale' },
};

export default function PolitiqueEditorialePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <span className="eyebrow">Transparence</span>
      <h1 className="font-display font-bold text-display-md text-nihary-ambre-fonce mt-1 mb-6">
        Politique éditoriale
      </h1>

      <div className="divider-or" />

      <div className="prose-nihary text-nihary-brun space-y-8 mt-8">
        <section>
          <h2 className="font-display font-semibold text-xl text-nihary-ambre-fonce mb-3">
            Processus de révision par les pairs
          </h2>
          <p>
            La Revue FINIDY Research Center applique un processus de révision par les pairs en double aveugle
            (<em>double-blind peer review</em>). Chaque soumission est évaluée par au moins deux
            membres du comité scientifique, experts dans la discipline concernée.
          </p>
          <p>
            Les critères d'évaluation incluent : l'originalité, la rigueur méthodologique, la
            pertinence théorique, la clarté de l'exposition et la contribution au corpus scientifique
            en SHS.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-xl text-nihary-ambre-fonce mb-3">
            Accès libre
          </h2>
          <p>
            FINIDY Research Center est engagé en faveur de l'accès libre (<em>open access</em>). Les articles publiés
            dans la Revue sont disponibles gratuitement en ligne. Les auteurs conservent leurs droits
            d'auteur et accordent à FINIDY Research Center une licence de publication non exclusive.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-xl text-nihary-ambre-fonce mb-3">
            Langues acceptées
          </h2>
          <p>
            Les soumissions sont acceptées en <strong>français</strong>, en{" "}
            <strong>malgache</strong> et en <strong>anglais</strong>. Les résumés doivent être
            fournis dans au moins deux des trois langues acceptées.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-xl text-nihary-ambre-fonce mb-3">
            Éthique de la publication
          </h2>
          <p>
            FINIDY Research Center adhère aux principes du Committee on Publication Ethics (COPE). Tout plagiat,
            fabrication ou falsification de données entraîne le rejet définitif de la soumission et
            peut entraîner une notification à l'institution de l'auteur.
          </p>
          <p>
            Les auteurs doivent déclarer tout conflit d'intérêt potentiel au moment de la soumission.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-xl text-nihary-ambre-fonce mb-3">
            Délais indicatifs
          </h2>
          <ul className="list-disc pl-6 space-y-1 font-body text-nihary-brun">
            <li>Accusé de réception : 48 heures</li>
            <li>Décision initiale (admissibilité) : 2 semaines</li>
            <li>Résultat de l'évaluation par les pairs : 6 à 10 semaines</li>
            <li>Décision finale après révision : 4 semaines</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display font-semibold text-xl text-nihary-ambre-fonce mb-3">
            Magazine et autres piliers
          </h2>
          <p>
            Les articles du Magazine, les entretiens et les contenus de l'Université Populaire sont
            soumis à une révision éditoriale interne. Ils ne suivent pas le même processus peer-review
            que la Revue scientifique, mais doivent respecter les standards de qualité, d'exactitude
            et d'éthique de FINIDY Research Center.
          </p>
        </section>
      </div>
    </div>
  );
}
