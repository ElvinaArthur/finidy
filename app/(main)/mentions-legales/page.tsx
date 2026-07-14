export const metadata = {
  title: "Mentions légales | FINIDY Research Center",
  description: "Mentions légales, conditions d'utilisation et informations juridiques du FINIDY Research Center.",
  robots: { index: false, follow: false },
};

export default function MentionsLegalesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <span className="eyebrow">Informations légales</span>
      <h1 className="font-display font-bold text-display-md text-nihary-ambre-fonce mt-1 mb-6">
        Mentions légales
      </h1>

      <div className="divider-or" />

      <div className="prose-nihary text-nihary-brun space-y-8 mt-8">
        <section>
          <h2 className="font-display font-semibold text-xl text-nihary-ambre-fonce mb-3">
            Éditeur du site
          </h2>
          <p>
            <strong>FINIDY Research Center</strong><br />
            Plateforme de publication en Sciences Humaines et Sociales<br />
            Antananarivo, Madagascar<br />
            Contact : <a href="mailto:contact@nihary.mg" className="text-nihary-or hover:underline">contact@nihary.mg</a>
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-xl text-nihary-ambre-fonce mb-3">
            Hébergement
          </h2>
          <p>
            Ce site est hébergé par <strong>Vercel Inc.</strong>, 340 Pine Street, Suite 1200,
            San Francisco, CA 94104, États-Unis. La base de données est hébergée via{" "}
            <strong>Supabase</strong>.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-xl text-nihary-ambre-fonce mb-3">
            Propriété intellectuelle
          </h2>
          <p>
            L'ensemble du contenu éditorial de ce site (articles, textes, images, logos) est la
            propriété de leurs auteurs respectifs. Les auteurs conservent leurs droits d'auteur sur
            leurs œuvres publiées sur FINIDY Research Center.
          </p>
          <p>
            Le code source de la plateforme, le design et les éléments graphiques propres à FINIDY Research Center
            sont la propriété de FINIDY Research Center. Toute reproduction sans autorisation est interdite.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-xl text-nihary-ambre-fonce mb-3">
            Données personnelles
          </h2>
          <p>
            Les données personnelles collectées (nom, adresse email, institution) sont utilisées
            uniquement dans le cadre du fonctionnement de la plateforme (création de compte,
            publication, communication). Elles ne sont pas transmises à des tiers.
          </p>
          <p>
            Conformément à la réglementation applicable, vous disposez d'un droit d'accès, de
            rectification et de suppression de vos données. Pour exercer ces droits, contactez-nous
            à l'adresse indiquée ci-dessus.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-xl text-nihary-ambre-fonce mb-3">
            Cookies
          </h2>
          <p>
            Ce site utilise des cookies techniques nécessaires à son fonctionnement (session
            d'authentification). Aucun cookie publicitaire ou de traçage tiers n'est utilisé.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-xl text-nihary-ambre-fonce mb-3">
            Responsabilité
          </h2>
          <p>
            FINIDY Research Center s'efforce d'assurer l'exactitude des informations publiées sur ce site, mais ne
            peut garantir l'exhaustivité ou l'actualité de ces informations. Les opinions exprimées
            dans les articles sont celles de leurs auteurs et n'engagent pas FINIDY Research Center.
          </p>
        </section>
      </div>
    </div>
  );
}
