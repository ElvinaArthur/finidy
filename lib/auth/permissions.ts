import type { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const PERMISSIONS = ["SUBMIT_REVUE", "SUBMIT_MAGAZINE", "SUBMIT_ENTRETIEN", "SUBMIT_LIVRE", "SUBMIT_COMMUNICATION", "SUBMIT_COURS", "MANAGE_EXPERT_PROFILE", "MANAGE_OFFERS", "PUBLISH_CONTENT", "MODERATE_CONTENT", "MANAGE_USERS", "VIEW_CRM"] as const;
export type Permission = typeof PERMISSIONS[number];
export const PERMISSION_LABELS: Record<Permission, string> = { SUBMIT_REVUE: "Soumettre à la revue", SUBMIT_MAGAZINE: "Proposer au magazine", SUBMIT_ENTRETIEN: "Proposer un entretien", SUBMIT_LIVRE: "Soumettre un manuscrit", SUBMIT_COMMUNICATION: "Soumettre une communication", SUBMIT_COURS: "Proposer un cours", MANAGE_EXPERT_PROFILE: "Gérer un profil expert", MANAGE_OFFERS: "Créer et modifier les offres", PUBLISH_CONTENT: "Publier sans validation", MODERATE_CONTENT: "Modérer les contenus", MANAGE_USERS: "Gérer les utilisateurs", VIEW_CRM: "Consulter le CRM" };

const defaults: Record<Role, Permission[]> = {
  ADMIN: [...PERMISSIONS],
  AUTEUR: ["SUBMIT_REVUE", "SUBMIT_MAGAZINE", "SUBMIT_ENTRETIEN", "SUBMIT_LIVRE", "SUBMIT_COMMUNICATION"],
  LECTEUR: [],
  EXPERT: ["SUBMIT_MAGAZINE", "SUBMIT_ENTRETIEN", "SUBMIT_COMMUNICATION", "MANAGE_EXPERT_PROFILE"],
  FORMATEUR: ["SUBMIT_MAGAZINE", "SUBMIT_ENTRETIEN", "SUBMIT_COURS"],
};

export function resolvePermissions(role: Role, granted: string[] = [], denied: string[] = []) { const valid = new Set<string>(PERMISSIONS); const result = new Set(defaults[role]); granted.filter((item) => valid.has(item)).forEach((item) => result.add(item as Permission)); denied.forEach((item) => result.delete(item as Permission)); return Array.from(result); }
export async function getAccess(userId: string) { const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true, suspended: true, permissions: true, deniedPermissions: true } }); if (!user || user.suspended) return null; return { role: user.role, permissions: resolvePermissions(user.role, user.permissions, user.deniedPermissions) }; }
export async function hasPermission(userId: string, permission: Permission) { const access = await getAccess(userId); return Boolean(access?.permissions.includes(permission)); }
export const forbiddenPermissionResponse = { error: "Votre compte n’est pas autorisé à effectuer cette action", code: "PERMISSION_REQUIRED" };
