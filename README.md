# eclairagemedia.com

Site d'Éclairage : archives jour par jour des newsletters, récaps de la semaine et du week-end, inscription.

- Next.js 16 + Tailwind v4, pages statiques générées depuis `content/`.
- `content/editions/<rubrique>/<date>.html` et `content/index.json` sont produits par `scripts/sync-editions.mjs`
  à partir du dossier `editions/` du dépôt privé des newsletters (`EDITIONS_DIR=... npm run sync`).
- Formulaire d'inscription : `/api/inscription` envoie la demande à bonjour@eclairagemedia.com via Brevo
  (variable `BREVO_API_KEY` à définir dans Vercel).
