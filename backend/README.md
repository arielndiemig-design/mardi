# Backend et PostgreSQL

Le suivi des dossiers lit les données depuis PostgreSQL. Le serveur ne reprend
pas les dossiers de démonstration quand la base est absente ou inaccessible.

## Configuration

Copiez `backend/.env.example` vers `.env` à la racine, puis renseignez une
adresse PostgreSQL et un rôle autorisé à lire les tables du schéma.

Initialisez ensuite le schéma et le référentiel territorial :

```sh
psql "$DATABASE_URL" -f database/schema.sql
psql "$DATABASE_URL" -f database/seeds/seed_regions_communes.sql
```

Le schéma impose des centres d’état civil et les enregistrements de dossiers
réels dans `centres_etat_civil` et `dossiers_suivi`. Les centres et dossiers
doivent être chargés par l’administrateur de la base avant qu’une recherche
puisse renvoyer un résultat.

## Règles de recherche

Le suivi exige une région, une commune, un type d’acte et une seule information
d’identification. Le numéro de récépissé, l’identifiant BUNEC, le téléphone,
l’adresse électronique ou le nom complet sont comparés à leur valeur exacte.
La requête est paramétrée et une correspondance partielle ne renvoie aucun
dossier. Sans `DATABASE_URL`, l’API renvoie `503`.

L’application complète reste lancée par `npm start`; Express et Vite partagent
le même port HTTP. Les variables `PGHOST`, `PGDATABASE`, `PGUSER` et
`PGPASSWORD` sont aussi acceptées.
