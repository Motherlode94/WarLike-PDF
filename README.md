# WarLike PDF

Éditeur PDF **autonome** côté navigateur. Ne dépend ni du Hub ni de WarLike Server.

## Fonctions

- Importation de plusieurs PDF (6 fichiers maximum, 20 Mo/fichier, 150 pages).
- Fusion, réorganisation, duplication et suppression de pages.
- Rotation par incréments de 90°.
- Ajout de textes positionnés en pourcentage de la page et enregistrés dans le PDF exporté.
- Prévisualisation PDF avec PDF.js si disponible, export réel via pdf-lib.
- Les PDF restent dans la mémoire locale du navigateur, **jamais envoyés au serveur**.

## Déploiement

Site statique : publier la racine du dépôt sur Cloudflare Pages ou GitHub Pages. En local :

```sh
python -m http.server 8080
```

L'application charge deux bibliothèques JavaScript depuis jsDelivr au démarrage : `pdf-lib@1.17.1` et `pdfjs-dist@4.10.38`. Une connexion est requise pour leur chargement initial. Les fichiers PDF eux-mêmes ne quittent pas le navigateur.

## Limites

- Les PDF chiffrés / protégés par mot de passe ne sont pas pris en charge.
- Ajout de texte uniquement, **pas de réécriture** des paragraphes originaux ni de caviardage sécurisé.
- L'aperçu des annotations est indicatif sur les pages tournées.
- La police standard Helvetica peut ne pas prendre en charge tous les caractères Unicode.
- Les signatures PDF existantes sont invalidées par toute modification ; conserver l'original.
- Aucune sauvegarde de projet ni fonction de signature numérique.
- Tests manuels de rendu et d'export nécessaires dans un vrai navigateur.

## Bibliothèques

- pdf-lib (MIT) : https://pdf-lib.js.org/
- PDF.js (Apache-2.0) : https://mozilla.github.io/pdf.js/

## Fiabilité de l'import

L'import multipièces est désormais transactionnel au niveau du projet en mémoire : tous les documents sélectionnés sont validés avant d'ajouter leurs pages. Un PDF vide, invalide, chiffré ou dépassant les limites annule le lot sans ajouter de pages partielles. Le navigateur et l'export PDF restent à valider manuellement.
