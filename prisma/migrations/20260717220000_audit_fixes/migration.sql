-- Additive migration produced by the application audit.
ALTER TYPE "StatutLivre" ADD VALUE IF NOT EXISTS 'REJETE';

ALTER TABLE "Communication" ADD COLUMN IF NOT EXISTS "discipline" "Discipline";

CREATE TABLE IF NOT EXISTS "ContactMessage" (
  "id" TEXT NOT NULL,
  "nom" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "sujet" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "userId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
  ALTER TABLE "ContactMessage" ADD CONSTRAINT "ContactMessage_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "CompteRendu" ADD CONSTRAINT "CompteRendu_chapitreId_fkey"
    FOREIGN KEY ("chapitreId") REFERENCES "Chapitre"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
