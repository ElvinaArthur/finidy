import { auth } from "@/lib/auth/config";

/**
 * Vérifie que l'utilisateur connecté a le rôle ADMIN.
 * Retourne la session si oui, null sinon.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return null;
  }
  return session;
}
