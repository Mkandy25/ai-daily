# AI Daily

AI Daily rassemble des actualités sur l’intelligence artificielle dans un fil avec recherche, filtres et pages de détail. L’interface est disponible en français et en anglais.

## Démarrer le projet en local

Le backend FastAPI sert aussi le frontend. Il suffit donc de lancer un seul serveur :

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install -r requirements.txt
fastapi dev main.py
```

Ouvre ensuite <http://127.0.0.1:8000/> dans ton navigateur. Pour arrêter le serveur, retourne au terminal et appuie sur `Ctrl+C`.

## Résumés bilingues

Le fil RSS fonctionne sans compte Cloudflare. La génération d’explications en français et en anglais est une fonction optionnelle qui utilise Cloudflare Workers AI.

Pour l’activer en local, copie `backend/.env.example` vers `backend/.env`, puis renseigne `CLOUDFLARE_ACCOUNT_ID` et `CLOUDFLARE_API_TOKEN`. Le fichier `.env` est ignoré par Git : ne publie jamais son contenu.

Sur Vercel, ouvre ton projet puis va dans **Settings → Environment Variables**. Ajoute `CLOUDFLARE_ACCOUNT_ID` et `CLOUDFLARE_API_TOKEN` comme deux variables séparées, coche **Production** et **Preview**, puis enregistre. Redéploie ensuite le projet pour appliquer les valeurs. Ne mets jamais le jeton dans un fichier frontend ni dans un commit GitHub.

## Organisation des fichiers

```text
backend/          API FastAPI, dépendances Python et exemple de configuration locale
frontend/         Pages HTML, styles, scripts et traductions du site
public/           Images, logos et autres ressources publiques
design/           Maquettes et wireframes
docs/version-fr/  Documentation du projet en français
docs/version-en/  Documentation du projet en anglais
pyproject.toml    Dépendances et configuration de déploiement Vercel
```

Les dépendances de développement local sont dans `backend/requirements.txt`. Celles du déploiement sont déclarées dans `pyproject.toml`; garde les deux listes cohérentes.
