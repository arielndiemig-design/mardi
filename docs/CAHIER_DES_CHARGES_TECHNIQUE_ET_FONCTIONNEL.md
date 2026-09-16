# CAHIER DES CHARGES TECHNIQUE ET FONCTIONNEL (CDCTF)
## PLATEFORME NATIONALE DE SUIVI EN TEMPS RÉEL DES DOSSIERS D'ÉTAT CIVIL ET DE PUBLICATION LÉGALE DES BANS DE MARIAGE
### Interconnexion avec le Système Central du Bureau National de l'État Civil du Cameroun (BUNEC)

---

### Document d'Architecture Système & Spécifications Métier
* **Auteur :** Architecte Logiciel Senior & Expert en Systèmes d'Information Publics
* **Date d'Émission :** Septembre 2026
* **Version :** 2.0.0-PROD
* **Statut :** Spécification de Référence pour Déploiement Souverain
* **Entité Tutrice :** BUNEC (Bureau National de l'État Civil, République du Cameroun)

---

## SOMMAIRE EXÉCUTIF

1. **CADRE INSTITUTIONNEL, JURIDIQUE ET OBJECTIFS STRATÉGIQUES**
   - 1.1 Cadre Légal et Réglementaire Camerounais
   - 1.2 Objectifs de Souveraineté Numérique et Inclusion Citoyenne
   - 1.3 Périmètre des Services Dématérialisés

2. **SPÉCIFICATIONS FONCTIONNELLES DÉTAILLÉES**
   - 2.1 Moteur de Suivi de Dossier & Portail Citoyen
     - 2.1.1 Saisie Assistée à 100% par Menus Déroulants en Cascade
     - 2.1.2 Timeline Visuelle du Cycle de Vie en 4 Étapes
     - 2.1.3 Code Couleur Universel d'État & Gestion des Rejets
     - 2.1.4 Moteur de Notifications Proactives Multicanal
   - 2.2 Module Temps Réel des Publications de Bans de Mariage
     - 2.2.1 Registre Public Dématérialisé & Délais Légaux (10 à 30 jours)
     - 2.2.2 Moteur de Recherche et Filtres Multicritères
     - 2.2.3 Fiche Détail du Ban & Compte à Rebours Dynamique
     - 2.2.4 Module Formel de Saisine d'Opposition Judiciaire

3. **NOMENCLATURE ADMINISTRATIVE EXHAUSTIVE DES MAIRIES (RÉFÉRENTIEL BUNEC)**
   - 3.1 Cartographie Complète des 10 Régions et 360+ Communes
   - 3.2 Standard de Codification et Numérotation des Actes

4. **ARCHITECTURE TECHNIQUE, RÉSILIENCE RÉSEAU & PIPELINE D'AUTO-COMPRESSION**
   - 4.1 Défi de la Bande Passante et Connectivité Dégradée au Cameroun
   - 4.2 Pipeline d'Auto-Compression Côté Client (Smartphone / Navigateur)
   - 4.3 Microservice d'Ingestion Backend et Normalisation Server-Side
   - 4.4 Optimisation Réseau (Brotli/Gzip) et Cache Applicatif Redis
   - 4.5 Protocole d'Interconnexion Sécurisée BUNEC Central (mTLS, HMAC-SHA256, Webhooks)

5. **PLAN DE SÉCURITÉ, AUDITABILITÉ ET CONFORMITÉ RGPD/ANTIC**
   - 5.1 Sécurisation Cryptographique et Horodatage Certifié
   - 5.2 Traçabilité Immuable des Instructions et Décisions
   - 5.3 Politique de Rétention et Purge des Données Citoyennes

---

## 1. CADRE INSTITUTIONNEL, JURIDIQUE ET OBJECTIFS STRATÉGIQUES

### 1.1 Cadre Légal et Réglementaire Camerounais
Le présent système s'inscrit dans la stricte application du droit positif camerounais régissant l'état des personnes physiques et l'organisation des services publics :
* **Ordonnance N° 81-02 du 29 juin 1981**, modifiée et complétée par la **Loi N° 2011/011 du 6 mai 2011** portant organisation de l'état civil et diverses dispositions relatives à l'état des personnes physiques.
* **Décret N° 2013/031 du 13 février 2013** et **Décret N° 2020/399 du 24 juillet 2020** portant réorganisation du BUNEC (Bureau National de l'État Civil).
* **Loi N° 2010/012 du 21 décembre 2010** relative à la cybersécurité et à la cybercriminalité au Cameroun.
* **Loi N° 2010/013 du 21 décembre 2010** régissant les communications électroniques au Cameroun.
* Recommandations techniques de l'**ANTIC** (Agence Nationale des Technologies de l'Information et de la Communication).

### 1.2 Objectifs de Souveraineté Numérique et Inclusion Citoyenne
* **Éradication des déplacements inutiles :** Permettre aux citoyens résidant sur le territoire national ou dans la diaspora de suivre la confection de leurs actes sans se déplacer physiquement avant la notification de disponibilité effective au guichet.
* **Transparence et Sécurité Juridique :** Mettre un terme aux fraudes documentaires, faux récépissés et publications clandestines par un registre public en ligne inviolable.
* **Publicité Légale Dématérialisée :** Assurer la publication transparente des bans de mariage sur l'ensemble des 10 régions du pays pour garantir l'exercice légitime du droit d'opposition avant célébration (prévention de la bigamie frauduleuse et des mariages forcés ou clandestins).

---

## 2. SPÉCIFICATIONS FONCTIONNELLES DÉTAILLÉES

### 2.1 Moteur de Suivi de Dossier & Portail Citoyen

#### 2.1.1 Saisie Assistée à 100% par Menus Déroulants en Cascade
Afin de supprimer toute erreur typographique citoyenne et accélérer le traitement sur réseau mobile :
1. **Type d'acte :** Acte de Naissance, Acte de Mariage, Acte de Décès, Déclaration Tardive / Jugement Supplétif.
2. **Région administrative :** Sélection stricte parmi les 10 régions de la République du Cameroun.
3. **Commune / Mairie compétente :** La liste déroulante s'adapte instantanément et de manière asynchrone (sans rechargement de page) à la région choisie.
4. **Centre d'état civil :** Centre principal de la mairie ou centre secondaire rattaché.
5. **Année d'enregistrement :** Liste déroulante des années d'exercice civil de 1960 à l'année courante.
6. **Numéro séquentiel au registre :** Champ numérique sécurisé avec masque de saisie (`000000`) ou lecture optique directe d'un **QR Code** imprimé sur le récépissé officiel.

#### 2.1.2 Timeline Visuelle du Cycle de Vie en 4 Étapes
Le citoyen visualise l'historique progressif du traitement de son acte :
* **Étape 1 : Dossier déposé et enregistré :** Horodatage certifié au guichet de mairie, affectation de l'identifiant unique BUNEC, contrôle de recevabilité matérielle initiale.
* **Étape 2 : Instruction & Vérification juridique :** Contrôle des pièces probantes (certificat médical d'accouchement/décès, CNI des parents et témoins, certificat de célibat/coutume), instruction par le secrétaire d'état civil.
* **Étape 3 : Validation & Signature de l'Officier :** Apposition de la signature électronique qualifiée de l'Officier d'État Civil (Maire ou Adjoint), attribution définitive du numéro au registre central.
* **Étape 4 : Disponible au guichet / Prêt pour délivrance :** Déclaration de mise à disposition physique, affectation d'un créneau horaire dédié (date et tranche horaire de retrait), indication du numéro de guichet, et date limite légale de conservation avant archivage.

#### 2.1.3 Code Couleur Universel d'État & Gestion des Rejets
* **Vert (#10B981) :** Étape validée / Acte disponible pour retrait physique immédiat.
* **Ambre/Orange (#F59E0B) :** Dossier en cours d'instruction administrative régulière ou en attente de visa.
* **Rouge (#EF4444) :** Pièce rejetée / Dossier bloqué. Affichage obligatoire d'un bandeau explicite détaillant le motif extrait d'une nomenclature normalisée BUNEC :
  * `REJ_01` : Incohérence d'identité entre l'acte et le certificat médical.
  * `REJ_02` : Certificat d'accouchement non authentifié ou hors délai légal.
  * `REJ_03` : CNI des témoins expirée ou illisible.
  * `REJ_04` : Défaut de jugement supplétif pour déclaration tardive.

#### 2.1.4 Moteur de Notifications Proactives Multicanal
À chaque transition d'état, le système déclenche automatiquement :
* **SMS Transactionnel :** Via les passerelles locales télécoms (Orange Cameroun / MTN Cameroon).
* **WhatsApp Business API :** Message interactif contenant le statut et le lien direct vers le reçu sécurisé.
* **Courriel Sécurisé :** Notification avec copie de la convocation au guichet et instructions de retrait.

---

### 2.2 Module Temps Réel des Publications de Bans de Mariage

#### 2.2.1 Registre Public Dématérialisé & Délais Légaux
Conformément à la Loi N° 2011/011 (Article 53 et suivants) :
* L'avis de projet de mariage doit obligatoirement être porté à la connaissance du public par voie d'affichage à la mairie du lieu de célébration et au centre du domicile respectif des futurs époux pendant un **délai légal incompressible de 10 à 30 jours calendaires** avant la date retenue pour le mariage.
* Le registre dématérialisé synchronise en temps réel tous les bans actifs du territoire national.

#### 2.2.2 Filtres Multicritères
* **Géographie :** Région \rightarrow Commune \rightarrow Centre d'état civil.
* **Statut légal du ban :**
  * *En cours d'affichage :* Délais légaux respectés, célébration future autorisée si aucune opposition.
  * *Expirant dans moins de 48h :* Alerte rouge clignotante pour clôture imminente du délai d'opposition.
  * *Affichage clôturé sans opposition :* Célébration juridiquement recevable.
  * *Opposition enregistrée :* Mariage suspendu par ordonnance ou déclaration formelle de tiers.
* **Régime matrimonial projeté :** Monogamie / Biens Communs, Monogamie / Séparation de Biens, Polygamie.

#### 2.2.3 Fiche Détail du Ban & Compte à Rebours Dynamique
* Présentation solennelle : Identité complète des époux (nom, prénoms, dates et lieux de naissance, professions, domiciles actuels, identité détaillée des pères et mères).
* Compte à rebours dynamique en secondes, minutes, heures et jours jusqu'à l'heure légale d'expiration de l'affichage public.

#### 2.2.4 Module Formel de Saisine d'Opposition Judiciaire
* Réservé aux personnes légitimées par la loi (conjoint antérieur non divorcé, ascendants, tuteur légal, Ministère Public).
* Formulaire crypté demandant :
  * Qualité juridique de l'opposant.
  * Motif légal circonstancié.
  * Téléversement de la pièce justificative probante (jugement de divorce non prononcé, acte de mariage antérieur, etc.).
  * Génération immédiate d'un jeton d'horodatage certifié SHA-256 transmis instantanément au Parquet compétent et à l'Officier Célébrant.

---

## 3. ARCHITECTURE TECHNIQUE & PIPELINE D'AUTO-COMPRESSION

### 3.1 Défi de la Bande Passante et Connectivité Dégradée
Dans de nombreuses localités camerounaises, les réseaux cellulaires oscillent entre 2G/3G instable et 4G à bande passante payante. La transmission de photos brutes de smartphones (5 à 15 Mo l'unité) entraîne :
* Des échecs d'envoi massifs côté citoyen.
* Une saturation prématurée de la bande passante des serveurs de mairies.
* Une explosion des coûts d'hébergement et de stockage souverain.

### 3.2 Solution : Architecture à Double Compression Sans Perte Sémantique

```
[Smartphone Citoyen]
       │ (Photo brute 8-15 Mo)
       ▼
[Client-Side Compression] ──> Canvas / WebAssembly
       │ (Image WebP < 400 Ko)
       ▼
[Réseau Mobile 3G/4G Cameroun] ──> Transfert fluide (< 2s)
       ▼
[Backend Ingestion Express] ──> Multer Memory Buffer
       ├─── Image : Sharp (Resize 2048px, WebP Q80, Strip EXIF)
       ├─── PDF : Ghostscript (Linearisation FastWebView, 150 DPI)
       └─── Vignette : Sharp (Thumbnail 320px, WebP Q65 ~ 15-25 Ko)
       ▼
[Stockage Sécurisé & Cache Redis] ──> Traçabilité SHA-256 & BDD PostgreSQL
```

1. **Niveau 1 : Client-Side Pre-Processing (Navigateur / Mobile)**
   * Détection immédiate du type MIME côté client.
   * Redimensionnement vectoriel/bitmap via Canvas HTML5 haute précision.
   * Compression WebP avec seuil maximal garanti de **400 Ko**.
2. **Niveau 2 : Microservice d'Ingestion Backend (Sharp + Ghostscript)**
   * Élimination des métadonnées privées (EXIF, géolocalisation GPS).
   * Normalisation des documents scannés via Ghostscript (profil `/ebook` à 150 DPI) réduisant le poids d'un flux PDF par un facteur 10.
   * Génération automatique d'une vignette ultra-légère (15-25 Ko) pour l'affichage instantané des listings sans charger les documents maîtres.
3. **Niveau 3 : Optimisation des Échanges & Cache Applicatif**
   * Compression native **Brotli** (niveau 6) et **Gzip** sur toutes les API JSON.
   * Mise en cache Redis des registres de bans actifs avec invalidation ciblée lors de la survenance d'une opposition.

---

## 4. MATRICE D'INTERCONNEXION BUNEC CENTRAL

* **Protocole Réseau :** VPN IPSec dédié reliant les serveurs de la plateforme au Datacenter Central du BUNEC à Yaoundé.
* **Sécurité Applicative :**
  * Chiffrement TLS 1.3 avec mTLS (Authentification mutuelle par certificats X.509 délivrés par l'autorité de certification de l'ANTIC).
  * Signature numérique HMAC-SHA256 sur l'en-tête `X-Bunec-Signature` pour chaque événement ou webhook.
* **Mode Dégradé / Offline-First :**
  * En cas de rupture du lien vers le serveur central, les mairies disposent d'un bus d'événements local persistant les requêtes avec reprise automatique par stratégie de retry exponentiel (backoff exponentiel avec jitter).
