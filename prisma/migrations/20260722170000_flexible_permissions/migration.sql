ALTER TABLE "User" ADD COLUMN "permissions" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "User" ADD COLUMN "deniedPermissions" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

CREATE TABLE "Opportunity" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "titre" TEXT NOT NULL,
  "organisation" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "statut" TEXT NOT NULL DEFAULT 'BROUILLON',
  "payload" JSONB NOT NULL,
  "createdById" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Opportunity_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Opportunity_slug_key" ON "Opportunity"("slug");
CREATE INDEX "Opportunity_statut_createdAt_idx" ON "Opportunity"("statut", "createdAt");
