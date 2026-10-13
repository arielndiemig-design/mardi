# Suivi de dossier BUNEC

Portail web de consultation des publications et de suivi des dossiers d’état
civil. Le frontend Vite et l’API Express sont servis par le même processus et
le même port HTTP.

## Arborescence

```text
server.js                  Point d’entrée npm
backend/
  app.js                   Middleware Express et montage frontend
  server.js                Serveur HTTP unique et chargement de .env
  database/pool.js         Pool PostgreSQL
  routes/api.js            Routes API
  services/                Accès aux données métier
  middleware/security.js   Sessions, CSRF, limitation et en-têtes
public/
  index.html               Shell Vite
   frontend/                Sections HTML assemblées par Vite
  src/main.js              Comportements du navigateur
  src/styles.css           Styles personnalisés
  src/tailwind.config.js   Configuration Tailwind
  images/                  Images du portail
database/
  schema.sql               Schéma PostgreSQL
  seeds/                   Référentiels territoriaux
dist/                      Build de production généré
```

`node_modules/` et `dist/` sont exclus de Git et masqués dans l’explorateur
VS Code pour garder l’arborescence lisible.

## Prérequis

- Node.js 18 ou plus récent et npm.
- PostgreSQL 15 ou plus récent pour le suivi en base.
- Un rôle PostgreSQL disposant des droits nécessaires sur le schéma BUNEC.

## Installation locale

Depuis la racine du dépôt :

```sh
npm install
cp backend/.env.example .env
```

Sur une machine Linux où PostgreSQL vient d’être installé, un administrateur
du serveur doit d’abord créer le rôle et la base. Ces commandes demandent les
droits système PostgreSQL et ne sont pas exécutées par l’application :

```sh
sudo -u postgres createuser --pwprompt bunec
sudo -u postgres createdb --owner=bunec bunec
```

Utiliser le mot de passe saisi dans `DATABASE_URL` du fichier `.env`, puis
initialiser le schéma et le référentiel :

```sh
psql "$DATABASE_URL" -f database/schema.sql
psql "$DATABASE_URL" -f database/seeds/seed_regions_communes.sql
```

Le schéma ne crée pas les centres d’état civil ni les dossiers de production.
Ils doivent être chargés dans `centres_etat_civil` et `dossiers_suivi` avant
qu’une recherche réelle puisse aboutir.

Démarrage en développement :

```sh
npm run dev
```

Ouvrir `http://localhost:3000`. `PORT` peut remplacer `3000`; Express et Vite
restent attachés au même serveur HTTP.

## Recherche de dossier

Le formulaire envoie une seule valeur d’identification avec la région, la
commune et le type d’acte sélectionnés. Le backend compare exactement le
numéro de récépissé, l’identifiant BUNEC, le téléphone, l’email ou le nom du
demandeur, au moyen de paramètres SQL. Les correspondances partielles et les
dossiers de démonstration ne sont pas utilisés comme solution de repli.

Sans base configurée ou joignable, l’API de suivi répond `503`. Si aucun dossier
ne correspond aux critères exacts, elle répond `404`.

`GET /api/v1/health` vérifie la connexion PostgreSQL avec `SELECT 1` et répond
`200` si la base est joignable, sinon `503`.

## Mise en production

1. Installer Node.js et PostgreSQL sur le serveur. Créer la base et un rôle
   PostgreSQL dédié à l’application; éviter d’utiliser le rôle superuser.
2. Déployer le dépôt dans le répertoire applicatif, puis installer les
   dépendances verrouillées :

   ```sh
   npm ci
   ```

3. Créer `.env` à la racine du projet. Ce fichier ne doit jamais être ajouté à
   Git. Définir au minimum :

   ```dotenv
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=postgresql://utilisateur:mot_de_passe@127.0.0.1:5432/bunec
   BUNEC_SESSION_SECRET=<secret-aleatoire-long>
   BUNEC_ADMIN_USERNAME=<identifiant-admin>
   BUNEC_ADMIN_PASSWORD_SALT=<sel-aleatoire>
   BUNEC_ADMIN_PASSWORD_HASH=<hash-pbkdf2-sha256>
   ```

   Générer des valeurs aléatoires pour le secret de session et le sel, par
   exemple avec `openssl rand -hex 32`. Le hash du mot de passe admin doit être
   calculé avec PBKDF2, SHA-256, 220 000 itérations, 32 octets et le sel
   `BUNEC_ADMIN_PASSWORD_SALT`. Le secret et le mot de passe ne doivent pas
   être écrits dans le dépôt ou les journaux.

4. Initialiser le schéma et les données de référence avec `psql`, comme dans
   la section d’installation. Charger également les centres et dossiers réels.
5. Compiler puis démarrer le mode production :

   ```sh
   npm run build
   npm start
   ```

   En production, Express sert le contenu de `dist/`; Vite n’ouvre pas de
   second port. Le service écoute sur `0.0.0.0:$PORT`.
6. Placer le service derrière un reverse proxy HTTPS (par exemple Nginx),
   transmettre `X-Forwarded-Proto: https`, limiter l’accès réseau à PostgreSQL
   et configurer le gestionnaire de processus du serveur pour relancer
   `npm start` après un redémarrage.
7. Vérifier `https://<nom-de-domaine>/`, puis se connecter au portail admin.
   Les routes d’administration exigent la session signée et le jeton CSRF.

Le hash attendu est produit par `crypto.pbkdf2Sync(motDePasse, sel, 220000,
32, "sha256").toString("hex")`. En mode production, le serveur refuse de
démarrer si le secret de session, le hash admin ou son sel manque.

## État des données

Le suivi citoyen utilise PostgreSQL. Les listes de bans et l’historique admin
présents dans cette version restent des jeux de démonstration en mémoire; leurs
routes ne sont pas encore persistées dans PostgreSQL. Ne pas les considérer
comme des données de production.
