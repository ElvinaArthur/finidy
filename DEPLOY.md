# Déploiement FINIDY sur Vercel

## Services reliés au projet

1. Créer ou relier une base Neon depuis le Marketplace Vercel.
2. Créer un store Vercel Blob et le relier au même projet.
3. Configurer un domaine d'envoi vérifié chez Resend.

## Variables Vercel

```text
DATABASE_URL=postgresql://...-pooler.../neondb?sslmode=verify-full
DIRECT_URL=postgresql://.../neondb?sslmode=verify-full
AUTH_SECRET=<secret aléatoire long>
AUTH_URL=https://finidy.mg
NEXT_PUBLIC_SITE_URL=https://finidy.mg
BLOB_READ_WRITE_TOKEN=<injecté par Vercel Blob>
RESEND_API_KEY=<clé Resend>
EMAIL_FROM=FINIDY <no-reply@finidy.mg>
SEED_ADMIN_EMAIL=<adresse administrateur initiale>
SEED_ADMIN_PASSWORD=<secret unique de 14 caractères minimum>
```

Appliquer les migrations avec la connexion directe, puis initialiser la base une
seule fois :

```bash
npx prisma migrate deploy
npm run db:seed
```

Le build exécute automatiquement `npm run db:check` et échoue lorsque Neon est
inaccessible. Aucun mot de passe par défaut n'est présent dans le dépôt.

## Domaine

Ajouter `finidy.mg` et `www.finidy.mg` au projet Vercel, rediriger `www` vers le
domaine principal, puis publier les enregistrements DNS fournis par Vercel.
