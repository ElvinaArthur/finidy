import { auth } from "@/lib/auth/config";
import { getAccess } from "@/lib/auth/permissions";

/**
 * Vérifie que l'utilisateur connecté a le rôle ADMIN.
 * Retourne la session si oui, null sinon.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }
  const access = await getAccess(session.user.id);
  if (!access || access.role !== "ADMIN") return null;
  return session;
}
