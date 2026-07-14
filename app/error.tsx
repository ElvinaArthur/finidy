"use client";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="fr">
      <body className="bg-nihary-ecru font-body antialiased">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="flex justify-center mb-6 text-nihary-ambre">
              <AlertTriangle size={56} strokeWidth={1} />
            </div>
            <h1 className="font-display font-bold text-2xl text-nihary-ambre-fonce mb-3">
              Une erreur est survenue
            </h1>
            <p className="text-nihary-gris font-body mb-8">
              Quelque chose s'est mal passé. Veuillez réessayer ou revenir à l'accueil.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button onClick={reset} className="btn-primary">
                Réessayer
              </button>
              <a href="/" className="btn-outline">
                Retour à l'accueil
              </a>
            </div>
            {error.digest && (
              <p className="mt-6 text-xs font-mono text-nihary-gris-clair">
                Référence : {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
