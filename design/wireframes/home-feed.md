# AI Daily — Wireframe du fil d’actualités

## But

Décrire la structure de la page d’accueil avant de la transformer en HTML et CSS. Ce wireframe ne fixe pas encore les couleurs, les polices ni les autres détails visuels.

## Ordinateur

```text
┌────────────────────────────────────────────────────────────────────┐
│ AI Daily                         Accueil       Recherche [_______] │
├────────────────────────────────────────────────────────────────────┤
│ Actualités sur l’intelligence artificielle                         │
│ Les nouveautés et idées à suivre dans le domaine de l’IA.           │
│                                                                    │
│ Thèmes : [Tout] [Recherche] [Outils] [Entreprises]                  │
│                                                                    │
│ ┌──────────────────────────────────────────────────────────────┐   │
│ │ Thème · Source · Date                                        │   │
│ │ Titre de l’actualité                                         │   │
│ │ Résumé fourni par la source, s’il est disponible.            │   │
│ │ [Détails]                         [Lire à la source ↗]        │   │
│ └──────────────────────────────────────────────────────────────┘   │
│                                                                    │
│ ┌──────────────────────────────────────────────────────────────┐   │
│ │ Thème · Source · Date                                        │   │
│ │ Titre d’une autre actualité                                  │   │
│ │ [Détails]                         [Lire à la source ↗]        │   │
│ └──────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────┘
```

## Téléphone

```text
┌──────────────────────────────┐
│ AI Daily                     │
├──────────────────────────────┤
│ Actualités sur l’IA          │
│                              │
│ Rechercher… [____________]   │
│ [Tout] [Recherche] [Outils]  │
│                              │
│ ┌──────────────────────────┐ │
│ │ Thème · Source           │ │
│ │ Date                     │ │
│ │ Titre de l’actualité     │ │
│ │ Résumé, s’il existe.     │ │
│ │ [Détails]                │ │
│ │ [Lire à la source ↗]     │ │
│ └──────────────────────────┘ │
│                              │
│          …                   │
└──────────────────────────────┘
```

## Éléments à prévoir

- Le nom du produit et un accès à la page d’accueil.
- Une recherche basique et des filtres par thème, comme le prévoient les exigences.
- Pour chaque actualité : titre, source, date, thème éventuel et lien vers l’article original.
- Un résumé seulement quand la source en fournit un. La génération automatique est prévue dans une phase ultérieure.
- Un accès aux détails de l’actualité, qui pourra être conçu dans un wireframe séparé.
- Une mise en page en une colonne sur téléphone et une colonne de contenu plus large sur ordinateur.

## Questions à régler avant le code

- Quels thèmes afficher au départ ? Les libellés du dessin sont des exemples, pas une taxonomie validée.
- La recherche et les thèmes doivent-ils apparaître immédiatement dans la première version de la page, ou être ajoutés après le fil de base ?
- Quelle identité visuelle appliquer ? Aucune palette ni maquette finale n’est définie dans ce wireframe.
