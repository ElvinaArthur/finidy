import { isRecord } from "@/lib/api-validation";

export type SubmissionEvidence = { auteurs: string; thumbnailUrl: string; cvUrl: string; contentUrl: string; contentName: string; contentMime: string; declarationAcceptedAt: string; declarationVersion: string };

export function submissionEvidence(value: unknown): SubmissionEvidence | null {
  if (!isRecord(value) || !isRecord(value.submissionEvidence)) return null;
  const item = value.submissionEvidence;
  const required = ["auteurs", "thumbnailUrl", "cvUrl", "contentUrl", "contentName", "contentMime", "declarationAcceptedAt", "declarationVersion"] as const;
  if (!required.every((key) => typeof item[key] === "string" && String(item[key]).trim())) return null;
  return Object.fromEntries(required.map((key) => [key, String(item[key]).trim()])) as SubmissionEvidence;
}

export const missingEvidenceResponse = { error: "Miniature, fichier principal, CV, auteurs et déclaration sur l’honneur sont obligatoires" };
