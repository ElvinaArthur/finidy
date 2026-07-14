import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-nihary-ecru flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6 text-nihary-or">
          <SearchX size={64} strokeWidth={1} />
        </div>
        <p className="font-mono text-5xl font-bold text-nihary-or mb-2">404</p>
        <h1 className="font-display font-bold text-2xl text-nihary-ambre-fonce mb-3">
          Page introuvable
        </h1>
        <p className="text-nihary-gris font-body mb-8">
          Cette page n'existe pas ou a été déplacée. Revenez à l'accueil ou
          explorez les piliers de FINIDY Research Center.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/" className="btn-primary">
            Retour à l'accueil
          </Link>
          <Link href="/revue" className="btn-outline">
            Parcourir la revue
          </Link>
        </div>
      </div>
    </div>
  );
}
