import Link from "next/link";
import { ScrollText, PenLine, Mic, BookOpen, SearchX } from "lucide-react";
import SearchBar from "@/components/shared/SearchBar";

interface SearchResults {
  q: string;
  articlesRevue: {
    id: string;
    titre: string;
    resume: string;
    auteur: { name: string | null };
  }[];
  articlesMagazine: {
    id: string;
    slug: string;
    titre: string;
    chapeau: string;
    auteur: { name: string | null };
  }[];
  entretiens: {
    id: string;
    slug: string;
    titre: string;
    description: string;
  }[];
  livres: { id: string; slug: string; titre: string; description: string }[];
}

async function getResults(q: string): Promise<SearchResults> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const res = await fetch(
      `${baseUrl}/api/recherche?q=${encodeURIComponent(q)}`,
      { cache: "no-store" },
    );
    if (!res.ok) throw new Error();
    return res.json();
  } catch {
    return {
      q,
      articlesRevue: [],
      articlesMagazine: [],
      entretiens: [],
      livres: [],
    };
  }
}

export const metadata = { title: "Recherche | FINIDY Research Center" };

export default async function RecherchePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = q ? await getResults(q) : null;

  const totalResults = results
    ? results.articlesRevue.length +
      results.articlesMagazine.length +
      results.entretiens.length +
      results.livres.length
    : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <span className="eyebrow">Recherche</span>
      <h1 className="font-display font-bold text-display-md text-nihary-ambre-fonce mt-1 mb-6">
        Rechercher sur FINIDY Research Center
      </h1>

      <SearchBar defaultValue={q} className="mb-10 max-w-xl" />

      {!q && (
        <p className="text-nihary-gris font-body">
          Recherchez parmi les articles de la revue, le magazine, les entretiens
          et les ouvrages.
        </p>
      )}

      {q && totalResults === 0 && (
        <div className="card-sable p-12 text-center">
          <div className="flex justify-center mb-4 text-nihary-ambre">
            <SearchX size={40} strokeWidth={1.25} />
          </div>
          <p className="text-nihary-brun font-body">
            Aucun résultat pour <span className="font-medium">« {q} »</span>
          </p>
        </div>
      )}

      {results && totalResults > 0 && (
        <div className="space-y-10">
          {results.articlesRevue.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 font-display font-semibold text-lg text-nihary-ambre-fonce mb-3">
                <ScrollText size={18} strokeWidth={1.75} /> Revue scientifique
              </h2>
              <div className="space-y-3">
                {results.articlesRevue.map((a) => (
                  <Link
                    key={a.id}
                    href={`/revue/${a.id}`}
                    className="card p-4 block"
                  >
                    <p className="font-display font-medium text-nihary-ambre-fonce">
                      {a.titre}
                    </p>
                    <p className="text-sm text-nihary-gris font-body mt-1">
                      {a.auteur.name}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.articlesMagazine.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 font-display font-semibold text-lg text-nihary-ambre-fonce mb-3">
                <PenLine size={18} strokeWidth={1.75} /> Magazine
              </h2>
              <div className="space-y-3">
                {results.articlesMagazine.map((a) => (
                  <Link
                    key={a.id}
                    href={`/magazine/${a.slug}`}
                    className="card p-4 block"
                  >
                    <p className="font-display font-medium text-nihary-ambre-fonce">
                      {a.titre}
                    </p>
                    <p className="text-sm text-nihary-gris font-body mt-1">
                      {a.auteur.name}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.entretiens.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 font-display font-semibold text-lg text-nihary-ambre-fonce mb-3">
                <Mic size={18} strokeWidth={1.75} /> Entretiens
              </h2>
              <div className="space-y-3">
                {results.entretiens.map((e) => (
                  <Link
                    key={e.id}
                    href={`/entretiens/${e.slug}`}
                    className="card p-4 block"
                  >
                    <p className="font-display font-medium text-nihary-ambre-fonce">
                      {e.titre}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.livres.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 font-display font-semibold text-lg text-nihary-ambre-fonce mb-3">
                <BookOpen size={18} strokeWidth={1.75} /> Édition
              </h2>
              <div className="space-y-3">
                {results.livres.map((l) => (
                  <Link
                    key={l.id}
                    href={`/editions/${l.slug}`}
                    className="card p-4 block"
                  >
                    <p className="font-display font-medium text-nihary-ambre-fonce">
                      {l.titre}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
