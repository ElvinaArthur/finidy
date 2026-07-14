# Guide de déploiement Nihary sur Vercel

## 1. Supabase — Créer le projet

1. Aller sur https://supabase.com → New Project
2. Nom : `nihary` | Région : `eu-central-1` (Frankfurt, le plus proche de Madagascar)
3. Récupérer depuis Settings → Database :
   - `DATABASE_URL` (Connection pooling → Transaction mode)
   - `DIRECT_URL` (Connection pooling → Session mode)
4. Récupérer depuis Settings → API :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

## 2. Supabase Storage — Créer les buckets

Dans Supabase → Storage → New bucket :
- `articles-pdf` (public: false)
- `couvertures` (public: true)
- `avatars` (public: true)
- `entretiens-media` (public: true)

## 3. Variables d'environnement locales

Copier `.env.example` vers `.env.local` et remplir :

```bash
cp .env.example .env.local
# Générer NEXTAUTH_SECRET :
openssl rand -base64 32
```

## 4. Pousser le schéma Prisma vers Supabase

```bash
npx prisma db push
npx prisma db seed
```

## 5. Déployer sur Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Ajouter les variables d'env sur Vercel
vercel env add DATABASE_URL
vercel env add DIRECT_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL          # https://nihary.vercel.app
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY

# Redéployer avec les variables
vercel --prod
```

## 6. Compte admin créé automatiquement par le seed

- Email    : niharyadmin.mg
- Password : NiharyAdmin2024!
- ⚠️ Changer le mot de passe immédiatement après le premier déploiement

## Structure des URLs en production

| Pilier | URL |
|--------|-----|
| Accueil | https://nihary.vercel.app |
| Revue | https://nihary.vercel.app/revue |
| Magazine | https://nihary.vercel.app/magazine |
| Consultance | https://nihary.vercel.app/consultance |
| Entretiens | https://nihary.vercel.app/entretiens |
| Édition | https://nihary.vercel.app/editions |
| Colloques | https://nihary.vercel.app/colloques |
| Univ. Populaire | https://nihary.vercel.app/universite-populaire |
| Admin | https://nihary.vercel.app/admin |
