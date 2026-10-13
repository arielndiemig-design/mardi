const fs = require("node:fs");
const path = require("node:path");
const SEED_FILE = path.join(__dirname, "../../database/seeds/bunec_referentiel_territorial.json");

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
  {
    id: "b4-2026-ce-ya1-0198",
    referenceLegaleBan: "BAN-2026-CE-YA1-0198",
    centreEtatCivil: "Mairie de Yaoundé Iᵉʳ (Centre Principal)",
    regionNom: "Centre",
    regionId: "CE",
    communeNom: "Yaoundé Iᵉʳ",
    communeId: "CE-YA1",
    epoux: {
      nom: "MBOGA",
      prenom: "Josué Daniel",
      photoUrl: "/images/bans/epoux_mboga.jpg",
      dateNaissance: "1991-03-12",
      lieuNaissance: "Mbalmayo",
      profession: "Chef de Projet",
      domicile: "Melen, Yaoundé",
      pere: "MBOGA Emmanuel",
      mere: "MELI Germaine",
    },
    epouse: {
      nom: "SAMEN",
      prenom: "Anita Laurette",
      photoUrl: "/images/bans/epouse_samen.jpg",
      dateNaissance: "1996-07-21",
      lieuNaissance: "Bafia",
      profession: "Juriste",
      domicile: "Nkolbisson, Yaoundé",
      pere: "SAMEN Pierre",
      mere: "TCHAMDA Roseline",
    },
    regimeMatrimonial: "MONOGAMIE_BIENS_COMMUNS",
    coutumeMatrimoniale: "Coutume Ewondo",
    dateDebutAffichage: "2026-09-05",
    dateFinAffichage: "2026-10-05T18:00:00Z",
    datePrevueCelebration: "2026-10-06",
    lieuPrevuCelebration: "Salle des mariages – Mairie de Yaoundé 1er",
    statutBan: "EN_COURS_AFFICHAGE",
    hashCertifieSha256:
      "824d3b8ad6e0b3431587d1e6f10b1e6b4ec8708c0f93eb1d54ef43e269abaf0e",
  },
  {
    id: "b5-2026-sw-lim-0071",
    referenceLegaleBan: "BAN-2026-SW-LI1-0071",
    centreEtatCivil: "Centre d’État Civil de Limbé Iᵉʳ",
    regionNom: "Sud-Ouest",
    regionId: "SW",
    communeNom: "Limbé Iᵉʳ",
    communeId: "SW-LI1",
    epoux: {
      nom: "AKWA",
      prenom: "Marius Nestor",
      photoUrl: "/images/bans/epoux_akwa.jpg",
      dateNaissance: "1988-11-19",
      lieuNaissance: "Kumba",
      profession: "Technicien de Maintenance",
      domicile: "Mile 2, Limbé",
      pere: "AKWA Jean",
      mere: "LIKENG Alice",
    },
    epouse: {
      nom: "MOUALEU",
      prenom: "Céline Amina",
      photoUrl: "/images/bans/epouse_moualeu.jpg",
      dateNaissance: "1994-05-02",
      lieuNaissance: "Buea",
      profession: "Infirmière",
      domicile: "Limbé-Plateau, Limbé",
      pere: "MOUALEU Gaston",
      mere: "EKWELLE Félicité",
    },
    regimeMatrimonial: "MONOGAMIE_SEPARATION_BIENS",
    coutumeMatrimoniale: "Coutume Bulu",
    dateDebutAffichage: "2026-09-10",
    dateFinAffichage: new Date(Date.now() + 50 * 3600 * 1000).toISOString(),
    datePrevueCelebration: "2026-09-19",
    lieuPrevuCelebration: "Complexe municipal de Limbé",
    statutBan: "EXPIRANT_SOUS_48H",
    hashCertifieSha256:
      "17daf2c3ee8d94b7e5ef9854c2d6ab9b4fc72bb2a1b1b83d62f3c8f3aa118d1a",
  },
  {
    id: "b6-2026-ou-fmb-0088",
    referenceLegaleBan: "BAN-2026-OU-FMB-0088",
    centreEtatCivil: "Mairie de Foumban",
    regionNom: "Ouest",
    regionId: "OU",
    communeNom: "Foumban",
    communeId: "OU-FMB",
    epoux: {
      nom: "KENGNE",
      prenom: "Armand Patrick",
      photoUrl: "/images/bans/epoux_kengne.jpg",
      dateNaissance: "1990-09-08",
      lieuNaissance: "Foumbot",
      profession: "Agent de Sûreté",
      domicile: "Foumban Centre, Ouest",
      pere: "KENGNE Michel",
      mere: "NOUNE Hélène",
    },
    epouse: {
      nom: "TCHUENTE",
      prenom: "Mireille Gertrude",
      photoUrl: "/images/bans/epouse_tchuente.jpg",
      dateNaissance: "1995-12-11",
      lieuNaissance: "Mbandjock",
      profession: "Enseignante",
      domicile: "Mambandja, Foumban",
      pere: "TCHUENTE Jean",
      mere: "MBOYONGS Elisabeth",
    },
    regimeMatrimonial: "POLYGAMIE",
    coutumeMatrimoniale: "Coutume Tikar",
    dateDebutAffichage: "2026-08-18",
    dateFinAffichage: "2026-09-18T18:00:00Z",
    datePrevueCelebration: "2026-09-21",
    lieuPrevuCelebration: "Maison des Cultures de Foumban",
    statutBan: "CLOTURE_SANS_OPPOSITION",
    hashCertifieSha256:
      "b651d60d63a49919f61d1f9c3d681d7f2b29dedd6464fb2b5c1b5de7ac95a868",
  },
  {
    id: "b7-2026-en-mra-0105",
    referenceLegaleBan: "BAN-2026-EN-MA1-0105",
    centreEtatCivil: "Hôtel de Ville de Maroua Iᵉʳ",
    regionNom: "Extrême-Nord",
    regionId: "EN",
    communeNom: "Maroua Iᵉʳ",
    communeId: "EN-MA1",
    epoux: {
      nom: "MOHAMADOU",
      prenom: "Abdoul Karim",
      photoUrl: "/images/bans/epoux_mohamadou.jpg",
      dateNaissance: "1989-02-16",
      lieuNaissance: "Mora",
      profession: "Commerçant",
      domicile: "Mouloudou, Maroua",
      pere: "MOHAMADOU Ali",
      mere: "MAYOKO Awa",
    },
    epouse: {
      nom: "HAMIDOU",
      prenom: "Mariam Aissatou",
      photoUrl: "/images/bans/epouse_hamidou.jpg",
      dateNaissance: "1992-12-04",
      lieuNaissance: "Mokolo",
      profession: "Commerciale",
      domicile: "Mairi, Maroua",
      pere: "HAMIDOU Boubakari",
      mere: "TCHANA Rhoda",
    },
    regimeMatrimonial: "MONOGAMIE_BIENS_COMMUNS",
    coutumeMatrimoniale: "Coutume Peulh",
    dateDebutAffichage: "2026-09-02",
    dateFinAffichage: "2026-10-02T18:00:00Z",
    datePrevueCelebration: "2026-10-04",
    lieuPrevuCelebration: "Salle de Cérémonie de Maroua",
    statutBan: "EN_COURS_AFFICHAGE",
    hashCertifieSha256:
      "3bb9ae6540f16456dfd3f8c598f6564f0d3ed5f71647ec4f11abde6d44b6f7f4",
  },
  {
    id: "b8-2026-nw-bam-0132",
    referenceLegaleBan: "BAN-2026-NW-BA1-0132",
    centreEtatCivil: "Hôtel de Ville de Bamenda I",
    regionNom: "Nord-Ouest",
    regionId: "NW",
    communeNom: "Bamenda Iᵉʳ",
    communeId: "NW-BA1",
    epoux: {
      nom: "NGUM",
      prenom: "Nicolas Akom",
      photoUrl: "/images/bans/epoux_ngum.jpg",
      dateNaissance: "1991-10-22",
      lieuNaissance: "Bamenda",
      profession: "Cadre de Banque",
      domicile: "Nkwen, Bamenda",
      pere: "NGUM Philemon",
      mere: "MAMBE Dorcas",
    },
    epouse: {
      nom: "MBEH",
      prenom: "Lydia Njehi",
      photoUrl: "/images/bans/epouse_mbeh.jpg",
      dateNaissance: "1997-01-29",
      lieuNaissance: "Mamfe",
      profession: "Étudiante / Assistante",
      domicile: "Mile 3, Bamenda",
      pere: "MBEH Emmanuel",
      mere: "NGEH Margaret",
    },
    regimeMatrimonial: "MONOGAMIE_SEPARATION_BIENS",
    coutumeMatrimoniale: "Coutume Anglophone",
    dateDebutAffichage: "2026-09-11",
    dateFinAffichage: "2026-10-11T18:00:00Z",
    datePrevueCelebration: "2026-10-13",
    lieuPrevuCelebration: "Salle Civic Centre de Bamenda",
    statutBan: "EN_COURS_AFFICHAGE",
    hashCertifieSha256:
      "4c7a7c0f8f0d1a7db7d719d819de6b35275031af7d11388f86e6d16d7e0bf0d3",
  },
  {
    id: "b9-2026-no-ga2-0064",
    referenceLegaleBan: "BAN-2026-NO-GA2-0064",
    centreEtatCivil: "Mairie de Garoua IIᵉ",
    regionNom: "Nord",
    regionId: "NO",
    communeNom: "Garoua IIᵉ",
    communeId: "NO-GA2",
    epoux: {
      nom: "DIOP",
      prenom: "Amadou Saliou",
      photoUrl: "/images/bans/epoux_diop.jpg",
      dateNaissance: "1987-06-28",
      lieuNaissance: "Yola",
      profession: "Inspecteur des Douanes",
      domicile: "Mile 5, Garoua",
      pere: "DIOP Modou",
      mere: "BAYI Salamatou",
    },
    epouse: {
      nom: "MAHAMAT",
      prenom: "Aissata Hawa",
      photoUrl: "/images/bans/epouse_mahamat.jpg",
      dateNaissance: "1995-08-04",
      lieuNaissance: "Moundou",
      profession: "Responsable Qualité",
      domicile: "Pitoa, Garoua",
      pere: "MAHAMAT Ousman",
      mere: "KOLI Mariam",
    },
    regimeMatrimonial: "MONOGAMIE_BIENS_COMMUNS",
    coutumeMatrimoniale: "Coutume Haoussa",
    dateDebutAffichage: "2026-09-04",
    dateFinAffichage: "2026-10-04T18:00:00Z",
    datePrevueCelebration: "2026-10-06",
    lieuPrevuCelebration: "Salle polyvalente de Garoua II",
    statutBan: "EN_COURS_AFFICHAGE",
    hashCertifieSha256:
      "9df0f2980ea1d3d52aacd8b4827db60a3a2f7c8ec0d5b5f0f3a18a39b1e1f6bb",
  },
  {
    id: "b10-2026-ad-ng2-0049",
    referenceLegaleBan: "BAN-2026-AD-NG2-0049",
    centreEtatCivil: "Centre d’État Civil de Ngaoundéré II",
    regionNom: "Adamaoua",
    regionId: "AD",
    communeNom: "Ngaoundéré II",
    communeId: "AD-NG2",
    epoux: {
      nom: "TCHOUAFFE",
      prenom: "Philippe Alain",
      photoUrl: "/images/bans/epoux_tchouaffe.jpg",
      dateNaissance: "1990-04-07",
      lieuNaissance: "Meiganga",
      profession: "Agriculteur",
      domicile: "Belo, Ngaoundéré",
      pere: "TCHOUAFFE Samuel",
      mere: "NGAH Marcelle",
    },
    epouse: {
      nom: "NGA",
      prenom: "Hortense Monique",
      photoUrl: "/images/bans/epouse_nga.jpg",
      dateNaissance: "1993-06-13",
      lieuNaissance: "Beka",
      profession: "Éducatrice",
      domicile: "Mbe, Ngaoundéré",
      pere: "NGA Martin",
      mere: "BENE Beatrice",
    },
    regimeMatrimonial: "MONOGAMIE_BIENS_COMMUNS",
    coutumeMatrimoniale: "Coutume Mbororo",
    dateDebutAffichage: "2026-08-30",
    dateFinAffichage: "2026-09-29T18:00:00Z",
    datePrevueCelebration: "2026-10-01",
    lieuPrevuCelebration: "Parc des Expositions de Ngaoundéré",
    statutBan: "EN_COURS_AFFICHAGE",
    hashCertifieSha256:
      "4d1f7c5fe1bf88ec614d3d0d8c0d99e0df58f3c24df6c47e92d1eb0d1db5c8b5",
  },
  {
    id: "b11-2026-lt-bda-0158",
    referenceLegaleBan: "BAN-2026-LT-BDA-0158",
    centreEtatCivil: "Mairie de Bonabéri",
    regionNom: "Littoral",
    regionId: "LT",
    communeNom: "Bonabéri",
    communeId: "LT-BDA",
    epoux: {
      nom: "BAYI",
      prenom: "Junior Désiré",
      photoUrl: "/images/bans/epoux_bayi.jpg",
      dateNaissance: "1992-09-17",
      lieuNaissance: "Edea",
      profession: "Électricien",
      domicile: "Bonabéri, Douala",
      pere: "BAYI Clément",
      mere: "MOUNGOU Sarah",
    },
    epouse: {
      nom: "MENGUE",
      prenom: "Émilie Rosane",
      photoUrl: "/images/bans/epouse_mengue.jpg",
      dateNaissance: "1996-02-24",
      lieuNaissance: "Nkongsamba",
      profession: "Assistante Administrative",
      domicile: "Kotto, Douala",
      pere: "MENGUE Georges",
      mere: "KELI Cécile",
    },
    regimeMatrimonial: "MONOGAMIE_BIENS_COMMUNS",
    coutumeMatrimoniale: "Coutume Sawa",
    dateDebutAffichage: "2026-08-20",
    dateFinAffichage: "2026-09-20T18:00:00Z",
    datePrevueCelebration: "2026-09-22",
    lieuPrevuCelebration: "Salle de l’Hôtel de Ville de Bonabéri",
    statutBan: "CLOTURE_SANS_OPPOSITION",
    hashCertifieSha256:
      "e9545e0a13f1380d24d7b4ff27f86d3b0ec451e79d5d2d2d7ab5f8b9a49bd3dd",
  },
  {
    id: "b12-2026-su-kr2-0029",
    referenceLegaleBan: "BAN-2026-SU-KR2-0029",
    centreEtatCivil: "Centre d’État Civil de Kribi II",
    regionNom: "Sud",
    regionId: "SU",
    communeNom: "Kribi II",
    communeId: "SU-KR2",
    epoux: {
      nom: "MENGO",
      prenom: "Franck Rodrigue",
      photoUrl: "/images/bans/epoux_mengo.jpg",
      dateNaissance: "1985-05-11",
      lieuNaissance: "Akom II",
      profession: "Mécanicien",
      domicile: "Moyen, Kribi",
      pere: "MENGO Denis",
      mere: "EKA Jeanne",
    },
    epouse: {
      nom: "NDOUE",
      prenom: "Prisca Amandine",
      photoUrl: "/images/bans/epouse_ndoue.jpg",
      dateNaissance: "1990-08-14",
      lieuNaissance: "Ebolowa",
      profession: "Secrétaire Comptable",
      domicile: "Mikolo, Kribi",
      pere: "NDOUE Charles",
      mere: "BIKO Béatrice",
    },
    regimeMatrimonial: "MONOGAMIE_BIENS_COMMUNS",
    coutumeMatrimoniale: "Coutume Duala / Eton",
    dateDebutAffichage: "2026-08-28",
    dateFinAffichage: "2026-09-28T18:00:00Z",
    datePrevueCelebration: "2026-09-30",
    lieuPrevuCelebration: "Salle polyvalente de Kribi II",
    statutBan: "EN_COURS_AFFICHAGE",
    hashCertifieSha256:
      "7a7d6b4cd6b38889ba8d3d799b7b6ec6f4e09774d07d147c99772f04ef82a2d6",
  },
  {
    id: "b13-2026-ce-ya2-0226",
    referenceLegaleBan: "BAN-2026-CE-YA2-0226",
    centreEtatCivil: "Mairie de Yaoundé IIᵉ (Tsinga)",
    regionNom: "Centre",
    regionId: "CE",
    communeNom: "Yaoundé IIᵉ",
    communeId: "CE-YA2",
    epoux: {
      nom: "NKOA",
      prenom: "David Michel",
      photoUrl: "/images/bans/epoux_nkoa.jpg",
      dateNaissance: "1991-04-30",
      lieuNaissance: "Obala",
      profession: "Consultant Informatique",
      domicile: "Mendong, Yaoundé",
      pere: "NKOA Bernard",
      mere: "TETA Catherine",
    },
    epouse: {
      nom: "MONGWA",
      prenom: "Florence Béatrice",
      photoUrl: "/images/bans/epouse_mongwa.jpg",
      dateNaissance: "1994-03-09",
      lieuNaissance: "Mbouda",
      profession: "Chargée de Mission",
      domicile: "Mvolye, Yaoundé",
      pere: "MONGWA Paul",
      mere: "FOGUE Annick",
    },
    regimeMatrimonial: "MONOGAMIE_BIENS_COMMUNS",
    coutumeMatrimoniale: "Coutume Bassa",
    dateDebutAffichage: "2026-09-06",
    dateFinAffichage: "2026-10-06T18:00:00Z",
    datePrevueCelebration: "2026-10-08",
    lieuPrevuCelebration: "Mairie de Yaoundé II – Salle des Fêtes",
    statutBan: "EN_COURS_AFFICHAGE",
    hashCertifieSha256:
      "19a5f5d482c1d3d9f14cecd49b64ae9a5ccfe086ef77e7c89d0dd8d8558ef950",
  },
  {
    id: "b14-2026-sw-bue-0185",
    referenceLegaleBan: "BAN-2026-SW-BUE-0185",
    centreEtatCivil: "Mairie de Buea",
    regionNom: "Sud-Ouest",
    regionId: "SW",
    communeNom: "Buea",
    communeId: "SW-BUE",
    epoux: {
      nom: "EPEE",
      prenom: "Nana Thierry",
      photoUrl: "/images/bans/epoux_epee.jpg",
      dateNaissance: "1990-02-27",
      lieuNaissance: "Tiko",
      profession: "Entrepreneur",
      domicile: "Molyko, Buea",
      pere: "EPEE Samuel",
      mere: "NDI Rose",
    },
    epouse: {
      nom: "NKWELLA",
      prenom: "Brigitte Awa",
      photoUrl: "/images/bans/epouse_nkwella.jpg",
      dateNaissance: "1996-11-10",
      lieuNaissance: "Muyuka",
      profession: "Designer",
      domicile: "Buea Town, Buea",
      pere: "NKWELLA Emmanuel",
      mere: "MOKEM Amina",
    },
    regimeMatrimonial: "MONOGAMIE_SEPARATION_BIENS",
    coutumeMatrimoniale: "Coutume Mungo",
    dateDebutAffichage: "2026-08-29",
    dateFinAffichage: "2026-09-29T18:00:00Z",
    datePrevueCelebration: "2026-10-02",
    lieuPrevuCelebration: "Hôtel de Ville de Buea",
    statutBan: "EN_COURS_AFFICHAGE",
    hashCertifieSha256:
      "abf3e8ad56e71948d1f6b9c012d2eb1a4397d03d280b795cd497be4d3fb86c97",
  },
  {
    id: "b15-2026-ou-ndok-0078",
    referenceLegaleBan: "BAN-2026-OU-NDK-0078",
    centreEtatCivil: "Mairie de Nde",
    regionNom: "Ouest",
    regionId: "OU",
    communeNom: "Nde",
    communeId: "OU-NDK",
    epoux: {
      nom: "BIYI",
      prenom: "Paul Eric",
      photoUrl: "/images/bans/epoux_biyi.jpg",
      dateNaissance: "1988-07-18",
      lieuNaissance: "Bafang",
      profession: "Gestionnaire de Stock",
      domicile: "Nde Centre, Ouest",
      pere: "BIYI Théodore",
      mere: "FONKAM Jeanne",
    },
    epouse: {
      nom: "DONGMO",
      prenom: "Christelle Nadine",
      photoUrl: "/images/bans/epouse_dongmo.jpg",
      dateNaissance: "1993-10-06",
      lieuNaissance: "Bangangté",
      profession: "Comptable",
      domicile: "Mifi, Ouest",
      pere: "DONGMO Léon",
      mere: "PENKA Véronique",
    },
    regimeMatrimonial: "MONOGAMIE_BIENS_COMMUNS",
    coutumeMatrimoniale: "Coutume Bamiléké",
    dateDebutAffichage: "2026-09-12",
    dateFinAffichage: "2026-10-12T18:00:00Z",
    datePrevueCelebration: "2026-10-15",
    lieuPrevuCelebration: "Salle polyvalente de Nde",
    statutBan: "EN_COURS_AFFICHAGE",
    hashCertifieSha256:
      "af9bfaa376c2b7534f71af9be9f5d7a90d4fc0a0f67d3d0ecb3217e5355f6ab7",
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

function sanitizeFollowUpAuthInput(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }

  const normalized = raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/[<>"'`]/g, "")
    .trim();

  if (!normalized) {
    return "";
  }

  const isPureLetters =
    /^[A-ZÀ-ÖØ-Þa-zà-öø-ÿ]+(?:\s+[A-ZÀ-ÖØ-Þa-zà-öø-ÿ]+)*$/.test(normalized);

  if (isPureLetters) {
    return normalized.toUpperCase();
  }

  return normalized.toUpperCase();
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

  const sanitizedQuery = sanitizeFollowUpAuthInput(queryValue);
  const qLow = sanitizedQuery.toLowerCase();
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



module.exports = { territorialData, bansDatabase, otpVerificationStore, dossiersHistoriqueDatabase, normalizeEmail, getDossierNotificationEmail, dossierMatchesQuery };