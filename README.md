# Nihary — Plateforme SHS Madagascar

Plateforme de publication scientifique en Sciences Humaines et Sociales.

## Stack

- **Next.js 14** (App Router)
- **Prisma** (ORM) + **Supabase** (PostgreSQL)
- **NextAuth.js v5** (auth email/password)
- **Tailwind CSS** (palette jaune-brun Nihary)

## Démarrage local

```bash
# 1. Variables d'environnement
cp .env.example .env.local
# Remplir avec vos clés Supabase

# 2. Générer le client Prisma + pousser le schéma
npx prisma generate
npx prisma db push
npx prisma db seed

# 3. Lancer
npm run dev
```

## Déploiement Vercel

Voir `DEPLOY.md` pour le guide complet étape par étape.

## Compte admin

- Email : `niharyadmin.mg`
- Mot de passe initial : `NiharyAdmin2024!`
- **À changer immédiatement après le premier déploiement**

## 7 piliers

| Pilier | Route |
|--------|-------|
| Revue scientifique | `/revue` |
| Consultance | `/consultance` |
| Magazine | `/magazine` |
| Entretiens | `/entretiens` |
| Édition | `/editions` |
| Colloques | `/colloques` |
| Université Populaire | `/universite-populaire` |
