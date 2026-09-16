-- ============================================================================
-- REPUBLIQUE DU CAMEROUN - PAIX - TRAVAIL - PATRIE
-- SYSTEME CENTRAL D'INFORMATION DE L'ETAT CIVIL (BUNEC)
-- Base de Données Relationnelle - Plateforme Suivi & Publication des Bans
-- Normes : PostgreSQL 15+ / 18+ | Haute Disponibilité & Intégrité Référentielle
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. TYPES ÉNUMÉRÉS STRICTS (CONFORMITÉ LOI 2011/011 ET NORMES BUNEC)
-- ----------------------------------------------------------------------------

DO $$ BEGIN
    CREATE TYPE type_acte_etat_civil AS ENUM (
        'ACTE_NAISSANCE',
        'ACTE_MARIAGE',
        'ACTE_DECES',
        'DECLARATION_TARDIVE_JUGEMENT_SUPPLETIF'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE statut_dossier_etat AS ENUM (
        'DEPOSE',             -- Étape 1 : Dossier déposé et enregistré
        'EN_INSTRUCTION',     -- Étape 2 : Instruction & Vérification juridique
        'VALIDATION_SIGNEE',  -- Étape 3 : Validation & Signature de l'Officier
        'PRET_DELIVRANCE',    -- Étape 4 : Disponible au guichet
        'REJETE_BLOQUE'       -- Pièce rejetée / Dossier bloqué avec motif
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE regime_matrimonial AS ENUM (
        'MONOGAMIE_BIENS_COMMUNS',
        'MONOGAMIE_SEPARATION_BIENS',
        'POLYGAMIE'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE statut_ban AS ENUM (
        'EN_COURS_AFFICHAGE',
        'EXPIRANT_SOUS_48H',
        'CLOTURE_SANS_OPPOSITION',
        'OPPOSITION_ENREGISTREE'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE statut_opposition AS ENUM (
        'DEPOSEE',
        'EN_COURS_INSTRUCTION',
        'RECEVABLE',
        'IRRECEVABLE',
        'LEVEE_PROCUREUR'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE canal_notification AS ENUM (
        'SMS',
        'WHATSAPP',
        'EMAIL'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ----------------------------------------------------------------------------
-- 2. TABLES RÉFÉRENTIELLES TERRITORIALES (10 RÉGIONS, COMMUNES & CENTRES)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS regions (
    id VARCHAR(5) PRIMARY KEY, -- 'AD', 'CE', 'ES', 'EN', 'LT', 'NO', 'NW', 'OU', 'SU', 'SW'
    code VARCHAR(3) NOT NULL UNIQUE, -- '01' à '10'
    nom VARCHAR(100) NOT NULL UNIQUE,
    chef_lieu VARCHAR(100) NOT NULL,
    actif BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS communes (
    id VARCHAR(10) PRIMARY KEY, -- ex: 'LT-DL1'
    region_id VARCHAR(5) NOT NULL REFERENCES regions(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    nom VARCHAR(150) NOT NULL,
    code_commune VARCHAR(10) NOT NULL,
    actif BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_commune_code UNIQUE (region_id, code_commune)
);

CREATE TABLE IF NOT EXISTS centres_etat_civil (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    commune_id VARCHAR(10) NOT NULL REFERENCES communes(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    nom VARCHAR(150) NOT NULL,
    type_centre VARCHAR(20) NOT NULL CHECK (type_centre IN ('PRINCIPAL', 'SECONDAIRE')),
    code_centre VARCHAR(10) NOT NULL, -- '00' pour principal, '01', '02'... pour secondaires
    adresse TEXT,
    contact_officier VARCHAR(100),
    email_centre VARCHAR(150),
    actif BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_centre_code UNIQUE (commune_id, code_centre)
);

-- ----------------------------------------------------------------------------
-- 3. MOTEUR DE SUIVI DES DOSSIERS CITOYENS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS dossiers_suivi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identifiants institutionnels d'interconnexion BUNEC
    bunec_tracking_id VARCHAR(64) NOT NULL UNIQUE,
    numero_recepisse VARCHAR(64) NOT NULL UNIQUE,
    qr_code_payload VARCHAR(512) NOT NULL,
    qr_code_signature VARCHAR(256) NOT NULL,
    
    -- Clés hiérarchiques administratives
    type_acte type_acte_etat_civil NOT NULL,
    region_id VARCHAR(5) NOT NULL REFERENCES regions(id) ON DELETE RESTRICT,
    commune_id VARCHAR(10) NOT NULL REFERENCES communes(id) ON DELETE RESTRICT,
    centre_id UUID NOT NULL REFERENCES centres_etat_civil(id) ON DELETE RESTRICT,
    
    -- Clés temporelles et séquentielles
    annee_enregistrement SMALLINT NOT NULL CHECK (annee_enregistrement BETWEEN 1960 AND 2100),
    numero_sequentiel INTEGER NOT NULL CHECK (numero_sequentiel > 0),
    
    -- Informations citoyennes
    demandeur_nom VARCHAR(150) NOT NULL,
    demandeur_prenom VARCHAR(150),
    demandeur_telephone VARCHAR(30) NOT NULL,
    demandeur_email VARCHAR(150),
    demandeur_cni_numero VARCHAR(50),
    
    -- État courant et cycle de vie
    statut_actuel statut_dossier_etat NOT NULL DEFAULT 'DEPOSE',
    etape_cycle_vie SMALLINT NOT NULL DEFAULT 1 CHECK (etape_cycle_vie BETWEEN 1 AND 4),
    
    -- Gestion des blocages et rejets
    motif_rejet_code VARCHAR(60), 
    motif_rejet_description TEXT,
    
    -- Certification et signature légale
    officier_instructeur_nom VARCHAR(150),
    officier_matricule VARCHAR(50),
    signature_electronique_hash VARCHAR(128),
    date_signature_officier TIMESTAMP WITH TIME ZONE,
    
    -- Disponibilité et convocation guichet
    date_depot TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_pret_delivrance TIMESTAMP WITH TIME ZONE,
    date_limite_conservation TIMESTAMP WITH TIME ZONE,
    creneau_convocation_horaire VARCHAR(100),
    guichet_retrait_numero VARCHAR(20),
    
    -- Métadonnées techniques et synchronisation
    derniere_synchro_bunec TIMESTAMP WITH TIME ZONE,
    statut_synchro_bunec VARCHAR(20) DEFAULT 'SYNCHRONISE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT uq_acte_registre UNIQUE (centre_id, annee_enregistrement, type_acte, numero_sequentiel)
);

-- ----------------------------------------------------------------------------
-- 4. HISTORIQUE ET AUDIT DES TRANSITIONS D'ÉTAT (IMMUABILITÉ)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS historique_statuts (
    id BIGSERIAL PRIMARY KEY,
    dossier_id UUID NOT NULL REFERENCES dossiers_suivi(id) ON DELETE CASCADE,
    statut_precedent statut_dossier_etat,
    statut_nouveau statut_dossier_etat NOT NULL,
    etape_cycle_vie SMALLINT NOT NULL CHECK (etape_cycle_vie BETWEEN 1 AND 4),
    agent_matricule VARCHAR(50) NOT NULL,
    agent_nom VARCHAR(150),
    motif_changement TEXT,
    notifications_envoyees JSONB DEFAULT '[]'::jsonb,
    ip_adresse INET,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 5. MODULE DES PUBLICATIONS LÉGALES DE BANS DE MARIAGE
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS publications_bans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_legale_ban VARCHAR(64) NOT NULL UNIQUE,
    centre_id UUID NOT NULL REFERENCES centres_etat_civil(id) ON DELETE RESTRICT,
    commune_id VARCHAR(10) NOT NULL REFERENCES communes(id) ON DELETE RESTRICT,
    region_id VARCHAR(5) NOT NULL REFERENCES regions(id) ON DELETE RESTRICT,
    
    -- Époux
    epoux_nom VARCHAR(150) NOT NULL,
    epoux_prenom VARCHAR(150) NOT NULL,
    epoux_date_naissance DATE NOT NULL,
    epoux_lieu_naissance VARCHAR(150) NOT NULL,
    epoux_profession VARCHAR(100),
    epoux_domicile VARCHAR(200) NOT NULL,
    epoux_pere_nom_complet VARCHAR(200),
    epoux_mere_nom_complet VARCHAR(200),
    
    -- Épouse
    epouse_nom VARCHAR(150) NOT NULL,
    epouse_prenom VARCHAR(150) NOT NULL,
    epouse_date_naissance DATE NOT NULL,
    epouse_lieu_naissance VARCHAR(150) NOT NULL,
    epouse_profession VARCHAR(100),
    epouse_domicile VARCHAR(200) NOT NULL,
    epouse_pere_nom_complet VARCHAR(200),
    epouse_mere_nom_complet VARCHAR(200),
    
    -- Régime et célébration
    regime_matrimonial regime_matrimonial NOT NULL,
    coutume_matrimoniale VARCHAR(100),
    
    -- Délais légaux de publication (10 à 30 jours selon Loi 2011/011)
    date_debut_affichage DATE NOT NULL,
    date_fin_affichage DATE NOT NULL,
    date_prevue_celebration DATE NOT NULL,
    lieu_prevu_celebration VARCHAR(200) NOT NULL,
    
    -- Statut légal
    statut_ban statut_ban NOT NULL DEFAULT 'EN_COURS_AFFICHAGE',
    officier_celebrant_nom VARCHAR(150),
    
    -- Intégrité et documents officiels
    document_avis_officiel_url VARCHAR(500),
    document_thumbnail_url VARCHAR(500),
    hash_certifie_sha256 VARCHAR(64) NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_delai_legal_affichage CHECK (date_fin_affichage >= date_debut_affichage + INTERVAL '10 days'),
    CONSTRAINT chk_date_celebration_valide CHECK (date_prevue_celebration >= date_fin_affichage)
);

-- ----------------------------------------------------------------------------
-- 6. MODULE DES OPPOSITIONS FORMELLES AU MARIAGE
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS oppositions_bans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    publication_ban_id UUID NOT NULL REFERENCES publications_bans(id) ON DELETE RESTRICT,
    
    -- Déclarant (Tiers légitimé)
    opposant_nom VARCHAR(150) NOT NULL,
    opposant_prenom VARCHAR(150) NOT NULL,
    opposant_qualite_legale VARCHAR(100) NOT NULL, -- 'CONJOINT_NON_DIVORCE', 'PERE', 'MERE', 'TUTEUR', 'MINISTERE_PUBLIC'
    opposant_cni VARCHAR(50) NOT NULL,
    opposant_telephone VARCHAR(30) NOT NULL,
    opposant_email VARCHAR(150),
    opposant_adresse TEXT NOT NULL,
    
    -- Contenu de l'opposition
    motif_legal_opposition TEXT NOT NULL,
    date_saisine TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Horodatage certifié et empreinte cryptographique
    horodatage_certifie_jeton VARCHAR(512) NOT NULL,
    empreinte_dossier_sha256 VARCHAR(64) NOT NULL,
    
    -- Décision juridique
    statut statut_opposition NOT NULL DEFAULT 'DEPOSEE',
    decision_autorite_judiciaire TEXT,
    date_decision TIMESTAMP WITH TIME ZONE,
    procureur_instructeur VARCHAR(150),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 7. REGISTRE DES PIÈCES JUSTIFICATIVES OPTIMISÉES ET COMPRESSÉES
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS pieces_justificatives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entite_type VARCHAR(30) NOT NULL CHECK (entite_type IN ('DOSSIER_SUIVI', 'OPPOSITION_BAN', 'BAN_MARIAGE')),
    entite_id UUID NOT NULL,
    type_piece VARCHAR(50) NOT NULL, -- 'CNI', 'ACTE_NAISSANCE', 'CERTIFICAT_CELIBAT', 'JUGEMENT', 'AUTRE'
    fichier_nom_origine VARCHAR(255) NOT NULL,
    mime_type_origine VARCHAR(100) NOT NULL,
    chemin_fichier_webp VARCHAR(500) NOT NULL,
    chemin_vignette_thumbnail VARCHAR(500) NOT NULL,
    taille_octets_brute BIGINT NOT NULL,
    taille_octets_compressee BIGINT NOT NULL,
    ratio_gain_compression NUMERIC(5,2) GENERATED ALWAYS AS (
        ROUND(((taille_octets_brute - taille_octets_compressee)::numeric / NULLIF(taille_octets_brute, 0)::numeric) * 100, 2)
    ) STORED,
    empreinte_sha256 VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 8. INDEXATION B-TREE ET OPTIMISATIONS DES PERFORMANCES
-- ----------------------------------------------------------------------------

-- Moteur de recherche et suivi citoyen instantané
CREATE INDEX IF NOT EXISTS idx_dossiers_bunec_tracking ON dossiers_suivi USING btree (bunec_tracking_id);
CREATE INDEX IF NOT EXISTS idx_dossiers_numero_recepisse ON dossiers_suivi USING btree (numero_recepisse);
CREATE INDEX IF NOT EXISTS idx_dossiers_recherche_cascade ON dossiers_suivi USING btree (region_id, commune_id, centre_id, annee_enregistrement, type_acte, numero_sequentiel);
CREATE INDEX IF NOT EXISTS idx_dossiers_statut_actuel ON dossiers_suivi USING btree (statut_actuel);
CREATE INDEX IF NOT EXISTS idx_dossiers_demandeur_tel ON dossiers_suivi USING btree (demandeur_telephone);

-- Registre public des publications de bans
CREATE INDEX IF NOT EXISTS idx_bans_statut_dates ON publications_bans USING btree (statut_ban, date_debut_affichage, date_fin_affichage);
CREATE INDEX IF NOT EXISTS idx_bans_cascade_geo ON publications_bans USING btree (region_id, commune_id, centre_id);
CREATE INDEX IF NOT EXISTS idx_bans_regime_matrimonial ON publications_bans USING btree (regime_matrimonial);
CREATE INDEX IF NOT EXISTS idx_bans_epoux_noms ON publications_bans USING btree (epoux_nom, epouse_nom);

-- Oppositions et liaisons
CREATE INDEX IF NOT EXISTS idx_oppositions_ban_id ON oppositions_bans USING btree (publication_ban_id);
CREATE INDEX IF NOT EXISTS idx_pieces_entite ON pieces_justificatives USING btree (entite_type, entite_id);
CREATE INDEX IF NOT EXISTS idx_historique_dossier_id ON historique_statuts USING btree (dossier_id, created_at DESC);

-- ----------------------------------------------------------------------------
-- 9. TRIGGERS D'AUDIT ET MISE À JOUR HORODATÉE
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_update_dossiers_updated_at
BEFORE UPDATE ON dossiers_suivi
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER trg_update_bans_updated_at
BEFORE UPDATE ON publications_bans
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER trg_update_oppositions_updated_at
BEFORE UPDATE ON oppositions_bans
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
