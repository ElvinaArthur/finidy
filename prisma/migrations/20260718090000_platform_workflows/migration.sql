ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "orcid" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "website" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "suspended" BOOLEAN NOT NULL DEFAULT false;

CREATE TYPE "EditorialRequestKind" AS ENUM ('RETRAIT', 'QUESTION');
CREATE TYPE "EditorialRequestStatus" AS ENUM ('EN_ATTENTE', 'ACCEPTEE', 'REFUSEE', 'TRAITEE');
CREATE TYPE "CrmStatut" AS ENUM ('NOUVEAU', 'EN_COURS', 'EN_ATTENTE', 'RESOLU', 'ARCHIVE');

ALTER TABLE "ContactMessage" ADD COLUMN IF NOT EXISTS "statut" "CrmStatut" NOT NULL DEFAULT 'NOUVEAU';
ALTER TABLE "ContactMessage" ADD COLUMN IF NOT EXISTS "notes" TEXT;
ALTER TABLE "ContactMessage" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "DemandeConsultance" ADD COLUMN IF NOT EXISTS "notes" TEXT;
ALTER TABLE "DemandeConsultance" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE "EditorialRequest" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "contentType" TEXT NOT NULL,
  "contentId" TEXT NOT NULL,
  "contentTitle" TEXT NOT NULL,
  "kind" "EditorialRequestKind" NOT NULL,
  "message" TEXT NOT NULL,
  "response" TEXT,
  "statut" "EditorialRequestStatus" NOT NULL DEFAULT 'EN_ATTENTE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "EditorialRequest_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "EditorialRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Notification" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "titre" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "lien" TEXT,
  "lue" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Notification_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "EditorialRequest_contentType_contentId_idx" ON "EditorialRequest"("contentType", "contentId");
CREATE INDEX "EditorialRequest_userId_createdAt_idx" ON "EditorialRequest"("userId", "createdAt");
CREATE INDEX "Notification_userId_lue_createdAt_idx" ON "Notification"("userId", "lue", "createdAt");
