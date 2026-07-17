-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."Discipline" AS ENUM ('SOCIOLOGIE', 'ANTHROPOLOGIE', 'HISTOIRE', 'GEOGRAPHIE_HUMAINE', 'ECONOMIE', 'DROIT', 'SCIENCE_POLITIQUE', 'PHILOSOPHIE', 'PSYCHOLOGIE_SOCIALE', 'SCIENCES_EDUCATION', 'LINGUISTIQUE', 'COMMUNICATION', 'DEMOGRAPHIE', 'ETUDES_GENRE', 'ETUDES_MALGACHES', 'RELATIONS_INTERNATIONALES');

-- CreateEnum
CREATE TYPE "public"."FormatEntretien" AS ENUM ('PODCAST', 'VIDEO', 'TEXTE');

-- CreateEnum
CREATE TYPE "public"."Langue" AS ENUM ('FR', 'MG', 'EN');

-- CreateEnum
CREATE TYPE "public"."Niveau" AS ENUM ('DEBUTANT', 'INTERMEDIAIRE', 'AVANCE');

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'AUTEUR', 'LECTEUR', 'EXPERT', 'FORMATEUR');

-- CreateEnum
CREATE TYPE "public"."StatutArticle" AS ENUM ('BROUILLON', 'EN_ATTENTE', 'PUBLIE');

-- CreateEnum
CREATE TYPE "public"."StatutColloque" AS ENUM ('A_VENIR', 'OUVERT', 'CLOTURE', 'ARCHIVE');

-- CreateEnum
CREATE TYPE "public"."StatutDemande" AS ENUM ('EN_ATTENTE', 'EN_COURS', 'CLOTURE');

-- CreateEnum
CREATE TYPE "public"."StatutLivre" AS ENUM ('EN_ATTENTE', 'PUBLIE');

-- CreateEnum
CREATE TYPE "public"."StatutRevue" AS ENUM ('EN_ATTENTE', 'EN_REVISION', 'ACCEPTE', 'PUBLIE', 'REJETE');

-- CreateTable
CREATE TABLE "public"."Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Article" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "chapeau" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "imageUrl" TEXT,
    "discipline" "public"."Discipline" NOT NULL,
    "tags" TEXT[],
    "statut" "public"."StatutArticle" NOT NULL DEFAULT 'BROUILLON',
    "vues" INTEGER NOT NULL DEFAULT 0,
    "auteurId" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ArticleRevue" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "resume" TEXT NOT NULL,
    "motsCl├®s" TEXT[],
    "discipline" "public"."Discipline" NOT NULL,
    "langue" "public"."Langue" NOT NULL DEFAULT 'FR',
    "doi" TEXT,
    "fichierUrl" TEXT,
    "statut" "public"."StatutRevue" NOT NULL DEFAULT 'EN_ATTENTE',
    "accesLibre" BOOLEAN NOT NULL DEFAULT false,
    "vues" INTEGER NOT NULL DEFAULT 0,
    "telechargements" INTEGER NOT NULL DEFAULT 0,
    "volume" INTEGER,
    "numero" INTEGER,
    "pages" TEXT,
    "auteurId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArticleRevue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Chapitre" (
    "id" TEXT NOT NULL,
    "coursId" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "ordre" INTEGER NOT NULL,
    "videoUrl" TEXT,
    "contenu" TEXT,
    "dureeMin" INTEGER,

    CONSTRAINT "Chapitre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CoAuteur" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT,
    "institution" TEXT,
    "articleRevueId" TEXT NOT NULL,

    CONSTRAINT "CoAuteur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Colloque" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "lieu" TEXT NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3) NOT NULL,
    "dateLimit" TIMESTAMP(3),
    "statut" "public"."StatutColloque" NOT NULL DEFAULT 'A_VENIR',
    "imageUrl" TEXT,
    "programmeUrl" TEXT,
    "actesUrl" TEXT,
    "discipline" "public"."Discipline"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Colloque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Communication" (
    "id" TEXT NOT NULL,
    "colloqueId" TEXT NOT NULL,
    "sessionId" TEXT,
    "titre" TEXT NOT NULL,
    "auteurs" TEXT NOT NULL,
    "resume" TEXT NOT NULL,
    "fichierUrl" TEXT,
    "statut" "public"."StatutRevue" NOT NULL DEFAULT 'EN_ATTENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Communication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CompteRendu" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "chapitreId" TEXT NOT NULL,
    "termine" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CompteRendu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Cours" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "niveau" "public"."Niveau" NOT NULL DEFAULT 'DEBUTANT',
    "discipline" "public"."Discipline" NOT NULL,
    "dureeHeures" INTEGER,
    "gratuit" BOOLEAN NOT NULL DEFAULT true,
    "statut" "public"."StatutArticle" NOT NULL DEFAULT 'BROUILLON',
    "formateurId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DemandeConsultance" (
    "id" TEXT NOT NULL,
    "expertId" TEXT NOT NULL,
    "nomClient" TEXT NOT NULL,
    "emailClient" TEXT NOT NULL,
    "sujet" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "budget" DOUBLE PRECISION,
    "delai" TEXT,
    "statut" "public"."StatutDemande" NOT NULL DEFAULT 'EN_ATTENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DemandeConsultance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Entretien" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "format" "public"."FormatEntretien" NOT NULL,
    "mediaUrl" TEXT,
    "transcription" TEXT,
    "dureeMinutes" INTEGER,
    "imageUrl" TEXT,
    "discipline" "public"."Discipline" NOT NULL,
    "statut" "public"."StatutArticle" NOT NULL DEFAULT 'BROUILLON',
    "vues" INTEGER NOT NULL DEFAULT 0,
    "auteurId" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Entretien_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ExpertProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "specialites" TEXT[],
    "cvUrl" TEXT,
    "tarifHeure" DOUBLE PRECISION,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "ville" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExpertProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Inscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "coursId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Livre" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isbn" TEXT,
    "couvertureUrl" TEXT,
    "extraitUrl" TEXT,
    "lienAchat" TEXT,
    "collection" TEXT,
    "discipline" "public"."Discipline" NOT NULL,
    "annee" INTEGER NOT NULL,
    "pages" INTEGER,
    "statut" "public"."StatutLivre" NOT NULL DEFAULT 'EN_ATTENTE',
    "auteurId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Livre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Quiz" (
    "id" TEXT NOT NULL,
    "chapitreId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT[],
    "reponse" INTEGER NOT NULL,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session_" (
    "id" TEXT NOT NULL,
    "colloqueId" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "horaire" TIMESTAMP(3) NOT NULL,
    "lieu" TEXT,
    "animateur" TEXT,

    CONSTRAINT "Session__pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "password" TEXT,
    "image" TEXT,
    "role" "public"."Role" NOT NULL DEFAULT 'AUTEUR',
    "bio" TEXT,
    "institution" TEXT,
    "discipline" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "public"."Account"("provider" ASC, "providerAccountId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "public"."Article"("slug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "ArticleRevue_doi_key" ON "public"."ArticleRevue"("doi" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Colloque_slug_key" ON "public"."Colloque"("slug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "CompteRendu_userId_chapitreId_key" ON "public"."CompteRendu"("userId" ASC, "chapitreId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Cours_slug_key" ON "public"."Cours"("slug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Entretien_slug_key" ON "public"."Entretien"("slug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "ExpertProfile_userId_key" ON "public"."ExpertProfile"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Inscription_userId_coursId_key" ON "public"."Inscription"("userId" ASC, "coursId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Livre_isbn_key" ON "public"."Livre"("isbn" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Livre_slug_key" ON "public"."Livre"("slug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "public"."Session"("sessionToken" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "public"."VerificationToken"("identifier" ASC, "token" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "public"."VerificationToken"("token" ASC);

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Article" ADD CONSTRAINT "Article_auteurId_fkey" FOREIGN KEY ("auteurId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArticleRevue" ADD CONSTRAINT "ArticleRevue_auteurId_fkey" FOREIGN KEY ("auteurId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Chapitre" ADD CONSTRAINT "Chapitre_coursId_fkey" FOREIGN KEY ("coursId") REFERENCES "public"."Cours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CoAuteur" ADD CONSTRAINT "CoAuteur_articleRevueId_fkey" FOREIGN KEY ("articleRevueId") REFERENCES "public"."ArticleRevue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Communication" ADD CONSTRAINT "Communication_colloqueId_fkey" FOREIGN KEY ("colloqueId") REFERENCES "public"."Colloque"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Communication" ADD CONSTRAINT "Communication_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."Session_"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CompteRendu" ADD CONSTRAINT "CompteRendu_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cours" ADD CONSTRAINT "Cours_formateurId_fkey" FOREIGN KEY ("formateurId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DemandeConsultance" ADD CONSTRAINT "DemandeConsultance_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES "public"."ExpertProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Entretien" ADD CONSTRAINT "Entretien_auteurId_fkey" FOREIGN KEY ("auteurId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExpertProfile" ADD CONSTRAINT "ExpertProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inscription" ADD CONSTRAINT "Inscription_coursId_fkey" FOREIGN KEY ("coursId") REFERENCES "public"."Cours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inscription" ADD CONSTRAINT "Inscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Livre" ADD CONSTRAINT "Livre_auteurId_fkey" FOREIGN KEY ("auteurId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Quiz" ADD CONSTRAINT "Quiz_chapitreId_fkey" FOREIGN KEY ("chapitreId") REFERENCES "public"."Chapitre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session_" ADD CONSTRAINT "Session__colloqueId_fkey" FOREIGN KEY ("colloqueId") REFERENCES "public"."Colloque"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

