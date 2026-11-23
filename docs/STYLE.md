# Guide de style graphique

Conventions visuelles du Codex. À lire (humains et agents IA) avant toute modification d'interface.
Le propriétaire édite ce fichier pour préciser ses goûts ; en cas de conflit, ce fichier prime sur
l'intuition de l'agent. Mécanique technique des thèmes : [THEMES.md](THEMES.md).

## 1. Principes

1. **Lisible d'abord.** Le texte est toujours posé sur une surface opaque ou un fond très voilé,
   jamais directement sur une illustration chargée.
2. **Épuré mais travaillé.** Pas de liste brute : chaque élément a une hiérarchie (pastille,
   titre, description, méta). « Basique » est un défaut, « chargé » aussi.
3. **Toute la largeur utile.** Pas de cartes étroites perdues dans du vide ; une grille qui s'adapte
   au nombre d'éléments (panneaux, fiches pleine largeur).
4. **Le titre de la page domine.** Les intitulés automatiques (« Dans cette section », « Sources »…)
   sont petits, en majuscules discrètes (`.block-heading`).
5. **Pas de doublon.** Une information affichée une fois (ex. aperçu au survol sur une carte qui
   montre déjà la description → désactivé).
6. **Clair ET sombre** vérifiés à chaque changement, ainsi que le mobile (375 px, pas de défilement
   horizontal).

**Page de référence :** une page de cours du thème `lab` (ex. `sciences/chimie/chimie-analytique/chromatographie`)
— jugée « épurée, complète, esthétique, élégante et lisible ».

## 2. Mise en page

| Élément | Règle |
|---|---|
| Grille | Symétrique : sidebar `--sidebar-width` · contenu `--content-max` · sommaire `--toc-width` (colonnes latérales égales → texte centré) |
| Feuille de lecture | Pages de cours uniquement (`.content:has(> article)`), fond `--sheet-bg` |
| Accueil, index (A–Z, glossaire, parcours, tags) | Ouverts sur le fond, sans grande boîte englobante |
| ≤ 1200 px | Sommaire au-dessus du contenu ; ≤ 960 px : une colonne |
| Fond de page | `--page-art` flouté (`--page-art-blur`) et désaturé (`--page-art-saturation`) sous `--page-veil` |

## 3. Typographie

| Usage | Police (jeton) |
|---|---|
| Texte courant, interface | IBM Plex Sans (`--font-body`, `--font-ui`) |
| Titres, thème de base | Fraunces (`--font-display`) — identité bibliothèque |
| Titres, thème `lab` | IBM Plex Sans |
| Code, étiquettes du thème `lab` | IBM Plex Mono (`--font-mono`, `--font-label`) |
| Marque « CODEX », eyebrows | Cinzel (`--font-brand`) |

Étiquettes (compteurs, dates, catégories) : classe `.ui-label` (petites majuscules espacées).

## 4. Couleurs et formes

- Uniquement des jetons (`var(--color-…)`), jamais de couleur en dur dans un composant.
- Contraste WCAG AA (≥ 4,5:1) : `npm run contrast`.
- Accent (`--color-accent`) : liens, numéros d'étape, éléments actifs. Ornement (`--color-ornament`) :
  filets décoratifs.
- Coins : `--radius` (petits éléments), `--radius-lg` (cartes) ; pastilles et bulles : `999px` / `50%`.
- Élévation : `--shadow-sm` au repos, `--shadow-lg` ou `--glow` au survol, léger déplacement (2–3 px).

## 5. Motifs d'interface (classes partagées, `src/styles/components.css`)

| Motif | Usage |
|---|---|
| `.badge` / `.badge--accent` | Petite pastille : section, nombre d'étapes, « Glossaire » |
| `.entry-card` | Carte arrondie, **entièrement cliquable** quand c'est un lien |
| `.link-card` | Ligne cliquable avec liseré (pages récentes) |
| `.letter-heading` | Bulle de lettre suivie d'un filet (glossaire) |
| `.block-heading` | Intitulé de bloc automatique |
| `LetterNav` | Barre de lettres en bulles, collante sous l'en-tête |
| `PathCard`, `StepProgress` | Carte de parcours (sections, trajet numéroté, barre segmentée, bouton) |

## 6. Thèmes de section

| Thème | Section | Esprit |
|---|---|---|
| `base` | Tout le site | Bibliothèque ancienne : bois, laiton, crème |
| `lab` | Sciences | Laboratoire blanc : papier millimétré, bleu instrument, Plex |
| `noir` | Enquête | Dossier d'enquête : gris, titres machine à écrire |
| `archive` | Histoire | Encre bordeaux et dorure |
| `alchemy` | (inutilisé) | Vert-de-gris et cuivre |

## 7. Comment demander un style précis

Une bonne demande donne des valeurs, pas des impressions :

1. **Référence** : capture ou URL, et ce qui plaît dedans.
2. **Périmètre** : tout le site, une section, une page ou un composant.
3. **Couleurs** : codes hex (`#0b5cad`) ou contraintes (« fond blanc pur, pas de dégradé »).
4. **Typo** : nom de la police, graisse des titres, taille du texte.
5. **Formes** : coins (px), ombres oui/non, densité (compact / aéré).
6. **Règles** : « définitions toujours en encadré bleu », « h2 numérotés »…
7. **À ne pas toucher** : « garde l'en-tête bois », « ne change pas le mode sombre ».

> Exemple : « Section chimie : fond #ffffff, accent #0b5cad, titres Plex Sans 700, coins 4 px,
> sans ombre, h2 numérotés, formules dans un encadré gris clair. Référence : capture jointe. »

## 8. Décisions du propriétaire (à compléter)

- Pas de bloc « Précédent / Suivant » en bas des pages.
- Pas de grande boîte autour de l'accueil.
- La sidebar reste étroite ; les titres longs passent à la ligne entre les mots, jamais au milieu.
