# 2ᵉ CERVEAU — UI
Interface uniquement (mobile-first) façon dashboard de "second cerveau".

## Déploiement Netlify
1. `npm install`
2. `npm run build`
3. Uploade le dossier **dist/** sur Netlify ou connecte ton repo (build command: `npm run build`, publish: `dist`).

## Points clés
- **Mobile-first** : grille 2 colonnes sur téléphone, 3 colonnes sur desktop
- **Mode sombre** natif (mémorisé)
- **Composants "tiles"** cliquables (placeholder)
- Aucun stockage ni logique — **UI seulement**.


Routes ajoutées: /, /habits, /todo, /goals, /calendar, /training, /health, /settings.