import Link from 'next/link'

export default function AuthErrorPage() {
  return <div className="max-w-lg mx-auto px-4 py-20 text-center">
    <h1 className="font-display text-2xl font-bold text-nihary-ambre-fonce">Connexion impossible</h1>
    <p className="my-4 text-nihary-gris">Le lien de connexion est invalide ou a expiré. Réessayez depuis la page de connexion.</p>
    <Link href="/auth/connexion" className="btn-primary">Retour à la connexion</Link>
  </div>
}
