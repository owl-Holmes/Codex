# Codex

Bibliothèque de connaissances personnelle — site statique (Astro + MDX), publié sur GitHub Pages.
Contenu rédigé en français, traduit en anglais par des agents IA.

## Démarrer

```bash
npm install
npm run dev        # http://localhost:4321/Codex/
```

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur local avec rechargement (brouillons visibles) |
| `npm run build` | Génère le site dans `dist/` + l'index de recherche |
| `npm run preview` | Sert le site généré |
| `npm run validate` | Types, lint, format, tests, contraste, audit de fuites |
| `npm run format` | Reformate le code (jamais le contenu) |
| `npm run test` | Tests unitaires (Vitest) |
| `npm run contrast` | Vérifie le contraste WCAG AA de chaque thème |
| `npm run links` | Vérifie les liens internes du site généré |
| `npm run new:page -- chemin/de/la-page` | Crée une page FR (brouillon) |
| `npm run i18n:status` | Traductions manquantes / obsolètes |
| `npm run i18n:stamp -- chemin.mdx` | Marque une traduction comme à jour |
| `npm run audit:leaks` | Cherche chemins locaux, e-mails et secrets dans les fichiers suivis |

## Modifier le contenu

- **Pages :** `src/content/docs/fr/…` (un fichier `.mdx` par page, dossiers = catégories).
- **Images / SVG :** `src/assets/images/<section>/…`, insérées avec `<Figure … />`.
- **Glossaire :** `src/content/glossary/fr/…`.
- **Depuis le navigateur :** [Pages CMS](https://app.pagescms.org) → se connecter avec GitHub → choisir ce dépôt.
- Les règles détaillées (et pour les agents IA) sont dans [AGENTS.md](AGENTS.md), les composants dans [docs/COMPONENTS.md](docs/COMPONENTS.md).

## Réglages GitHub à faire une fois

1. **Settings → Pages → Source : GitHub Actions.**
2. **Settings → Branches → Add rule** sur `main` (bloquer les force-push et la suppression).
3. Optionnel : **Settings → General** → désactiver Issues / Discussions / Wikis si inutiles ;
   **Moderation options → Interaction limits** pour limiter les interactions.

Le dépôt est public : tout le monde peut lire, seuls les comptes ayant un accès en écriture (toi) peuvent modifier.
