# BUNEC — Plateforme Souveraine de Suivi d'État Civil & Publication des Bans

> **République du Cameroun** • *Paix - Travail - Patrie*  
> **Bureau National de l'État Civil (BUNEC)**  
> Conformité stricte avec la Loi N° 2011/011 du 6 mai 2011 régissant l'état civil au Cameroun.

---

## 🏛️ Présentation du Projet

Cette plateforme web souveraine et résiliente assure deux missions stratégiques nationales :
1. **Moteur de Suivi de Dossier Citoyen** : Consultation en temps réel du cycle de vie des actes d'état civil (Naissance, Mariage, Décès, Déclaration Tardive / Jugement Supplétif) avec timeline à 4 étapes, identification instantanée du type d'acte, gestion des motifs de blocage et alertes automatiques SMS / WhatsApp (`+237`).
2. **Registre Dématérialisé des Publications de Bans de Mariage** : Publication légale préalable obligatoire de 30 jours (Article 53), compte à rebours interactif à la seconde, et procédure solennelle de saisine d'opposition en ligne avec horodatage certifié HMAC-SHA256 et auto-compression client WebP.

---

## 📂 Architecture des Dossiers

Le projet est conçu selon une architecture logicielle modulaire, propre et standardisée :

```text
SUIVIE STATUT/
├── server.js               # Serveur Web & API REST natif Node.js autonome (Zéro-dépendance au démarrage)
├── package.json            # Scripts universels de démarrage, compilation et conteneurisation
├── Dockerfile              # Image Docker de production Alpine Linux ultra-légère (< 80 Mo)
├── docker-compose.yml      # Orchestration multi-services (Application + PostgreSQL 16 + Redis 7)
├── nginx.conf              # Configuration Reverse Proxy Nginx, SSL, Gzip et optimisation mobile
├── .env.example            # Gabarit des variables d'environnement (Base de données, HMAC, SMS)
├── demarrer.sh             # Script de lancement universel en 1 clic
├── lancer_mobile.sh        # Simulateur tactile format smartphone (412 x 915)
│
├── public/                 # Interface Web Citoyenne Interactive
│   └── index.html          # Application complète, responsive, accessible (Tailwind + Vanilla JS)
│
├── frontend/               # Code Source Frontend Moderne (React 18 + TypeScript + Vite + Tailwind)
│   ├── package.json        # Dépendances React & Vite
│   ├── vite.config.ts      # Configuration Vite avec proxy API
│   ├── tsconfig.json       # Configuration TypeScript stricte
│   └── src/
│       ├── main.tsx        # Point d'entrée React
│       ├── App.tsx         # Composant racine
│       ├── components/     # Composants réutilisables (Formulaire, Timeline, Grille des Bans)
│       ├── data/           # Référentiel territorial des 10 régions du Cameroun
│       ├── types/          # Types TypeScript métier
│       └── utils/          # Compresseur d'images client (Canvas / WebP < 400 Ko)
│
├── backend/                # Code Source Backend d'Ingestion & Pipeline de Compression
│   ├── package.json        # Dépendances Express, Sharp, Ghostscript, PG, Redis
│   ├── tsconfig.json       # Configuration TypeScript
│   └── src/
│       ├── server.ts       # Serveur Express & API REST
│       ├── controllers/    # Contrôleurs métier (Bans, Suivi)
│       ├── middleware/     # Pipeline d'ingestion et compression multithreadée
│       ├── services/       # Optimiseurs d'images WebP, PDF et synchronisation BUNEC
│       └── config/         # Configuration des connexions (PostgreSQL, Redis)
│
├── database/               # Base de Données Relationnelle Souveraine
│   ├── schema.sql          # Schéma DDL PostgreSQL (ENUMs stricts, tables, clés étrangères, index B-Tree)
│   └── seeds/
│       ├── bunec_referentiel_territorial.json # Référentiel officiel des 10 Régions & Communes du Cameroun
│       └── seed_regions_communes.sql          # Script SQL d'injection du référentiel territorial
│
├── docs/                   # Documentation Institutionnelle Complète
│   └── CAHIER_DES_CHARGES_TECHNIQUE_ET_FONCTIONNEL.md # Spécifications complètes (11 sections)
│
└── .vscode/                # Configuration pré-intégrée pour Visual Studio Code / Cursor
    ├── launch.json         # Débogage F5 immédiat
    ├── tasks.json          # Tâches automatisées de démarrage
    ├── settings.json       # Règles de formatage et linting
    └── extensions.json     # Extensions recommandées
```

---

## 💻 Ouverture dans n'importe quel Éditeur de Code

Ce projet respecte les standards universels de développement et s'ouvre immédiatement dans tous les éditeurs :

* **Visual Studio Code / Cursor** :
  ```bash
  code "/home/bunec/Bureau/SUIVIE STATUT"
  ```
  *(Appuyez sur `F5` pour lancer le débogage direct du serveur).*
* **WebStorm / IntelliJ IDEA** :
  Ouvrez le dossier en tant que projet Node.js / TypeScript.
* **Sublime Text** :
  ```bash
  subl "/home/bunec/Bureau/SUIVIE STATUT"
  ```
* **Terminal / Neovim / Vim** :
  ```bash
  cd "/home/bunec/Bureau/SUIVIE STATUT" && nvim .
  ```

---

## 🚀 Démarrage & Exécution Locale

### Option A : Démarrage Universel en 1 Clic (Recommandé)
Double-cliquez sur `demarrer.sh` ou exécutez dans votre terminal :
```bash
bash "/home/bunec/Bureau/SUIVIE STATUT/demarrer.sh"
```
Le serveur démarre immédiatement et votre navigateur s'ouvre sur **`http://localhost:3000`**.

### Option B : Démarrage avec Node.js
```bash
cd "/home/bunec/Bureau/SUIVIE STATUT"
npm start
# ou directement : node server.js
```

### Option C : Simulation Smartphone (412 x 915)
Pour tester l'affichage tactile sur votre ordinateur :
```bash
bash "/home/bunec/Bureau/SUIVIE STATUT/lancer_mobile.sh"
```

### Option D : Test sur Smartphone Réel (Même Wi-Fi)
1. Vérifiez l'adresse IP de votre PC (ex: `192.168.1.50`).
2. Ouvrez le navigateur de votre téléphone et saisissez :
   `http://192.168.1.50:3000`

---

## 🌐 Déploiement & Hébergement en Production

### 1. Hébergement Conteneurisé avec Docker & Docker Compose
Le moyen le plus simple et robuste pour déployer sur un VPS ou serveur souverain (Ubuntu, Debian, RHEL) :
```bash
cd "/home/bunec/Bureau/SUIVIE STATUT"
docker compose up -d --build
```
Cela démarre :
- L'application web BUNEC sur le port **3000**
- PostgreSQL 16 avec initialisation automatique du schéma et des 10 régions sur le port **5432**
- Redis 7 pour la mise en cache sur le port **6379**

### 2. Déploiement sur Serveur Linux Nu (VPS / Cloud Souverain)
1. Installez Node.js 20+ et PM2 :
   ```bash
   npm install -g pm2
   ```
2. Démarrez l'application avec PM2 (redémarrage automatique en cas de panne) :
   ```bash
   pm2 start server.js --name "bunec-plateforme"
   pm2 save
   pm2 startup
   ```
3. Configurez Nginx comme Reverse Proxy avec le fichier fourni `nginx.conf`.
4. Installez le certificat SSL avec Certbot :
   ```bash
   certbot --nginx -d etatcivil.bunec.cm -d bans.bunec.cm
   ```

### 3. Déploiement sur PaaS (Render, Railway, Fly.io)
- Le dépôt contient un `Dockerfile` prêt à l'emploi.
- Configurez simplement la variable `PORT=3000`.

---

## 🔒 Sécurité & Intégrité des Données
- **Scellé Numérique HMAC-SHA256** : Chaque acte et chaque opposition génère une signature cryptographique inviolable.
- **Auto-compression client** : Les documents téléversés sont compressés en WebP (< 400 Ko) avant émission pour respecter les contraintes de bande passante réseau mobile.
- **Règles Anti-DDoS & Injection** : Protection contre les injections SQL, en-têtes Helmet, rate-limiting et validation Zod.
