export type TypeActe = 
  | 'ACTE_NAISSANCE' 
  | 'ACTE_MARIAGE' 
  | 'ACTE_DECES' 
  | 'DECLARATION_TARDIVE_JUGEMENT_SUPPLETIF';

export type StatutDossier = 
  | 'DEPOSE' 
  | 'EN_INSTRUCTION' 
  | 'VALIDATION_SIGNEE' 
  | 'PRET_DELIVRANCE' 
  | 'REJETE_BLOQUE';

export type StatutBan = 
  | 'EN_COURS_AFFICHAGE' 
  | 'EXPIRANT_SOUS_48H' 
  | 'CLOTURE_SANS_OPPOSITION' 
  | 'OPPOSITION_ENREGISTREE';

export type RegimeMatrimonial = 
  | 'MONOGAMIE_BIENS_COMMUNS' 
  | 'MONOGAMIE_SEPARATION_BIENS' 
  | 'POLYGAMIE';

export interface Commune {
  id: string;
  nom: string;
  code: string;
}

export interface Region {
  id: string;
  nom: string;
  chefLieu: string;
  code: string;
  communes: Commune[];
}

export interface CentreEtatCivil {
  id: string;
  nom: string;
  type: 'PRINCIPAL' | 'SECONDAIRE';
  code: string;
}

export interface EtapeCycleVie {
  numero: 1 | 2 | 3 | 4;
  nom: string;
  statut: 'COMPLETED' | 'CURRENT' | 'PENDING' | 'REJECTED';
  horodatage: string | null;
  description: string;
  acteur?: string;
  convocation?: string;
  dateLimiteConservation?: string;
}

export interface DossierSuiviDetail {
  id: string;
  bunecTrackingId: string;
  numeroRecepisse: string;
  typeActe: TypeActe;
  localisation: {
    region: string;
    regionId: string;
    commune: string;
    communeId: string;
    centre: string;
    annee: number;
    numeroSequentiel: number;
  };
  demandeur: {
    nom: string;
    prenom?: string;
    telephoneMasque: string;
  };
  cycleDeVie: {
    etapeCourante: 1 | 2 | 3 | 4;
    codeCouleur: 'green' | 'amber' | 'red';
    statutActuel: StatutDossier;
    libelleStatut: string;
    motifBlocage?: {
      code: string;
      libelle: string;
      description: string;
    } | null;
    etapes: EtapeCycleVie[];
  };
  derniereMiseAJour: string;
}

export interface PersonneBan {
  nom: string;
  prenom: string;
  dateNaissance: string;
  lieuNaissance: string;
  profession: string;
  domicile: string;
  pere: string;
  mere: string;
}

export interface PublicationBan {
  id: string;
  referenceLegaleBan: string;
  centreEtatCivil: string;
  regionNom: string;
  communeNom: string;
  epoux: PersonneBan;
  epouse: PersonneBan;
  regimeMatrimonial: RegimeMatrimonial;
  coutumeMatrimoniale?: string;
  dateDebutAffichage: string;
  dateFinAffichage: string;
  datePrevueCelebration: string;
  lieuPrevuCelebration: string;
  statutBan: StatutBan;
  documentAvisUrl: string;
  thumbnailUrl: string;
  hashCertifieSha256: string;
}
