ALTER TABLE "User" ADD COLUMN "titreProfil" TEXT;
ALTER TABLE "User" ADD COLUMN "telephone" TEXT;
ALTER TABLE "User" ADD COLUMN "villeProfil" TEXT;
ALTER TABLE "User" ADD COLUMN "pays" TEXT;
ALTER TABLE "User" ADD COLUMN "linkedin" TEXT;
ALTER TABLE "User" ADD COLUMN "langues" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "User" ADD COLUMN "expertises" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

CREATE TYPE "TypeProduitPapier" AS ENUM ('REVUE', 'MAGAZINE');
CREATE TYPE "FormatPapier" AS ENUM ('LIVRE_RELIE', 'DOS_CARRE');
CREATE TYPE "StatutCommandePapier" AS ENUM ('NOUVELLE', 'CONFIRMEE', 'EN_PREPARATION', 'EXPEDIEE', 'LIVREE', 'ANNULEE');

CREATE TABLE "CommandePapier" (
  "id" TEXT NOT NULL,
  "typeProduit" "TypeProduitPapier" NOT NULL,
  "referenceId" TEXT,
  "titreProduit" TEXT NOT NULL,
  "format" "FormatPapier" NOT NULL,
  "quantite" INTEGER NOT NULL DEFAULT 1,
  "nomClient" TEXT NOT NULL,
  "emailClient" TEXT NOT NULL,
  "telephone" TEXT NOT NULL,
  "adresse" TEXT NOT NULL,
  "ville" TEXT NOT NULL,
  "pays" TEXT NOT NULL,
  "notes" TEXT,
  "statut" "StatutCommandePapier" NOT NULL DEFAULT 'NOUVELLE',
  "userId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CommandePapier_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CommandePapier_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "CommandePapier_statut_createdAt_idx" ON "CommandePapier"("statut", "createdAt");
CREATE INDEX "CommandePapier_emailClient_idx" ON "CommandePapier"("emailClient");
