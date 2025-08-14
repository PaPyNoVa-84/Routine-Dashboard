# Routine Dashboard
Prêt pour déploiement sur Netlify.

## Déploiement rapide (sans terminal)
1. Télécharge le ZIP ci-dessous et décompresse-le.
2. Va sur app.netlify.com > Sites > **Add new site** > **Deploy manually**.
3. Fais **glisser le dossier `dist`** généré après build, OU connecte le repo et laisse Netlify builder automatiquement.

### Option A — Upload du dossier `dist`
- Ouvre un terminal dans le dossier et lance:
  - `npm install`
  - `npm run build`
- Un dossier `dist` apparaît. Fais glisser ce dossier dans Netlify (Deploy manually).

### Option B — Build automatique par Netlify
- Envoie le dossier sur un repo Git (GitHub).
- Dans Netlify: New site from Git > connecte le repo.
- Netlify lira `netlify.toml`, fera `npm run build` et publiera `dist`.

## Utilisation
- Tout est stocké en **localStorage** sur ton appareil.
- Boutons **Exporter/Importer** pour sauvegarder/charger ta progression.
