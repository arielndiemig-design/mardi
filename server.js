/**
 * ============================================================================
 * RÉPUBLIQUE DU CAMEROUN - PAIX - TRAVAIL - PATRIE
 * BUREAU NATIONAL DE L'ÉTAT CIVIL (BUNEC)
 * Serveur d'Application & API Temps Réel
 * Compatible 100% natif Node.js (sans dépendance externe requise au démarrage)
 * ============================================================================
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const crypto = require("crypto");
const zlib = require("zlib");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");
const SEED_FILE = path.join(
  __dirname,
  "database/seeds/bunec_referentiel_territorial.json",
);

// Chargement des données de référence
let territorialData = [];
if (fs.existsSync(SEED_FILE)) {
  try {
    territorialData = JSON.parse(fs.readFileSync(SEED_FILE, "utf-8"));
    console.log(
      `[BUNEC] Référentiel chargé : ${territorialData.length} régions administratives.`,
    );
  } catch (err) {
    console.error("[BUNEC] Erreur lecture référentiel:", err.message);
  }
}

// Mock initial des publications de bans
let bansDatabase = [
  {
    id: "b1-2026-dla1-0089",
    referenceLegaleBan: "BAN-2026-LT-DL1-0089",
    centreEtatCivil: "Mairie de Douala Iᵉʳ (Centre Principal de Bonanjo)",
    regionNom: "Littoral",
    regionId: "LT",
    communeNom: "Douala Iᵉʳ",
    communeId: "LT-DL1",
    epoux: {
      nom: "EBELLE",
      prenom: "Samuel Patrick",
      photoUrl: "/images/bans/epoux_ebelle.jpg",
      dateNaissance: "1992-04-14",
      lieuNaissance: "Douala",
      profession: "Ingénieur Télécoms",
      domicile: "Bonapriso, Douala",
      pere: "EBELLE Victor",
      mere: "NDONGO Madeleine",
    },
    epouse: {
      nom: "NGONO",
      prenom: "Clarisse Vanessa",
      photoUrl: "/images/bans/epouse_ngono.jpg",
      dateNaissance: "1995-11-20",
      lieuNaissance: "Yaoundé",
      profession: "Gestionnaire de Projets",
      domicile: "Akwa, Douala",
      pere: "NGONO Jean-Baptiste",
      mere: "BILOUNGA Thérèse",
    },
    regimeMatrimonial: "MONOGAMIE_BIENS_COMMUNS",
    coutumeMatrimoniale: "Coutume Sawa / Duala",
    dateDebutAffichage: "2026-08-25",
    dateFinAffichage: "2026-09-25T18:00:00Z",
    datePrevueCelebration: "2026-09-26",
    lieuPrevuCelebration: "Salle des Actes - Mairie de Douala 1er",
    statutBan: "EN_COURS_AFFICHAGE",
    hashCertifieSha256:
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  },
  {
    id: "b2-2026-ya2-0142",
    referenceLegaleBan: "BAN-2026-CE-YA2-0142",
    centreEtatCivil: "Mairie de Yaoundé IIᵉ (Tsinga)",
    regionNom: "Centre",
    regionId: "CE",
    communeNom: "Yaoundé IIᵉ",
    communeId: "CE-YA2",
    epoux: {
      nom: "FOTSO",
      prenom: "Hervé Blaise",
      photoUrl: "/images/bans/epoux_fotso.jpg",
      dateNaissance: "1989-08-02",
      lieuNaissance: "Bafoussam",
      profession: "Expert-Comptable",
      domicile: "Bastos, Yaoundé",
      pere: "FOTSO Émile",
      mere: "KAMGA Odette",
    },
    epouse: {
      nom: "ABENA",
      prenom: "Marie Suzanne",
      photoUrl: "/images/bans/epouse_abena.jpg",
      dateNaissance: "1994-01-18",
      lieuNaissance: "Mbalmayo",
      profession: "Enseignante-Chercheuse",
      domicile: "Tsinga, Yaoundé",
      pere: "ABENA Luc",
      mere: "MBOA Rose",
    },
    regimeMatrimonial: "MONOGAMIE_SEPARATION_BIENS",
    coutumeMatrimoniale: "Coutume Bamiléké",
    dateDebutAffichage: "2026-08-10",
    dateFinAffichage: new Date(Date.now() + 38 * 3600 * 1000).toISOString(),
    datePrevueCelebration: "2026-09-12",
    lieuPrevuCelebration: "Hôtel de Ville de Yaoundé II",
    statutBan: "EXPIRANT_SOUS_48H",
    hashCertifieSha256:
      "a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0",
  },
  {
    id: "b3-2026-baf1-0063",
    referenceLegaleBan: "BAN-2026-OU-BF1-0063",
    centreEtatCivil: "Mairie de Bafoussam Iᵉʳ",
    regionNom: "Ouest",
    regionId: "OU",
    communeNom: "Bafoussam Iᵉʳ",
    communeId: "OU-BF1",
    epoux: {
      nom: "TAGNE",
      prenom: "Dieudonné",
      photoUrl: "/images/bans/epoux_tagne.jpg",
      dateNaissance: "1986-06-12",
      lieuNaissance: "Bandjoun",
      profession: "Opérateur Économique",
      domicile: "Djeleng, Bafoussam",
      pere: "TAGNE Moïse",
      mere: "TCHUENKAM Martine",
    },
    epouse: {
      nom: "DJUIDJE",
      prenom: "Pauline Laure",
      photoUrl: "/images/bans/epouse_djuidje.jpg",
      dateNaissance: "1993-09-05",
      lieuNaissance: "Bafang",
      profession: "Pharmacienne",
      domicile: "Djeleng, Bafoussam",
      pere: "KAMDEM Joseph",
      mere: "SIKATI Christine",
    },
    regimeMatrimonial: "POLYGAMIE",
    coutumeMatrimoniale: "Coutume Bamiléké",
    dateDebutAffichage: "2026-08-01",
    dateFinAffichage: "2026-08-31T18:00:00Z",
    datePrevueCelebration: "2026-09-15",
    lieuPrevuCelebration: "Salle Polyvalente Bafoussam 1er",
    statutBan: "CLOTURE_SANS_OPPOSITION",
    hashCertifieSha256:
      "f4e3d2c1b0a987654321fedcba0987654321fedcba0987654321fedcba098765",
  },
];

const otpVerificationStore = new Map();

function normalizeEmail(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function createDerivedEmail(value) {
  const raw = String(value || "citoyen")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "");

  return `${raw || "citoyen"}@bunec.cm`;
}

function getDossierNotificationEmail(dossier) {
  if (dossier && dossier.demandeur && dossier.demandeur.email) {
    return normalizeEmail(dossier.demandeur.email);
  }

  const source =
    (dossier && dossier.demandeur && dossier.demandeur.nomComplet) ||
    (dossier && dossier.titulaire) ||
    (dossier && dossier.id) ||
    "citoyen";

  return createDerivedEmail(source);
}

function normalizeIdentifierString(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function normalizeComparableText(value) {
  return normalizeIdentifierString(String(value || "")).replace(
    /[\s\-_./]+/g,
    "",
  );
}

function normalizeDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

function getDossierUniqueRef(dossier) {
  return {
    dossierId: String(dossier && dossier.id ? dossier.id : ""),
    demandeurId:
      dossier && dossier.demandeur && dossier.demandeur.id
        ? String(dossier.demandeur.id)
        : String(
            (dossier && dossier.demandeur && dossier.demandeur.nomComplet) ||
              (dossier && dossier.titulaire) ||
              "",
          ),
  };
}

function fieldMatchesDossier(dossier, fieldName, rawValue) {
  const queryValue = String(rawValue || "").trim();
  if (!queryValue) {
    return true;
  }

  const qLow = queryValue.toLowerCase();
  const dTelDigits = normalizeDigits(
    (dossier.demandeur && dossier.demandeur.telephone) || "",
  );
  const dNum = normalizeIdentifierString(dossier.numeroDeclaration || "");
  const dRecepisse = normalizeIdentifierString(
    dossier.numeroRecepisse || dossier.numeroDeclaration || "",
  );
  const dIdent = normalizeIdentifierString(dossier.identifiantBUNEC || "");
  const dId = normalizeIdentifierString(String(dossier.id || ""));
  const dossierEmail = getDossierNotificationEmail(dossier);
  const qDigits = normalizeDigits(queryValue);

  if (fieldName === "numeroDeclaration" || fieldName === "numeroRecepisse") {
    return (
      dNum === qLow || dRecepisse === qLow || dIdent === qLow || dId === qLow
    );
  }

  if (fieldName === "telephone") {
    if (!qDigits) {
      return false;
    }
    return dTelDigits === qDigits;
  }

  if (fieldName === "email") {
    const candidateEmail = normalizeEmail(queryValue);
    return (
      candidateEmail === dossierEmail ||
      candidateEmail ===
        normalizeEmail((dossier.demandeur && dossier.demandeur.email) || "")
    );
  }

  if (fieldName === "search") {
    if (qLow.length < 3) {
      return false;
    }

    const exactSearchTargets = [
      dNum,
      dRecepisse,
      dIdent,
      dId,
      normalizeComparableText(dossier.titulaire || ""),
      normalizeComparableText(
        (dossier.demandeur && dossier.demandeur.nomComplet) || "",
      ),
      normalizeComparableText(
        (dossier.donneesActeCivil &&
          dossier.donneesActeCivil.enfant &&
          dossier.donneesActeCivil.enfant.nomComplet) ||
          "",
      ),
      normalizeComparableText(
        (dossier.donneesActeCivil &&
          dossier.donneesActeCivil.mere &&
          dossier.donneesActeCivil.mere.nomComplet) ||
          "",
      ),
      normalizeComparableText(
        (dossier.donneesActeCivil &&
          dossier.donneesActeCivil.pere &&
          dossier.donneesActeCivil.pere.nomComplet) ||
          "",
      ),
      normalizeComparableText(dossierEmail),
    ];

    const normalizedQuery = normalizeComparableText(queryValue);
    return exactSearchTargets.includes(normalizedQuery);
  }

  return false;
}

function dossierMatchesQuery(dossier, queryObject, typeFilter) {
  if (typeFilter && typeFilter !== "TOUS" && dossier.typeActe !== typeFilter) {
    return false;
  }

  const providedFields = [
    ["numeroDeclaration", queryObject.numeroDeclaration],
    ["numeroRecepisse", queryObject.numeroRecepisse],
    ["telephone", queryObject.telephone],
    ["email", queryObject.email],
    ["search", queryObject.search],
  ];

  let providedCount = 0;
  for (const [fieldName, fieldValue] of providedFields) {
    const value = String(fieldValue || "").trim();
    if (!value) {
      continue;
    }
    providedCount += 1;
    if (!fieldMatchesDossier(dossier, fieldName, value)) {
      return false;
    }
  }

  return providedCount > 0;
}

// Base historique exhaustive de tous les actes & déclarations d'état civil (BUNEC National)
let dossiersHistoriqueDatabase = [
  {
    id: "dos-2019-ce-boki-000731",
    numeroDeclaration: "12019/CE101/N/0731",
    identifiantBUNEC: "CMR-2019-CE-BOK-NAI-000731",
    typeActe: "ACTE_NAISSANCE",
    titreActe: "Acte de Naissance",
    demandeur: {
      nomComplet: "GOUFANI SIACK Jacques",
      qualite: "Père de l'enfant",
      telephone: "694 50 30 01",
      cni: "109847291",
    },
    titulaire: "NDIEMI À GOUFANI Jean Placide Ariel",
    provenance: {
      regionNom: "Centre",
      regionId: "CE",
      departement: "Mbam-et-Inoubou",
      communeNom: "Bokito",
      communeId: "CE-BOKI",
      centreEtatCivil: "Centre d’État Civil de Bokito-Ville",
      canalDepot: "Guichet Principal d’État Civil de Bokito",
      adresseIp: "197.234.18.72",
      operateur: "Orange Cameroun Fibre / 4G+",
      terminal: "Poste Guichet #01 Mairie de Bokito",
    },
    dateEnregistrement: "2019-07-11T08:30:00Z",
    statut: "PRETE_RETRAIT",
    libelleStatut: "Disponible au guichet — Prêt pour délivrance (BAT Émis)",
    etapeCourante: 4,
    notificationRetraitEnvoyee: true,
    canalNotification: "WhatsApp (+237 694 50 30 01) & SMS",
    dateNotification: "2019-07-11T14:00:00Z",
    lieuRetrait: "Guichet d’État Civil (Mairie de Bokito-Ville)",
    empreinteSha256:
      "b4a8e9102c7d5431fa890123456789abcdef0123456789abcdef0123456789ab",
    donneesActeCivil: {
      numeroActe: "12019/CE101/N/0731",
      volet: "Volet N° 1 (Titulaire)",
      volumeFolio: "Vol. 2019 / Fol. 0731",
      identifiantBUNEC: "CMR-2019-CE-BOK-NAI-000731",
      regionFr: "RÉGION DU CENTRE",
      regionEn: "CENTRE REGION",
      departementFr: "DÉPARTEMENT DU MBAM ET INOUBOU",
      departementEn: "MBAM AND INOUBOU DIVISION",
      communeFr: "COMMUNE DE BOKITO",
      communeEn: "BOKITO COUNCIL",
      centreFr: "CENTRE D’ÉTAT CIVIL DE BOKITO - VILLE",
      centreEn: "BOKITO - TOWN CIVIL STATUS REGISTRY",
      titrePrincipal: "EXTRAIT D'ACTE DE NAISSANCE / BIRTH CERTIFICATE EXTRACT",
      sousTitreLoi:
        "Délivré en application de l'Article 18 de la Loi N° 2011/011 du 6 mai 2011 modifiant et complétant certaines dispositions de l'Ordonnance n° 81-02 portant organisation de l'état civil.",
      enfant: {
        nomComplet: "NDIEMI À GOUFANI Jean Placide Ariel",
        dateNaissanceTexte: "Le vingt quatre mai Deux mille neuf (24/05/2009)",
        heureNaissanceTexte: "Non mentionnée",
        lieuNaissance: "l'hôpital de Bokito",
        sexe: "MASCULIN",
      },
      pere: {
        nomComplet: "GOUFANI SIACK Jacques",
        lieuNaissance: "Yaoundé",
        dateNaissanceTexte: "Non mentionnée",
        profession: "Enseignant",
        domicile: "Bokito - Ville",
        nationalite: "Camerounaise",
      },
      mere: {
        nomComplet: "BIABI Jeannette",
        lieuNaissance: "Yaoundé",
        dateNaissanceTexte: "Le 30 Avril 1957 (30/04/1957)",
        profession: "Enseignante",
        domicile: "Bokito - Ville",
        nationalite: "Camerounaise",
      },
      declaration: {
        texteJugement:
          "Suivant jugement de reconstitution d'Acte de Naissance N° 535 / TPD du 23-11-2018 à Bafia",
        dateTexte: "Le onze juillet deux mil dix neuf (11/07/2019)",
        declarants:
          "Les déclarants (Père et Mère ayant certifié la sincérité de la présente déclaration)",
        tribunal: "Tribunal de Première Instance (TPD) de Bafia",
      },
      mentionsMarginales:
        "Néant à la date de délivrance du présent extrait d'acte de naissance certifié conforme.",
      certification: {
        faitA: "Bokito",
        faitLe: "11 juillet 2019",
        officierNom: "Mme Bamanougue Ploumié Cécile",
        officierQualite: "2e Adjoint au Maire (Officier d'État Civil)",
        secretaireNom: "Mme Imbomo Justine",
        secretaireQualite: "Secrétaire d'État Civil",
        tamponTexte: "COMMUNE DE BOKITO • CENTRE D'ÉTAT CIVIL DE BOKITO-VILLE",
        signatureNom: "C. Ploumié",
      },
    },
  },
  {
    id: "dos-2026-ce-ya1-001249",
    numeroDeclaration: "DEC-2026-CE-YA1-001249",
    identifiantBUNEC: "CMR-2026-CE-YA1-NAI-001249",
    typeActe: "ACTE_NAISSANCE",
    titreActe: "Acte de Naissance",
    demandeur: {
      nomComplet: "MBALLA Jean-Baptiste",
      qualite: "Père de l'enfant",
      telephone: "699 12 34 56",
      cni: "118472910",
    },
    titulaire: "TCHOUA MBALLA Christian Lionel",
    provenance: {
      regionNom: "Centre",
      regionId: "CE",
      departement: "Mfoundi",
      communeNom: "Yaoundé Iᵉʳ",
      communeId: "CE-YA1",
      centreEtatCivil: "Centre Principal d’État Civil (Mairie de Yaoundé 1er)",
      canalDepot: "Guichet Physique n° 02",
      adresseIp: "197.234.221.14",
      operateur: "Camtel Fibre Réseau WAN Gov",
      terminal: "Poste Guichet #14 (Officier Titulaire)",
    },
    dateEnregistrement: "2026-08-25T08:30:14Z",
    statut: "PRETE_RETRAIT",
    libelleStatut: "Disponible au guichet — Prêt pour délivrance (BAT Émis)",
    etapeCourante: 4,
    notificationRetraitEnvoyee: true,
    canalNotification: "WhatsApp (+237 699 12 34 56) & SMS",
    dateNotification: "2026-09-05T09:00:00Z",
    lieuRetrait: "Guichet 03 (Mairie de Yaoundé 1er - Bastos)",
    empreinteSha256:
      "9b1deb4d3b7d4bad9bdd2b0d7b3dcb6d482910fa882a104bcde93481726a9bf4",
  },
  {
    id: "dos-2026-lt-dl1-000418",
    numeroDeclaration: "DEC-2026-LT-DL1-000418",
    identifiantBUNEC: "CMR-2026-LT-DL1-MAR-000418",
    typeActe: "ACTE_MARIAGE",
    titreActe: "Acte de Mariage",
    demandeur: {
      nomComplet: "EBELLE Samuel Patrick",
      qualite: "Époux Déclarant",
      telephone: "677 45 89 20",
      cni: "109283741",
    },
    titulaire: "EBELLE Samuel & NGONO Clarisse",
    provenance: {
      regionNom: "Littoral",
      regionId: "LT",
      departement: "Wouri",
      communeNom: "Douala Iᵉʳ",
      communeId: "LT-DL1",
      centreEtatCivil: "Centre Principal de Bonanjo (Hôtel de Ville)",
      canalDepot: "Borne Numérique BUNEC",
      adresseIp: "129.0.211.85",
      operateur: "Orange Cameroun 4G+",
      terminal: "Borne Libre-Service #01 Bonanjo",
    },
    dateEnregistrement: "2026-08-27T11:00:22Z",
    statut: "PRETE_RETRAIT",
    libelleStatut: "Disponible au guichet — Prêt pour délivrance (BAT Émis)",
    etapeCourante: 4,
    notificationRetraitEnvoyee: true,
    canalNotification: "WhatsApp & Telegram (@BUNEC_Suivi_Bot)",
    dateNotification: "2026-09-06T10:15:00Z",
    lieuRetrait: "Guichet des Mariages - Bonanjo",
    empreinteSha256:
      "c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef01234",
  },
  {
    id: "dos-2026-ou-bf1-000105",
    numeroDeclaration: "DEC-2026-OU-BF1-000105",
    identifiantBUNEC: "CMR-2026-OU-BF1-DEC-000105",
    typeActe: "ACTE_DECES",
    titreActe: "Acte de Décès",
    demandeur: {
      nomComplet: "FOTSO KAMGA Alain",
      qualite: "Fils majeur du défunt",
      telephone: "695 33 21 09",
      cni: "200192837",
    },
    titulaire: "Feu FOTSO Émile (72 ans)",
    provenance: {
      regionNom: "Ouest",
      regionId: "OU",
      departement: "Mifi",
      communeNom: "Bafoussam Iᵉʳ",
      communeId: "OU-BF1",
      centreEtatCivil: "Centre d’État Civil Principal de Bafoussam 1er",
      canalDepot: "Hôpital Régional de Bafoussam (Interconnexion Santé)",
      adresseIp: "154.72.164.30",
      operateur: "MTN Cameroon Fibre",
      terminal: "Bureau des Admissions & Décès HRB",
    },
    dateEnregistrement: "2026-08-12T09:15:00Z",
    statut: "PRETE_RETRAIT",
    libelleStatut: "Disponible au guichet — Prêt pour délivrance (BAT Émis)",
    etapeCourante: 4,
    notificationRetraitEnvoyee: true,
    canalNotification: "SMS & WhatsApp (+237 695 33 21 09)",
    dateNotification: "2026-08-16T14:00:00Z",
    lieuRetrait: "Guichet 01 - Hôtel de Ville Bafoussam",
    empreinteSha256:
      "e8f7a6b5c4d3e2f10987654321fedcba0987654321fedcba0987654321fedcba",
  },
  {
    id: "dos-2026-ce-ya1-000072",
    numeroDeclaration: "DEC-2026-CE-YA1-000072",
    identifiantBUNEC: "CMR-2026-CE-YA1-JUG-000072",
    typeActe: "DECLARATION_TARDIVE_JUGEMENT_SUPPLETIF",
    titreActe: "Jugement Supplétif (TPI)",
    demandeur: {
      nomComplet: "KAMDEM Joseph",
      qualite: "Requérant Légitime",
      telephone: "651 88 44 22",
      cni: "108392019",
    },
    titulaire: "KAMDEM Joseph (Reconstitution de naissance)",
    provenance: {
      regionNom: "Centre",
      regionId: "CE",
      departement: "Mfoundi",
      communeNom: "Yaoundé Iᵉʳ",
      communeId: "CE-YA1",
      centreEtatCivil: "Centre Principal d’État Civil de Yaoundé Iᵉʳ",
      canalDepot: "Portail Citoyen En Ligne",
      adresseIp: "197.234.221.99",
      operateur: "Orange CMR Mobile",
      terminal: "Chrome Mobile / Android",
    },
    dateEnregistrement: "2026-08-25T14:00:00Z",
    statut: "PRETE_RETRAIT",
    libelleStatut: "Disponible au guichet — Prêt pour délivrance (BAT Émis)",
    etapeCourante: 4,
    notificationRetraitEnvoyee: true,
    canalNotification: "WhatsApp & SMS",
    dateNotification: "2026-08-28T09:30:00Z",
    lieuRetrait: "Guichet Transcription - Mairie Yaoundé I",
    empreinteSha256:
      "a9b8c7d6e5f43210fedcba9876543210fedcba9876543210fedcba9876543210",
  },
  {
    id: "dos-2026-no-ga1-002811",
    numeroDeclaration: "DEC-2026-NO-GA1-002811",
    identifiantBUNEC: "CMR-2026-NO-GA1-NAI-002811",
    typeActe: "ACTE_NAISSANCE",
    titreActe: "Acte de Naissance",
    demandeur: {
      nomComplet: "OUMAROU ABBO",
      qualite: "Père déclarant",
      telephone: "694 55 12 30",
      cni: "110928374",
    },
    titulaire: "ABBO Oumarou Junior",
    provenance: {
      regionNom: "Nord",
      regionId: "NO",
      departement: "Bénoué",
      communeNom: "Garoua Iᵉʳ",
      communeId: "NO-GA1",
      centreEtatCivil: "Centre Principal de Garoua 1er (Plateau)",
      canalDepot: "Guichet Physique n° 01",
      adresseIp: "154.70.18.22",
      operateur: "Camtel ADSL Garoua",
      terminal: "Poste Guichet #02 Garoua",
    },
    dateEnregistrement: "2026-09-02T10:20:11Z",
    statut: "INSTRUCTION",
    libelleStatut: "En cours d’instruction administrative (BAT Verrouillé)",
    etapeCourante: 2,
    notificationRetraitEnvoyee: false,
    canalNotification: "En attente de signature de l’Officier",
    dateNotification: null,
    lieuRetrait: "Mairie de Garoua 1er",
    empreinteSha256:
      "7a8b9c0d1e2f3456789abcdef0123456789abcdef0123456789abcdef0123456",
  },
  {
    id: "dos-2026-en-ma1-000942",
    numeroDeclaration: "DEC-2026-EN-MA1-000942",
    identifiantBUNEC: "CMR-2026-EN-MA1-MAR-000942",
    typeActe: "ACTE_MARIAGE",
    titreActe: "Acte de Mariage",
    demandeur: {
      nomComplet: "ALHADJI Mamadou",
      qualite: "Futur Époux",
      telephone: "691 22 33 44",
      cni: "115492018",
    },
    titulaire: "ALHADJI Mamadou & FADIMATOU Ousmanou",
    provenance: {
      regionNom: "Extrême-Nord",
      regionId: "EN",
      departement: "Diamaré",
      communeNom: "Maroua Iᵉʳ",
      communeId: "EN-MA1",
      centreEtatCivil: "Hôtel de Ville de Maroua Iᵉʳ",
      canalDepot: "Guichet Central Maroua",
      adresseIp: "154.68.91.4",
      operateur: "MTN Cameroon 4G",
      terminal: "Guichet État Civil #03",
    },
    dateEnregistrement: "2026-09-03T15:45:00Z",
    statut: "INSTRUCTION",
    libelleStatut: "En cours d’instruction (Publication des bans en cours)",
    etapeCourante: 3,
    notificationRetraitEnvoyee: false,
    canalNotification: "Notification de retrait en attente",
    dateNotification: null,
    lieuRetrait: "Hôtel de Ville de Maroua 1er",
    empreinteSha256:
      "1a2b3c4d5e6f7890123456789abcdef0123456789abcdef0123456789abcdef0",
  },
  {
    id: "dos-2026-su-kr1-000833",
    numeroDeclaration: "DEC-2026-SU-KR1-000833",
    identifiantBUNEC: "CMR-2026-SU-KR1-NAI-000833",
    typeActe: "ACTE_NAISSANCE",
    titreActe: "Acte de Naissance",
    demandeur: {
      nomComplet: "MBIA François",
      qualite: "Père déclarant",
      telephone: "674 11 22 33",
      cni: "119284710",
    },
    titulaire: "MBIA Paul Valéry",
    provenance: {
      regionNom: "Sud",
      regionId: "SU",
      departement: "Océan",
      communeNom: "Kribi Iᵉʳ",
      communeId: "SU-KR1",
      centreEtatCivil: "Centre d’État Civil Principal de Kribi",
      canalDepot: "Maternité Hôpital District Kribi",
      adresseIp: "197.234.225.10",
      operateur: "Camtel Fibre Kribi",
      terminal: "Borne Maternité Kribi",
    },
    dateEnregistrement: "2026-08-29T07:50:18Z",
    statut: "PRETE_RETRAIT",
    libelleStatut: "Disponible au guichet — Prêt pour délivrance (BAT Émis)",
    etapeCourante: 4,
    notificationRetraitEnvoyee: true,
    canalNotification: "WhatsApp & SMS (+237 674 11 22 33)",
    dateNotification: "2026-09-04T11:00:00Z",
    lieuRetrait: "Guichet 02 - Mairie de Kribi 1er",
    empreinteSha256:
      "4f5e6d7c8b9a0123456789abcdef0123456789abcdef0123456789abcdef0123",
  },
  {
    id: "dos-2026-ad-ng1-000319",
    numeroDeclaration: "DEC-2026-AD-NG1-000319",
    identifiantBUNEC: "CMR-2026-AD-NG1-DEC-000319",
    typeActe: "ACTE_DECES",
    titreActe: "Acte de Décès",
    demandeur: {
      nomComplet: "BOUBA Haman",
      qualite: "Frère du défunt",
      telephone: "693 88 77 66",
      cni: "113849201",
    },
    titulaire: "Feu BOUBA Ahmadou",
    provenance: {
      regionNom: "Adamaoua",
      regionId: "AD",
      departement: "Vina",
      communeNom: "Ngaoundéré Iᵉʳ",
      communeId: "AD-NG1",
      centreEtatCivil: "Centre Principal de Ngaoundéré Iᵉʳ",
      canalDepot: "Guichet Physique Central",
      adresseIp: "154.70.44.18",
      operateur: "Orange CMR Fibre",
      terminal: "Poste Guichet #01 Ngaoundéré",
    },
    dateEnregistrement: "2026-08-20T11:30:00Z",
    statut: "REJETEE",
    libelleStatut: "Pièce Rejetée — Discordance Documentaire (BAT Bloqué)",
    etapeCourante: 2,
    motifRejet: "Discordance d’orthographe sur le certificat médical de décès",
    notificationRetraitEnvoyee: false,
    canalNotification: "Notification de rejet transmise par SMS",
    dateNotification: "2026-08-22T14:10:00Z",
    lieuRetrait: "Guichet des Régularisations - Mairie Ngaoundéré",
    empreinteSha256:
      "3c2b1a0f9e8d7c6b5a4938271605f4e3d2c1b0a987654321fedcba0987654321",
  },
  {
    id: "dos-2026-nw-ba1-000214",
    numeroDeclaration: "DEC-2026-NW-BA1-000214",
    identifiantBUNEC: "CMR-2026-NW-BA1-MAR-000214",
    typeActe: "ACTE_MARIAGE",
    titreActe: "Acte de Mariage",
    demandeur: {
      nomComplet: "FON TITA Eric",
      qualite: "Époux Déclarant",
      telephone: "679 40 50 60",
      cni: "117382910",
    },
    titulaire: "FON TITA Eric & NFORBA Grace Bih",
    provenance: {
      regionNom: "Nord-Ouest",
      regionId: "NW",
      departement: "Mezam",
      communeNom: "Bamenda Iᵉʳ",
      communeId: "NW-BA1",
      centreEtatCivil: "Hôtel de Ville de Bamenda I (Up-Station)",
      canalDepot: "Guichet Central Mairie",
      adresseIp: "129.0.219.70",
      operateur: "MTN Cameroon Fixed WAN",
      terminal: "Poste Officier Principal Bamenda",
    },
    dateEnregistrement: "2026-08-18T10:00:00Z",
    statut: "PRETE_RETRAIT",
    libelleStatut: "Disponible au guichet — Prêt pour délivrance (BAT Émis)",
    etapeCourante: 4,
    notificationRetraitEnvoyee: true,
    canalNotification: "WhatsApp (+237 679 40 50 60)",
    dateNotification: "2026-08-25T16:00:00Z",
    lieuRetrait: "Guichet 01 - Bamenda I Council",
    empreinteSha256:
      "887766554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa99",
  },
  {
    id: "dos-2026-sw-li1-000678",
    numeroDeclaration: "DEC-2026-SW-LI1-000678",
    identifiantBUNEC: "CMR-2026-SW-LI1-NAI-000678",
    typeActe: "ACTE_NAISSANCE",
    titreActe: "Acte de Naissance",
    demandeur: {
      nomComplet: "ENOW Divine",
      qualite: "Père déclarant",
      telephone: "671 99 88 77",
      cni: "201948271",
    },
    titulaire: "ENOW Divine Ayuk Junior",
    provenance: {
      regionNom: "Sud-Ouest",
      regionId: "SW",
      departement: "Fako",
      communeNom: "Limbe Iᵉʳ",
      communeId: "SW-LI1",
      centreEtatCivil: "Centre Principal de Limbe I (Poh)",
      canalDepot: "Borne Tactile Guichet",
      adresseIp: "129.0.214.33",
      operateur: "Camtel Limbe WAN",
      terminal: "Borne Libre-Service Limbe Council",
    },
    dateEnregistrement: "2026-08-26T12:40:00Z",
    statut: "PRETE_RETRAIT",
    libelleStatut: "Disponible au guichet — Prêt pour délivrance (BAT Émis)",
    etapeCourante: 4,
    notificationRetraitEnvoyee: true,
    canalNotification: "WhatsApp & SMS (+237 671 99 88 77)",
    dateNotification: "2026-09-01T09:15:00Z",
    lieuRetrait: "Limbe I Council Civil Registry Desk",
    empreinteSha256:
      "11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff",
  },
];

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

const ENV = process.env.NODE_ENV || "development";
const isProduction = ENV === "production";
const SESSION_SECRET =
  process.env.BUNEC_SESSION_SECRET ||
  (isProduction ? null : "dev-bunec-session-secret-change-me");
const SESSION_COOKIE_NAME = "bunec_session";
const SESSION_TTL_MS = 15 * 60 * 1000;
const ADMIN_USERNAME = process.env.BUNEC_ADMIN_USERNAME || "bunec";
const ADMIN_PASSWORD_SALT =
  process.env.BUNEC_ADMIN_PASSWORD_SALT ||
  (isProduction ? null : "bunec-admin-dev-salt");
const DEFAULT_ADMIN_PASSWORD =
  process.env.BUNEC_ADMIN_PASSWORD ||
  (isProduction ? null : "change-me-strong");
const ADMIN_PASSWORD_HASH =
  process.env.BUNEC_ADMIN_PASSWORD_HASH ||
  (isProduction
    ? null
    : deriveAdminPasswordHash(DEFAULT_ADMIN_PASSWORD, ADMIN_PASSWORD_SALT));
const loginAttemptStore = new Map();
const csrfTokens = new Map();

if (isProduction && !SESSION_SECRET) {
  throw new Error("BUNEC_SESSION_SECRET doit être défini en production.");
}
if (
  isProduction &&
  (!ADMIN_PASSWORD_SALT || !ADMIN_PASSWORD_HASH || !DEFAULT_ADMIN_PASSWORD)
) {
  throw new Error(
    "BUNEC_ADMIN_PASSWORD_HASH/BUNEC_ADMIN_PASSWORD_SALT doivent être définis en production.",
  );
}

const RATE_LIMIT_MAX_REQUESTS = Number(
  process.env.RATE_LIMIT_MAX_REQUESTS || 120,
);
const RATE_LIMIT_WINDOW_MS = Number(
  process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
);
const rateLimitStore = new Map();

function deriveAdminPasswordHash(password, salt) {
  return crypto
    .pbkdf2Sync(
      String(password || ""),
      String(salt || ""),
      220000,
      32,
      "sha256",
    )
    .toString("hex");
}

function stripSensitiveText(value) {
  return String(value || "")
    .replace(/[\r\n<>]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 255);
}

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  return req.socket.remoteAddress || "unknown";
}

function checkRateLimit(req, res) {
  const ip = getClientIp(req);
  const now = Date.now();
  const entry = rateLimitStore.get(ip) || { count: 0, firstSeen: now };

  if (now - entry.firstSeen > RATE_LIMIT_WINDOW_MS) {
    entry.count = 0;
    entry.firstSeen = now;
  }

  entry.count += 1;
  rateLimitStore.set(ip, entry);

  if (entry.count > RATE_LIMIT_MAX_REQUESTS) {
    res.writeHead(429, { "Content-Type": "application/json; charset=utf-8" });
    res.end(
      JSON.stringify({
        success: false,
        error: "Trop de requêtes. Veuillez patienter avant de réessayer.",
      }),
    );
    return true;
  }

  return false;
}

function parseCookies(headerValue = "") {
  return headerValue.split(";").reduce((result, cookie) => {
    const [name, ...rest] = cookie.split("=");
    if (!name) {
      return result;
    }
    result[name.trim()] = rest.join("=").trim();
    return result;
  }, {});
}

function encodeSessionPayload(payload) {
  const payloadString = JSON.stringify(payload);
  const encoded = Buffer.from(payloadString, "utf8").toString("base64url");
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payloadString)
    .digest("hex");
  return `${encoded}.${signature}`;
}

function decodeSessionPayload(token) {
  if (!token || typeof token !== "string") {
    return null;
  }

  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) {
    return null;
  }

  const expected = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(Buffer.from(payloadB64, "base64url").toString("utf8"))
    .digest("hex");
  if (
    !crypto.timingSafeEqual(
      Buffer.from(expected, "hex"),
      Buffer.from(signature, "hex"),
    )
  ) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

function issueSession(username) {
  const now = Date.now();
  return encodeSessionPayload({
    username,
    issuedAt: now,
    expiresAt: now + SESSION_TTL_MS,
  });
}

function requireSession(req, res, next) {
  const cookies = parseCookies(req.headers.cookie || "");
  const token = cookies[SESSION_COOKIE_NAME];
  const session = decodeSessionPayload(token);

  if (!session || !session.username || session.expiresAt < Date.now()) {
    res.writeHead(401, { "Content-Type": "application/json; charset=utf-8" });
    res.end(
      JSON.stringify({ success: false, error: "Session invalide ou expirée." }),
    );
    return;
  }

  req.session = { username: session.username };
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session || req.session.username !== ADMIN_USERNAME) {
    res.writeHead(403, { "Content-Type": "application/json; charset=utf-8" });
    res.end(
      JSON.stringify({
        success: false,
        error: "Accès refusé : droits administrateur requis.",
      }),
    );
    return;
  }

  next();
}

function ensureCsrf(req, res, next) {
  if (req.method === "GET" || req.method === "OPTIONS") {
    next();
    return;
  }

  const suppliedToken = req.headers["x-csrf-token"];
  const cookieToken = parseCookies(req.headers.cookie || "")["bunec_csrf"];

  if (!suppliedToken || !cookieToken || suppliedToken !== cookieToken) {
    res.writeHead(403, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ success: false, error: "Jeton CSRF invalide." }));
    return;
  }

  next();
}

function setSessionCookie(res, sessionToken) {
  const secure = isProduction;
  const cookieOptions = [
    `${SESSION_COOKIE_NAME}=${sessionToken}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${SESSION_TTL_MS / 1000}`,
    secure ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");

  res.setHeader("Set-Cookie", cookieOptions);
}

function issueCsrfToken() {
  return crypto.randomBytes(32).toString("hex");
}

function setCsrfCookie(res, token) {
  const secure = isProduction;
  const cookieOptions = [
    `bunec_csrf=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=900",
    secure ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");

  res.setHeader(
    "Set-Cookie",
    `${res.getHeader("Set-Cookie") || ""}; ${cookieOptions}`,
  );
}

function validateAdminCredentials(username, password) {
  const normalizedUser = stripSensitiveText(username || "").toLowerCase();
  const normalizedPass = String(password || "");

  if (!normalizedUser || !normalizedPass) {
    return false;
  }

  if (normalizedUser !== ADMIN_USERNAME.toLowerCase()) {
    return false;
  }

  const passwordHash = deriveAdminPasswordHash(
    normalizedPass,
    ADMIN_PASSWORD_SALT,
  );
  return crypto.timingSafeEqual(
    Buffer.from(passwordHash, "hex"),
    Buffer.from(ADMIN_PASSWORD_HASH, "hex"),
  );
}

function setSecurityHeaders(res, req) {
  const forwardedProto = req.headers["x-forwarded-proto"];
  const isHttps = req.socket.encrypted || forwardedProto === "https";

  res.setHeader(
    "Access-Control-Allow-Origin",
    process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")[0].trim()
      : "http://localhost:3000",
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Bunec-Signature, X-CSRF-Token",
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  res.setHeader("X-XSS-Protection", "0");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com; font-src 'self' data: https://fonts.googleapis.com https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https:; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';",
  );

  if (isProduction && isHttps) {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload",
    );
  }
}

function maskPhoneNumber(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length < 8) {
    return "***";
  }
  const suffix = digits.slice(-4);
  return `+***${suffix}`;
}

function maskIdentifier(value) {
  const clean = String(value || "").replace(/\D/g, "");
  if (!clean) {
    return "***";
  }
  return `***${clean.slice(-4)}`;
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  setSecurityHeaders(res, req);

  if (checkRateLimit(req, res)) {
    return;
  }

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // --------------------------------------------------------------------------
  // API ROUTING
  // --------------------------------------------------------------------------

  // 1. Référentiel territorial hiérarchique
  if (pathname === "/api/v1/referentiel/cameroun" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(territorialData));
    return;
  }

  // 2. Moteur de Suivi de Dossier
  if (pathname === "/api/v1/dossiers/suivi" && req.method === "GET") {
    const q = parsedUrl.query || {};
    const typeFilter = (q.typeActe || "").trim();
    const hasAnySearchValue = Object.values(q).some(
      (value) => String(value || "").trim().length > 0,
    );

    if (!hasAnySearchValue) {
      res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
      res.end(
        JSON.stringify({
          success: false,
          error:
            "Veuillez renseigner un numéro de dossier, un téléphone ou un email.",
        }),
      );
      return;
    }

    const matchedDossier = dossiersHistoriqueDatabase.find((d) =>
      dossierMatchesQuery(d, q, typeFilter),
    );

    if (!matchedDossier) {
      res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
      res.end(
        JSON.stringify({ success: false, error: "Dossier introuvable." }),
      );
      return;
    }

    const notificationTarget = normalizeEmail(
      q.email || getDossierNotificationEmail(matchedDossier),
    );
    const otpCode = String(Math.floor(100000 + Math.random() * 900000));
    const dossierKey = matchedDossier.id;

    otpVerificationStore.set(dossierKey, {
      otp: otpCode,
      email: notificationTarget,
      dossierId: matchedDossier.id,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(
      JSON.stringify({
        success: true,
        found: true,
        requiresOtp: true,
        otpCode,
        message: `Un code OTP a été envoyé à ${notificationTarget} pour vérifier votre identité avant consultation du statut du dossier. Code temporaire: ${otpCode}.`,
        notificationTarget,
        dossier: {
          id: matchedDossier.id,
          bunecTrackingId: matchedDossier.identifiantBUNEC,
          numeroRecepisse: matchedDossier.numeroDeclaration,
          typeActe: matchedDossier.typeActe,
          statut: matchedDossier.statut,
          libelleStatut: matchedDossier.libelleStatut,
        },
      }),
    );
    return;
  }

  if (
    pathname === "/api/v1/dossiers/suivi/verification" &&
    req.method === "POST"
  ) {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const payload = JSON.parse(body || "{}");
        const dossierId = String(payload.dossierId || "").trim();
        const otpCode = String(payload.otp || "").trim();
        const emailTarget = normalizeEmail(payload.email || "");

        let verificationEntry = null;
        if (dossierId) {
          verificationEntry = otpVerificationStore.get(dossierId);
        }

        if (!verificationEntry && emailTarget) {
          verificationEntry = Array.from(otpVerificationStore.values()).find(
            (entry) => entry.email === emailTarget,
          );
        }

        if (!verificationEntry) {
          res.writeHead(401, {
            "Content-Type": "application/json; charset=utf-8",
          });
          res.end(
            JSON.stringify({
              success: false,
              error: "Code OTP invalide ou expiré.",
            }),
          );
          return;
        }

        if (Date.now() > verificationEntry.expiresAt) {
          otpVerificationStore.delete(verificationEntry.dossierId);
          res.writeHead(401, {
            "Content-Type": "application/json; charset=utf-8",
          });
          res.end(
            JSON.stringify({
              success: false,
              error: "Code OTP invalide ou expiré.",
            }),
          );
          return;
        }

        if (verificationEntry.otp !== otpCode) {
          res.writeHead(401, {
            "Content-Type": "application/json; charset=utf-8",
          });
          res.end(
            JSON.stringify({
              success: false,
              error: "Code OTP invalide ou expiré.",
            }),
          );
          return;
        }

        const dossier = dossiersHistoriqueDatabase.find(
          (item) =>
            item.id === verificationEntry.dossierId ||
            item.identifiantBUNEC === dossierId,
        );

        if (!dossier) {
          res.writeHead(404, {
            "Content-Type": "application/json; charset=utf-8",
          });
          res.end(
            JSON.stringify({ success: false, error: "Dossier introuvable." }),
          );
          return;
        }

        otpVerificationStore.delete(verificationEntry.dossierId);

        const isPret = dossier.statut === "PRETE_RETRAIT";
        const isRejet = dossier.statut === "REJETEE";
        const codeCouleur = isPret ? "green" : isRejet ? "red" : "amber";

        const responseMatch = {
          id: dossier.id,
          bunecTrackingId: dossier.identifiantBUNEC,
          numeroRecepisse: dossier.numeroDeclaration,
          typeActe: dossier.typeActe,
          titreActe: dossier.titreActe,
          localisation: {
            region: dossier.provenance.regionNom,
            regionId: dossier.provenance.regionId,
            departement: dossier.provenance.departement,
            commune: dossier.provenance.communeNom,
            communeId: dossier.provenance.communeId,
            centre: dossier.provenance.centreEtatCivil,
            canalDepot: dossier.provenance.canalDepot,
            operateur: dossier.provenance.operateur,
          },
          demandeur: {
            nomComplet: dossier.demandeur.nomComplet,
            qualite: dossier.demandeur.qualite,
            telephone: dossier.demandeur.telephone,
            cni: dossier.demandeur.cni,
            email: getDossierNotificationEmail(dossier),
          },
          titulaire: dossier.titulaire,
          cycleDeVie: {
            etapeCourante: dossier.etapeCourante,
            codeCouleur: codeCouleur,
            statutActuel: dossier.statut,
            libelleStatut: dossier.libelleStatut,
            motifBlocage: dossier.motifRejet || null,
            etapes: [
              {
                numero: 1,
                nom: "Dossier déposé et enregistré",
                statut: "COMPLETED",
                horodatage: dossier.dateEnregistrement,
                description: `Enregistrement officiel au ${dossier.provenance.centreEtatCivil}. Identifiant BUNEC unique généré.`,
                acteur: "Guichet d'État Civil",
              },
              {
                numero: 2,
                nom: "Instruction & Vérification juridique",
                statut: isRejet ? "REJECTED" : "COMPLETED",
                horodatage: "2019-07-11T10:15:00Z",
                description: isRejet
                  ? "Anomalie constatée sur les pièces justificatives."
                  : "Vérification probante de régularité juridique achevée avec succès.",
                acteur: "Service Juridique & Contentieux",
              },
              {
                numero: 3,
                nom: "Validation & Signature de l'Officier",
                statut: isRejet ? "PENDING" : "COMPLETED",
                horodatage: isRejet ? null : "2019-07-11T11:30:00Z",
                description: isRejet
                  ? "Signature suspendue pour non-conformité matérielle."
                  : `Signé électroniquement par ${dossier.donneesActeCivil ? dossier.donneesActeCivil.certification.officierNom : "l'Officier d'État Civil"}. Inscription au registre.`,
                acteur: "Officier d'État Civil",
              },
              {
                numero: 4,
                nom: "Disponible au guichet / Prêt pour délivrance",
                statut: isPret ? "COMPLETED" : "PENDING",
                horodatage: isPret ? dossier.dateNotification : null,
                description: isPret
                  ? "Disponible au guichet municipal. Bon à Tirer (BAT) émis et consultable."
                  : "En attente de délivrance.",
                convocation: isPret
                  ? `Retrait ouvert dès à présent au ${dossier.lieuRetrait}`
                  : null,
              },
            ],
          },
          donneesActeCivil: dossier.donneesActeCivil || null,
          bat: {
            dossierId: dossier.id,
            available: isPret && !!dossier.donneesActeCivil,
            document: isPret ? dossier.donneesActeCivil || null : null,
          },
          derniereMiseAJour: new Date().toISOString(),
        };

        res.writeHead(200, {
          "Content-Type": "application/json; charset=utf-8",
        });
        res.end(
          JSON.stringify({
            success: true,
            verified: true,
            dossier: responseMatch,
          }),
        );
      } catch (err) {
        res.writeHead(400, {
          "Content-Type": "application/json; charset=utf-8",
        });
        res.end(
          JSON.stringify({
            success: false,
            error: "Erreur lors de la vérification OTP.",
          }),
        );
      }
    });
    return;
  }

  // 3. Registre Dématérialisé des Bans de Mariage
  if (pathname === "/api/v1/bans" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(bansDatabase));
    return;
  }

  // 4. Saisine d'Opposition au Mariage
  if (
    pathname.match(/^\/api\/v1\/bans\/([^/]+)\/oppositions$/) &&
    req.method === "POST"
  ) {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const payload = JSON.parse(body);
        const banId = pathname.split("/")[4];
        const banIndex = bansDatabase.findIndex((b) => b.id === banId);

        const sha256 = crypto
          .createHash("sha256")
          .update(`${banId}:${payload.opposantCni}:${Date.now()}`)
          .digest("hex");

        if (banIndex !== -1) {
          bansDatabase[banIndex].statutBan = "OPPOSITION_ENREGISTREE";
        }

        const oppositionResult = {
          success: true,
          message:
            "Opposition formelle enregistrée avec horodatage certifié et transmise au Procureur de la République.",
          numeroOpposition: `OPP-2026-${Date.now().toString().slice(-6)}`,
          horodatageCertifieSha256: sha256,
          dateSaisine: new Date().toISOString(),
        };

        res.writeHead(201, {
          "Content-Type": "application/json; charset=utf-8",
        });
        res.end(JSON.stringify(oppositionResult));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ success: false, error: "Données JSON invalides." }),
        );
      }
    });
    return;
  }

  // 5. Authentification Espace Admin (session + hachage PBKDF2)
  if (pathname === "/api/v1/auth/admin" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const payload = JSON.parse(body || "{}");
        const username = stripSensitiveText(payload.username);
        const password = String(payload.password || "");
        const ip = getClientIp(req);
        const attempts = loginAttemptStore.get(ip) || {
          count: 0,
          firstSeen: Date.now(),
        };

        if (Date.now() - attempts.firstSeen > 15 * 60 * 1000) {
          attempts.count = 0;
          attempts.firstSeen = Date.now();
        }

        const valid = validateAdminCredentials(username, password);
        if (!valid) {
          attempts.count += 1;
          loginAttemptStore.set(ip, attempts);
          if (attempts.count >= 5) {
            res.writeHead(429, {
              "Content-Type": "application/json; charset=utf-8",
            });
            res.end(
              JSON.stringify({
                success: false,
                error: "Trop de tentatives. Réessayez plus tard.",
              }),
            );
            return;
          }
          res.writeHead(401, {
            "Content-Type": "application/json; charset=utf-8",
          });
          res.end(
            JSON.stringify({
              success: false,
              error: "Identifiant ou mot de passe invalide.",
            }),
          );
          return;
        }

        loginAttemptStore.delete(ip);
        const sessionToken = issueSession(ADMIN_USERNAME);
        const csrfToken = issueCsrfToken();
        csrfTokens.set(ADMIN_USERNAME, csrfToken);
        setSessionCookie(res, sessionToken);
        setCsrfCookie(res, csrfToken);

        res.writeHead(200, {
          "Content-Type": "application/json; charset=utf-8",
        });
        res.end(
          JSON.stringify({
            success: true,
            message:
              "Authentification réussie. Bienvenue sur l’Espace Admin BUNEC.",
            user: {
              username: ADMIN_USERNAME,
              role: "SUPER_ADMIN_BUNEC",
              nomComplet: "Officier Supérieur Central BUNEC",
              direction: "Direction Générale - Inspection & Registre National",
            },
            csrfToken,
          }),
        );
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ success: false, error: "Format JSON invalide." }),
        );
      }
    });
    return;
  }

  // 6. Historique National de Tous les Dossiers & Provenances (Espace Admin)
  if (pathname === "/api/v1/admin/historique" && req.method === "GET") {
    requireSession(req, res, () => {
      requireAdmin(req, res, () => {
        res.writeHead(200, {
          "Content-Type": "application/json; charset=utf-8",
        });
        res.end(
          JSON.stringify({
            success: true,
            total: dossiersHistoriqueDatabase.length,
            derniereMiseAJour: new Date().toISOString(),
            dossiers: dossiersHistoriqueDatabase.map((d) => ({
              ...d,
              demandeur: {
                ...d.demandeur,
                telephone: maskPhoneNumber(d.demandeur.telephone),
                cni: maskIdentifier(d.demandeur.cni),
              },
              provenance: {
                ...d.provenance,
                adresseIp: d.provenance.adresseIp ? "***" : null,
              },
            })),
          }),
        );
      });
    });
    return;
  }

  // 7. Modification Administrative de Statut de Dossier (BUNEC Admin)
  if (
    pathname.match(/^\/api\/v1\/admin\/dossiers\/([^/]+)\/statut$/) &&
    req.method === "POST"
  ) {
    requireSession(req, res, () => {
      requireAdmin(req, res, () => {
        ensureCsrf(req, res, () => {
          let body = "";
          req.on("data", (chunk) => (body += chunk));
          req.on("end", () => {
            try {
              const payload = JSON.parse(body || "{}");
              const dossierId = pathname.split("/")[5];
              const item = dossiersHistoriqueDatabase.find(
                (d) =>
                  d.id === dossierId ||
                  d.numeroDeclaration === dossierId ||
                  d.identifiantBUNEC === dossierId,
              );

              if (item) {
                item.statut = payload.nouveauStatut || item.statut;
                if (payload.nouveauStatut === "PRETE_RETRAIT") {
                  item.libelleStatut =
                    "Disponible au guichet — Prêt pour délivrance (BAT Émis)";
                  item.etapeCourante = 4;
                  item.notificationRetraitEnvoyee = true;
                  item.dateNotification = new Date().toISOString();
                } else if (payload.nouveauStatut === "REJETEE") {
                  item.libelleStatut = "Pièce Rejetée — Dossier Bloqué";
                  item.etapeCourante = 2;
                  item.motifRejet =
                    payload.motif || "Discordance de pièces justificatives";
                  item.notificationRetraitEnvoyee = false;
                } else if (payload.nouveauStatut === "INSTRUCTION") {
                  item.libelleStatut =
                    "En cours d’instruction administrative (BAT Verrouillé)";
                  item.etapeCourante = 2;
                  item.notificationRetraitEnvoyee = false;
                }
                res.writeHead(200, {
                  "Content-Type": "application/json; charset=utf-8",
                });
                res.end(
                  JSON.stringify({
                    success: true,
                    message: "Statut mis à jour avec succès.",
                    dossier: item,
                  }),
                );
              } else {
                res.writeHead(404, {
                  "Content-Type": "application/json; charset=utf-8",
                });
                res.end(
                  JSON.stringify({
                    success: false,
                    error: "Dossier introuvable.",
                  }),
                );
              }
            } catch (err) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  success: false,
                  error: "Erreur lors de la mise à jour.",
                }),
              );
            }
          });
        });
      });
    });
    return;
  }

  // --------------------------------------------------------------------------
  // STATIC FILE SERVING
  // --------------------------------------------------------------------------
  let filePath = path.join(
    PUBLIC_DIR,
    pathname === "/" ? "index.html" : pathname,
  );

  // Sécurité anti-Directory Traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end("Accès interdit");
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      filePath = path.join(PUBLIC_DIR, "index.html");
    }

    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500);
        res.end("Erreur de lecture");
        return;
      }

      // Compression Gzip si supportée par le navigateur
      const acceptEncoding = req.headers["accept-encoding"] || "";
      if (
        acceptEncoding.includes("gzip") &&
        ext.match(/\.(html|js|css|json|svg)$/)
      ) {
        zlib.gzip(content, (zlibErr, compressed) => {
          if (!zlibErr) {
            res.writeHead(200, {
              "Content-Type": contentType,
              "Content-Encoding": "gzip",
              Vary: "Accept-Encoding",
            });
            res.end(compressed);
            return;
          }
          res.writeHead(200, { "Content-Type": contentType });
          res.end(content);
        });
      } else {
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content);
      }
    });
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(
    "========================================================================",
  );
  console.log(`[BUNEC] PLATEFORME ACTIVE SUR LE PORT ${PORT}`);
  console.log(`URL Citoyenne : http://localhost:${PORT}`);
  console.log("Interconnexion Référentiel National & Compression Gzip Prêtes");
  console.log(
    "========================================================================",
  );
});
