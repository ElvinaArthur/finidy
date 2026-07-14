import Link from "next/link";

export const metadata = {
  title: "À propos | FINIDY Research Center",
  description:
    "Découvrez la mission et la vision du FINIDY Research Center — « Celui qui contemple » — centre de référence en Sciences Humaines et Sociales de Madagascar et de l'Océan Indien.",
  openGraph: {
    title: "À propos — FINIDY Research Center",
    description: "Mission et vision du FINIDY Research Center, centre SHS de référence à Madagascar.",
    type: 'website' as const,
    url: 'https://finidy.mg/a-propos',
  },
  alternates: { canonical: 'https://finidy.mg/a-propos' },
};

export default function AProposPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <span className="eyebrow">À propos</span>
      <h1 className="font-display font-bold text-display-md text-nihary-ambre-fonce mt-1 mb-6">
        FINIDY Research Center — Celui qui contemple
      </h1>

      <div className="divider-or" />

      <div className="prose-nihary text-nihary-brun space-y-8 mt-8">
        <section>
          <h2 className="font-display font-semibold text-xl text-nihary-ambre-fonce mb-3">
            Notre mission
          </h2>
          <p>
            FINIDY Research Center est une plateforme de publication et de valorisation des Sciences Humaines et
            Sociales (SHS) ancrée à Madagascar, ouverte sur l'Océan Indien et l'Afrique. Notre
            mission est de fournir aux chercheurs, auteurs et praticiens un écosystème scientifique
            complet, rigoureux et accessible.
          </p>
          <p>
            Le nom FINIDY, qui signifie <em>celui qui contemple</em> en malgache, reflète notre
            engagement pour une science qui observe, réfléchit et engage le dialogue entre les
            disciplines et les cultures.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-xl text-nihary-ambre-fonce mb-3">
            Sept piliers, un projet commun
          </h2>
          <p>
            FINIDY Research Center structure son action autour de sept piliers complémentaires qui couvrent
            l'ensemble du cycle de la connaissance en SHS :
          </p>
          <ul className="list-disc pl-6 space-y-1 text-nihary-brun font-body">
            <li>
              <strong>La Revue scientifique</strong> — publication peer-reviewed en accès libre
            </li>
            <li>
              <strong>La Consultance</strong> — mise en relation entre experts et organisations
            </li>
            <li>
              <strong>Le Magazine</strong> — vulgarisation et actualité scientifique
            </li>
            <li>
              <strong>Les Entretiens</strong> — podcasts, vidéos et entretiens avec des chercheurs
            </li>
            <li>
              <strong>L'Édition</strong> — publication d'ouvrages et manuscrits
            </li>
            <li>
              <strong>Les Colloques</strong> — organisation et soutien aux conférences internationales
            </li>
            <li>
              <strong>L'Université Populaire</strong> — formations en ligne gratuites
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display font-semibold text-xl text-nihary-ambre-fonce mb-3">
            Notre ancrage régional
          </h2>
          <p>
            FINIDY Research Center est fondé à Antananarivo, Madagascar. Nous accordons une attention particulière
            aux savoirs produits dans l'Océan Indien, en Afrique subsaharienne et dans la diaspora
            malgache, tout en maintenant des standards scientifiques internationaux.
          </p>
          <p>
            Les publications sont acceptées en français, en malgache et en anglais, afin de refléter
            la diversité linguistique de notre espace géographique et intellectuel.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-xl text-nihary-ambre-fonce mb-3">
            Rejoindre FINIDY Research Center
          </h2>
          <p>
            FINIDY Research Center est ouvert à tous les chercheurs, auteurs, experts et passionnés de sciences
            humaines et sociales. Vous pouvez contribuer en soumettant un article, en proposant un
            cours, en rejoignant notre réseau d'experts ou simplement en vous inscrivant comme lecteur.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <Link href="/auth/inscription" className="btn-primary">
              Créer un compte
            </Link>
            <Link href="/contact" className="btn-outline">
              Nous contacter
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
