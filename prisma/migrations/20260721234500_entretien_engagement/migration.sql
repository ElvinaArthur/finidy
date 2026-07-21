CREATE TYPE "TypeReaction" AS ENUM ('AIME', 'COEUR', 'INSPIRANT', 'PERTINENT');

CREATE TABLE "EntretienComment" (
  "id" TEXT NOT NULL,
  "entretienId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "contenu" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "EntretienComment_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "EntretienComment_entretienId_fkey" FOREIGN KEY ("entretienId") REFERENCES "Entretien"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "EntretienComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "EntretienReaction" (
  "id" TEXT NOT NULL,
  "entretienId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" "TypeReaction" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "EntretienReaction_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "EntretienReaction_entretienId_fkey" FOREIGN KEY ("entretienId") REFERENCES "Entretien"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "EntretienReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "EntretienComment_entretienId_createdAt_idx" ON "EntretienComment"("entretienId", "createdAt");
CREATE INDEX "EntretienComment_userId_idx" ON "EntretienComment"("userId");
CREATE UNIQUE INDEX "EntretienReaction_entretienId_userId_key" ON "EntretienReaction"("entretienId", "userId");
CREATE INDEX "EntretienReaction_entretienId_type_idx" ON "EntretienReaction"("entretienId", "type");
