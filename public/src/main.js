
      let referentielTerritorial = [];
      let bansList = [];
      let activeBanIdForOpp = null;
      let dossierTermine = false;
      let notificationRetraitRecue = false;
      let simulatedColorCode = "green";
      let sessionAdminActive =
        sessionStorage.getItem("admin_auth_bunec") === "true";
      let adminCsrfToken = sessionStorage.getItem("bunec_csrf_token") || "";
      let dossiersHistoriqueAdmin = [];

      let filtreTypeActeActif = "TOUS";
      let dossierActuellementCorrespondant = null;
      let signalementsBat = JSON.parse(
        localStorage.getItem("bunec_signalements_bat") || "[]",
      );

      // BASE NATIONALE DES DOSSIERS DE RÉFÉRENCE (BUNEC)
      const baseDossiersNationale = [
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
            canalDepot: "Guichet d’État Civil de Bokito",
            adresseIp: "197.234.18.72",
            operateur: "Orange Cameroun Fibre / 4G+",
            terminal: "Poste Guichet #01 Mairie de Bokito",
          },
          dateEnregistrement: "2019-07-11T08:30:00Z",
          statut: "PRETE_RETRAIT",
          libelleStatut:
            "Disponible au guichet — Prêt pour délivrance (BAT Émis)",
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
            titrePrincipal:
              "EXTRAIT D'ACTE DE NAISSANCE / BIRTH CERTIFICATE EXTRACT",
            sousTitreLoi:
              "Délivré en application de l'Article 18 de la Loi N° 2011/011 du 6 mai 2011 modifiant et complétant certaines dispositions de l'Ordonnance n° 81-02 portant organisation de l'état civil.",
            enfant: {
              nomComplet: "NDIEMI À GOUFANI Jean Placide Ariel",
              dateNaissanceTexte:
                "Le vingt quatre mai Deux mille neuf (24/05/2009)",
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
              tamponTexte:
                "COMMUNE DE BOKITO • CENTRE D'ÉTAT CIVIL DE BOKITO-VILLE",
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
            centreEtatCivil:
              "Centre Principal d’État Civil (Mairie de Yaoundé 1er)",
          },
          statut: "PRETE_RETRAIT",
          libelleStatut:
            "Disponible au guichet — Prêt pour délivrance (BAT Émis)",
          etapeCourante: 4,
          notificationRetraitEnvoyee: true,
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
          },
          statut: "PRETE_RETRAIT",
          libelleStatut:
            "Disponible au guichet — Prêt pour délivrance (BAT Émis)",
          etapeCourante: 4,
          notificationRetraitEnvoyee: true,
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
          },
          statut: "PRETE_RETRAIT",
          libelleStatut:
            "Disponible au guichet — Prêt pour délivrance (BAT Émis)",
          etapeCourante: 4,
          notificationRetraitEnvoyee: true,
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
          },
          statut: "PRETE_RETRAIT",
          libelleStatut:
            "Disponible au guichet — Prêt pour délivrance (BAT Émis)",
          etapeCourante: 4,
          notificationRetraitEnvoyee: true,
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
          },
          statut: "INSTRUCTION",
          libelleStatut:
            "En cours d’instruction administrative (BAT Verrouillé)",
          etapeCourante: 2,
          notificationRetraitEnvoyee: false,
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
          },
          statut: "INSTRUCTION",
          libelleStatut:
            "En cours d’instruction (Publication des bans en cours)",
          etapeCourante: 3,
          notificationRetraitEnvoyee: false,
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
          },
          statut: "PRETE_RETRAIT",
          libelleStatut:
            "Disponible au guichet — Prêt pour délivrance (BAT Émis)",
          etapeCourante: 4,
          notificationRetraitEnvoyee: true,
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
          },
          statut: "REJETEE",
          libelleStatut:
            "Pièce Rejetée — Discordance Documentaire (BAT Bloqué)",
          etapeCourante: 2,
          notificationRetraitEnvoyee: false,
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
          },
          statut: "PRETE_RETRAIT",
          libelleStatut:
            "Disponible au guichet — Prêt pour délivrance (BAT Émis)",
          etapeCourante: 4,
          notificationRetraitEnvoyee: true,
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
            communeNom: "Limbé Iᵉʳ",
            communeId: "SW-LI1",
            centreEtatCivil: "Centre Principal d’État Civil de Limbé I",
          },
          statut: "PRETE_RETRAIT",
          libelleStatut:
            "Disponible au guichet — Prêt pour délivrance (BAT Émis)",
          etapeCourante: 4,
          notificationRetraitEnvoyee: true,
        },
      ];

      dossiersHistoriqueAdmin = baseDossiersNationale;

      let messagerieDetectee = {
        whatsapp: true,
        telegram: true,
        operateur: "Orange CMR",
        telephone: "699 12 34 56",
      };

      // GESTION DU FILTRE PAR TYPE D'ACTE & AFFICHAGE DYNAMIQUE
      function appliquerFiltreTypeActe(type) {
        filtreTypeActeActif = type;

        const types = [
          "TOUS",
          "ACTE_NAISSANCE",
          "ACTE_MARIAGE",
          "ACTE_DECES",
          "DECLARATION_TARDIVE_JUGEMENT_SUPPLETIF",
        ];
        types.forEach((t) => {
          const btn = document.getElementById(`btn-filtre-${t}`);
          if (!btn) return;
          if (t === type) {
            btn.className =
              "btn-filtre-acte px-2.5 py-2 rounded-xl text-xs font-black transition border bg-slate-900 text-white border-slate-900 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95";
          } else {
            btn.className =
              "btn-filtre-acte px-2.5 py-2 rounded-xl text-xs font-bold transition border bg-white hover:bg-slate-50 text-slate-700 border-slate-300 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95";
          }
        });

        const labelCompteur = document.getElementById("label-compteur-filtre");
        const listeFiltree =
          type === "TOUS"
            ? baseDossiersNationale
            : baseDossiersNationale.filter((d) => d.typeActe === type);

        if (labelCompteur) {
          if (type === "TOUS") {
            labelCompteur.textContent = `${baseDossiersNationale.length} dossiers disponibles`;
          } else {
            const nomCourt =
              type === "ACTE_NAISSANCE"
                ? "Naissances"
                : type === "ACTE_MARIAGE"
                  ? "Mariages"
                  : type === "ACTE_DECES"
                    ? "Décès"
                    : "Jugements";
            labelCompteur.textContent = `${listeFiltree.length} ${nomCourt} répertoriés`;
          }
        }

        afficherSuggestionsDeclarations("");
      }

      function actualiserBoutonsSelectionTypeActe(typeCode) {
        const types = [
          {
            id: "btn-select-acte-nais",
            code: "ACTE_NAISSANCE",
            activeClass:
              "bg-emerald-600 text-white border-emerald-700 shadow-md",
          },
          {
            id: "btn-select-acte-mar",
            code: "ACTE_MARIAGE",
            activeClass: "bg-blue-600 text-white border-blue-700 shadow-md",
          },
          {
            id: "btn-select-acte-dec",
            code: "ACTE_DECES",
            activeClass: "bg-rose-600 text-white border-rose-700 shadow-md",
          },
          {
            id: "btn-select-acte-jug",
            code: "DECLARATION_TARDIVE_JUGEMENT_SUPPLETIF",
            activeClass: "bg-amber-600 text-white border-amber-700 shadow-md",
          },
        ];

        types.forEach((t) => {
          const btn = document.getElementById(t.id);
          if (!btn) return;
          if (t.code === typeCode) {
            btn.className = `btn-type-acte-item py-2.5 px-3 rounded-xl border-2 text-center text-xs font-black transition flex flex-col items-center justify-center gap-0.5 cursor-pointer ${t.activeClass}`;
            const sub = btn.querySelector(".lbl-registre-btn");
            if (sub)
              sub.className =
                "lbl-registre-btn text-[9px] uppercase tracking-wider text-white/80 font-black";
          } else {
            btn.className =
              "btn-type-acte-item py-2.5 px-3 rounded-xl border-2 text-center text-xs font-black transition flex flex-col items-center justify-center gap-0.5 cursor-pointer bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-50 shadow-2xs";
            const sub = btn.querySelector(".lbl-registre-btn");
            if (sub)
              sub.className =
                "lbl-registre-btn text-[9px] uppercase tracking-wider text-slate-400 font-bold";
          }
        });
      }

      function changerSelectionTypeActe(typeCode) {
        const selectActe = document.getElementById("select-type-acte");
        if (selectActe) selectActe.value = typeCode;

        actualiserBoutonsSelectionTypeActe(typeCode);

        const inputDec = document.getElementById("input-num-declaration");
        const val = inputDec ? inputDec.value.trim() : "";

        choisirFormatActeCivil(typeCode);
      }

      function correspondanceRechercheAvancee(dossier, critere) {
        const recherche = normaliserTexteRecherche(critere);
        if (!recherche || recherche.length < 2) return false;

        const blob = JSON.stringify(dossier)
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();

        if (blob.includes(recherche)) return true;

        const pereNom = normaliserTexteRecherche(
          dossier?.donneesActeCivil?.pere?.nomComplet,
        );
        const mereNom = normaliserTexteRecherche(
          dossier?.donneesActeCivil?.mere?.nomComplet,
        );
        const enfantNom = normaliserTexteRecherche(
          dossier?.donneesActeCivil?.enfant?.nomComplet,
        );
        const titulaireNom = normaliserTexteRecherche(dossier?.titulaire);
        const demandeurNom = normaliserTexteRecherche(
          dossier?.demandeur?.nomComplet,
        );

        return (
          pereNom.includes(recherche) ||
          mereNom.includes(recherche) ||
          enfantNom.includes(recherche) ||
          titulaireNom.includes(recherche) ||
          demandeurNom.includes(recherche)
        );
      }

      function mettreAJourTypeActeCorrespondant(
        val,
        typeFiltreForce,
        critereSupplementaire = "",
      ) {
        const v = (val || "").trim();
        const digits = v.replace(/\D/g, "");
        const critereAvance = critereSupplementaire || "";

        // Type sélectionné ou forcé
        const selectActeEl = document.getElementById("select-type-acte");
        const typeChoisi =
          typeFiltreForce ||
          (selectActeEl ? selectActeEl.value : "ACTE_NAISSANCE");

        let matched = baseDossiersNationale.find((d) => {
          if (d.typeActe !== typeChoisi) return false;
          const dTelDigits = d.demandeur.telephone.replace(/\D/g, "");
          const dNumDigits = d.numeroDeclaration.replace(/\D/g, "");
          const dNum = d.numeroDeclaration.toLowerCase();
          const dIdent = d.identifiantBUNEC.toLowerCase();
          const vLow = v.toLowerCase();

          const titulaireLow = (d.titulaire || "").toLowerCase();
          const enfantNomLow = (
            (d.donneesActeCivil &&
              d.donneesActeCivil.enfant &&
              d.donneesActeCivil.enfant.nomComplet) ||
            ""
          ).toLowerCase();
          const mereNomLow = (
            (d.donneesActeCivil &&
              d.donneesActeCivil.mere &&
              d.donneesActeCivil.mere.nomComplet) ||
            ""
          ).toLowerCase();
          const pereNomLow = (
            (d.donneesActeCivil &&
              d.donneesActeCivil.pere &&
              d.donneesActeCivil.pere.nomComplet) ||
            ""
          ).toLowerCase();
          const demandeurNomLow = (
            (d.demandeur && d.demandeur.nomComplet) ||
            ""
          ).toLowerCase();

          const matchName =
            vLow.length >= 3 &&
            (titulaireLow.includes(vLow) ||
              vLow.includes(titulaireLow) ||
              enfantNomLow.includes(vLow) ||
              mereNomLow.includes(vLow) ||
              pereNomLow.includes(vLow) ||
              demandeurNomLow.includes(vLow));

          const matchCritereSup = correspondanceRechercheAvancee(
            d,
            critereAvance,
          );

          const matchCritere =
            dNum === vLow ||
            dIdent === vLow ||
            (digits.length >= 8 && dTelDigits.endsWith(digits.slice(-8))) ||
            (digits.length >= 8 && digits.endsWith(dTelDigits.slice(-8))) ||
            (digits.length >= 8 && dNumDigits.endsWith(digits.slice(-8))) ||
            matchName ||
            matchCritereSup ||
            d.id === v;

          if (typeFiltreForce && typeFiltreForce !== "TOUS") {
            return matchCritere && d.typeActe === typeFiltreForce;
          }
          return matchCritere;
        });

        if (!matched && (v || digits)) {
          matched = baseDossiersNationale.find((d) => {
            if (d.typeActe !== typeChoisi) return false;
            const dTelDigits = d.demandeur.telephone.replace(/\D/g, "");
            const dNumDigits = d.numeroDeclaration.replace(/\D/g, "");
            const dNum = d.numeroDeclaration.toLowerCase();
            const dIdent = d.identifiantBUNEC.toLowerCase();
            const vLow = v.toLowerCase();

            const titulaireLow = (d.titulaire || "").toLowerCase();
            const enfantNomLow = (
              (d.donneesActeCivil &&
                d.donneesActeCivil.enfant &&
                d.donneesActeCivil.enfant.nomComplet) ||
              ""
            ).toLowerCase();
            const mereNomLow = (
              (d.donneesActeCivil &&
                d.donneesActeCivil.mere &&
                d.donneesActeCivil.mere.nomComplet) ||
              ""
            ).toLowerCase();
            const pereNomLow = (
              (d.donneesActeCivil &&
                d.donneesActeCivil.pere &&
                d.donneesActeCivil.pere.nomComplet) ||
              ""
            ).toLowerCase();
            const demandeurNomLow = (
              (d.demandeur && d.demandeur.nomComplet) ||
              ""
            ).toLowerCase();

            const matchName =
              vLow.length >= 3 &&
              (titulaireLow.includes(vLow) ||
                vLow.includes(titulaireLow) ||
                enfantNomLow.includes(vLow) ||
                mereNomLow.includes(vLow) ||
                pereNomLow.includes(vLow) ||
                demandeurNomLow.includes(vLow));

            const matchCritereSup = correspondanceRechercheAvancee(
              d,
              critereAvance,
            );

            return (
              dNum === vLow ||
              dIdent === vLow ||
              (digits.length >= 8 && dTelDigits.endsWith(digits.slice(-8))) ||
              (digits.length >= 8 && digits.endsWith(dTelDigits.slice(-8))) ||
              (digits.length >= 8 && dNumDigits.endsWith(digits.slice(-8))) ||
              matchName ||
              matchCritereSup ||
              d.id === v
            );
          });
        }

        let typeCode = typeChoisi || "ACTE_NAISSANCE";
        let titreActe = "ACTE DE NAISSANCE";
        let sigle = "NAIS";
        let themeColor = "emerald";
        let registre = "Registre National A (Naissances)";
        let titulaire = "TCHOUA MBALLA Christian Lionel";
        let numDecAffiche = v || "DEC-2026-CE-YA1-001249";
        let exactConcordance = false;

        if (matched) {
          dossierActuellementCorrespondant = matched;
          typeCode = matched.typeActe;
          titreActe = matched.titreActe.toUpperCase();
          titulaire = matched.titulaire;
          numDecAffiche = matched.numeroDeclaration;
          exactConcordance = true;

          if (selectActeEl && selectActeEl.value !== matched.typeActe) {
            selectActeEl.value = matched.typeActe;
          }
          actualiserBoutonsSelectionTypeActe(matched.typeActe);

          // Auto-ralliement automatique du CEC et de la Région
          if (matched.provenance && matched.provenance.communeNom) {
            if (!listeCompleteCECs || listeCompleteCECs.length === 0) {
              construireListeCompleteCECs();
            }
            const matchCEC = (listeCompleteCECs || []).find(
              (c) =>
                c.communeNom.toLowerCase() ===
                  matched.provenance.communeNom.toLowerCase() ||
                c.communeId === matched.provenance.communeId,
            );
            if (matchCEC) {
              selectionnerCEC(matchCEC.id);
              if (matched.provenance.centreEtatCivil) {
                const labelCommune = document.getElementById(
                  "label-detail-commune-affichee",
                );
                if (labelCommune)
                  labelCommune.textContent = `Centre rattaché : ${matched.provenance.centreEtatCivil}`;
              }
            }
          }

          // Détection automatique opérateur et messageries pour ce dossier
          if (matched.demandeur && matched.demandeur.telephone) {
            const inputTelSuivi = document.getElementById(
              "input-telephone-suivi",
            );
            if (
              inputTelSuivi &&
              (!inputTelSuivi.value ||
                isNaN(v.replace(/\D/g, "")) ||
                v.length < 8)
            ) {
              inputTelSuivi.value = matched.demandeur.telephone;
            }
            detecterMessagerieInstantanee(matched.demandeur.telephone);
          }
        } else {
          dossierActuellementCorrespondant = null;
          if (typeFiltreForce && typeFiltreForce !== "TOUS") {
            typeCode = typeFiltreForce;
          } else if (typeChoisi) {
            typeCode = typeChoisi;
          } else {
            const u = v.toUpperCase();
            if (
              u.includes("MAR") ||
              u.includes("BAN") ||
              u.includes("MARIAGE") ||
              u.includes("EPOUX")
            ) {
              typeCode = "ACTE_MARIAGE";
            } else if (
              u.includes("DECES") ||
              u.includes("MORT") ||
              (u.includes("DEC") && u.includes("AD"))
            ) {
              typeCode = "ACTE_DECES";
            } else if (
              u.includes("JUG") ||
              u.includes("TARD") ||
              u.includes("SUPP") ||
              u.includes("TPI")
            ) {
              typeCode = "DECLARATION_TARDIVE_JUGEMENT_SUPPLETIF";
            } else {
              typeCode = "ACTE_NAISSANCE";
            }
          }

          if (selectActeEl && selectActeEl.value !== typeCode) {
            selectActeEl.value = typeCode;
          }
          actualiserBoutonsSelectionTypeActe(typeCode);

          if (typeCode === "ACTE_MARIAGE") {
            titreActe = "ACTE DE MARIAGE";
            titulaire = "Déclaration matrimoniale conjointe des époux";
          } else if (typeCode === "ACTE_DECES") {
            titreActe = "ACTE DE DÉCÈS";
            titulaire = "Déclaration de décès et ayants droit légitimes";
          } else if (typeCode === "DECLARATION_TARDIVE_JUGEMENT_SUPPLETIF") {
            titreActe = "DÉCLARATION TARDIVE / JUGEMENT SUPPLÉTIF";
            titulaire = "Requérant légitime en reconstitution d’état civil";
          } else {
            titreActe = "ACTE DE NAISSANCE";
            titulaire = "Nouveau-né / Enfant déclaré";
          }
        }

        if (typeCode === "ACTE_MARIAGE") {
          sigle = "MAR";
          themeColor = "blue";
          registre = "Registre National B (Célébrations Matrimoniales)";
        } else if (typeCode === "ACTE_DECES") {
          sigle = "DEC";
          themeColor = "rose";
          registre = "Registre National C (Constatations de Décès)";
        } else if (typeCode === "DECLARATION_TARDIVE_JUGEMENT_SUPPLETIF") {
          sigle = "JUG";
          themeColor = "amber";
          registre = "Registre National D (Ordonnances Judiciaires TPI)";
        } else {
          sigle = "NAIS";
          themeColor = "emerald";
          registre = "Registre National A (Naissances)";
        }

        const carte = document.getElementById("carte-type-acte-correspondant");
        const badgeSigle = document.getElementById("badge-sigle-type-acte");
        const badgeTitre = document.getElementById("badge-titre-type-acte");
        const titreEl = document.getElementById(
          "titre-type-acte-correspondant",
        );
        const regEl = document.getElementById(
          "registre-type-acte-correspondant",
        );
        const labelNum = document.getElementById(
          "label-num-declaration-detecte",
        );
        const labelTit = document.getElementById("label-titulaire-detecte");
        const badgeStatut = document.getElementById("badge-statut-concordance");

        if (carte) {
          if (themeColor === "blue") {
            carte.className =
              "p-3.5 sm:p-4 rounded-2xl border-2 transition-all shadow-xs bg-blue-50/90 border-blue-400 text-blue-950";
          } else if (themeColor === "rose") {
            carte.className =
              "p-3.5 sm:p-4 rounded-2xl border-2 transition-all shadow-xs bg-rose-50/90 border-rose-400 text-rose-950";
          } else if (themeColor === "amber") {
            carte.className =
              "p-3.5 sm:p-4 rounded-2xl border-2 transition-all shadow-xs bg-amber-50/90 border-amber-400 text-amber-950";
          } else {
            carte.className =
              "p-3.5 sm:p-4 rounded-2xl border-2 transition-all shadow-xs bg-emerald-50/90 border-emerald-400 text-emerald-950";
          }
        }

        if (badgeSigle) badgeSigle.textContent = sigle;
        if (badgeTitre) {
          badgeTitre.textContent = exactConcordance
            ? "TYPE D'ACTE DÉTECTÉ"
            : "TYPE D'ACTE SÉLECTIONNÉ";
        }
        if (titreEl) titreEl.textContent = titreActe;
        if (regEl) regEl.textContent = registre;
        if (labelNum) labelNum.textContent = numDecAffiche;
        if (labelTit) labelTit.textContent = titulaire;

        if (badgeStatut) {
          if (exactConcordance) {
            badgeStatut.textContent = "✓ Concordance Certifiée";
            badgeStatut.className =
              "text-[10px] font-black text-emerald-900 bg-white border border-emerald-300 px-2.5 py-1 rounded-lg shadow-2xs";
          } else {
            badgeStatut.textContent = "✓ Type Sélectionné";
            badgeStatut.className =
              "text-[10px] font-black text-slate-800 bg-white border border-slate-300 px-2.5 py-1 rounded-lg shadow-2xs";
          }
        }
      }

      // Protection de la vie privée : aucun historique de demandes précédentes à la saisie
      function afficherSuggestionsDeclarations(_val) {
        // Désactivé : la recherche est privée et directe, aucun dossier tiers n'est affiché
        const dropdown = document.getElementById(
          "dropdown-suggestions-declarations",
        );
        if (dropdown) dropdown.classList.add("hidden");
      }

      function selectionnerDeclaration(numero, _afficherToast = false) {
        const d = baseDossiersNationale.find(
          (item) => item.numeroDeclaration === numero,
        );
        if (!d) return;

        const inputNum = document.getElementById("input-num-declaration");
        const inputTel = document.getElementById("input-telephone-suivi");

        if (inputNum) inputNum.value = d.numeroDeclaration;
        if (inputTel) {
          inputTel.value = d.demandeur.telephone;
          detecterMessagerieInstantanee(d.demandeur.telephone);
        }

        if (d.provenance && d.provenance.communeId) {
          const inputCEC = document.getElementById("input-recherche-cec");
          const selectCEC = document.getElementById("select-cec");
          const labelRegion = document.getElementById("label-region-affichee");
          const labelCommune = document.getElementById(
            "label-detail-commune-affichee",
          );
          const badgeCode = document.getElementById(
            "badge-code-region-affiche",
          );

          if (inputCEC)
            inputCEC.value =
              d.provenance.centreEtatCivil ||
              `Mairie de ${d.provenance.communeNom}`;
          if (selectCEC)
            selectCEC.value = `${d.provenance.regionId}|${d.provenance.communeId}|${d.provenance.communeNom}`;
          if (labelRegion)
            labelRegion.textContent = `Région ${d.provenance.regionNom} (Chef-lieu de rattachement)`;
          if (labelCommune)
            labelCommune.textContent = `Centre rattaché : ${d.provenance.centreEtatCivil || d.provenance.communeNom}`;
          if (badgeCode) badgeCode.textContent = d.provenance.regionId;
        }

        gererSaisieIdentifiantOuTel(d.numeroDeclaration);
        mettreAJourTypeActeCorrespondant(d.numeroDeclaration);
      }

      function effacerInputDeclaration() {
        const input = document.getElementById("input-num-declaration");
        if (input) {
          input.value = "";
          input.focus();
        }
        gererSaisieIdentifiantOuTel("");
      }

      // INITIALISATION SANS AFFICHER DE STATUT AU DÉPART
      window.addEventListener("DOMContentLoaded", async () => {
        reinitialiserRecherche();
        await chargerReferentiel();
        await chargerBans();
        setInterval(actualiserComptesARebours, 1000);

        const inputTelephone = document.getElementById("input-telephone-suivi");
        const inputDeclaration = document.getElementById("input-num-declaration");

        if (inputTelephone) {
          detecterMessagerieInstantanee(inputTelephone.value);
        }

        choisirFormatActeCivil("ACTE_NAISSANCE");
        actualiserAffichageBAT();

        // Fermeture des suggestions au clic extérieur
        document.addEventListener("click", (e) => {
          const dropDec = document.getElementById(
            "dropdown-suggestions-declarations",
          );
          const inputDec = document.getElementById("input-num-declaration");
          if (
            dropDec &&
            inputDec &&
            !inputDec.contains(e.target) &&
            !dropDec.contains(e.target)
          ) {
            dropDec.classList.add("hidden");
          }
        });
      });

      function switchTab(tabId) {
        document
          .getElementById("section-suivi")
          .classList.toggle("hidden", tabId !== "suivi");
        document
          .getElementById("section-bans")
          .classList.toggle("hidden", tabId !== "bans");
        document
          .getElementById("section-dr")
          .classList.toggle("hidden", tabId !== "dr");
        const secAdmin = document.getElementById("section-admin");
        if (secAdmin) secAdmin.classList.toggle("hidden", tabId !== "admin");

        document.getElementById("top-card-suivi").className =
          tabId === "suivi"
            ? "card-active p-4 sm:p-5 rounded-2xl border transition-all text-left flex items-center gap-3.5 cursor-pointer"
            : "bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 transition-all text-left flex items-center gap-3.5 hover:border-emerald-300 hover:shadow-md cursor-pointer";

        document.getElementById("top-card-bans").className =
          tabId === "bans"
            ? "card-active p-4 sm:p-5 rounded-2xl border transition-all text-left flex items-center gap-3.5 cursor-pointer"
            : "bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 transition-all text-left flex items-center gap-3.5 hover:border-blue-300 hover:shadow-md cursor-pointer";

        document.getElementById("top-card-dr").className =
          tabId === "dr"
            ? "card-active p-4 sm:p-5 rounded-2xl border transition-all text-left flex items-center gap-3.5 cursor-pointer"
            : "bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 transition-all text-left flex items-center gap-3.5 hover:border-purple-300 hover:shadow-md cursor-pointer";

        if (tabId === "dr") {
          actualiserAffichageBAT();
        } else if (tabId === "admin") {
          chargerHistoriqueAdmin();
        }

        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      let listeCompleteCECs = [];
      let pieceJointeActuelle = null;

      function construireListeCompleteCECs() {
        listeCompleteCECs = [];
        if (!referentielTerritorial || referentielTerritorial.length === 0)
          return;

        referentielTerritorial.forEach((region) => {
          (region.communes || []).forEach((com) => {
            listeCompleteCECs.push({
              id: `${region.id}|${com.id}|${com.nom}`,
              nomCentre: `Mairie de ${com.nom} — Centre Principal d'État Civil`,
              communeNom: com.nom,
              communeId: com.id,
              regionId: region.id,
              regionNom: region.nom,
              chefLieu: region.chefLieu || region.nom,
              departement: com.departement || "",
              texteRecherche:
                `${com.nom} ${region.nom} ${com.departement || ""} ${com.id} ${region.id}`.toLowerCase(),
            });
          });
        });
      }

      async function chargerReferentiel() {
        try {
          const res = await fetch("/api/v1/referentiel/cameroun");
          referentielTerritorial = await res.json();
        } catch (err) {
          console.warn("Fallback local");
        }

        construireListeCompleteCECs();

        const filterRegion = document.getElementById("filter-region");
        if (filterRegion && referentielTerritorial) {
          filterRegion.innerHTML =
            '<option value="ALL">Toutes les régions (10)</option>';
          referentielTerritorial.forEach((region) => {
            const optFR = document.createElement("option");
            optFR.value = region.id;
            optFR.textContent = region.nom;
            filterRegion.appendChild(optFR);
          });
        }

        // Initialiser avec le centre par défaut (Yaoundé I ou premier disponible)
        const centreDefaut =
          listeCompleteCECs.find((c) => c.id.includes("YA1")) ||
          listeCompleteCECs[0];
        if (centreDefaut) {
          selectionnerCEC(centreDefaut.id);
        }
      }

      function filtrerSuggestionsCEC(val) {
        if (!listeCompleteCECs || listeCompleteCECs.length === 0) {
          construireListeCompleteCECs();
        }

        const dropdown = document.getElementById("dropdown-suggestions-cec");
        if (!dropdown) return;

        const q = (val || "").trim().toLowerCase();
        let resultats = [];

        if (q.length >= 1) {
          resultats = listeCompleteCECs.filter(
            (c) =>
              c.nomCentre.toLowerCase().includes(q) ||
              c.communeNom.toLowerCase().includes(q) ||
              c.regionNom.toLowerCase().includes(q) ||
              (c.departement && c.departement.toLowerCase().includes(q)) ||
              c.communeId.toLowerCase().includes(q),
          );
        } else {
          resultats = listeCompleteCECs.slice(0, 15);
        }

        if (resultats.length === 0) {
          dropdown.innerHTML = `
          <div class="p-4 text-center text-xs text-slate-500 font-bold">
            <span>Aucun centre d'état civil trouvé pour "<strong>${val}</strong>" parmi les 360 mairies.</span>
          </div>
        `;
          dropdown.classList.remove("hidden");
          return;
        }

        dropdown.innerHTML = resultats
          .slice(0, 20)
          .map(
            (c) => `
        <div
          onclick="selectionnerCEC('${c.id}')"
          class="p-3 hover:bg-emerald-50 active:bg-emerald-100 cursor-pointer border-b border-slate-100 flex items-center justify-between transition group"
        >
          <div>
            <div class="font-black text-slate-900 text-xs sm:text-sm group-hover:text-emerald-900">
              ${c.nomCentre}
            </div>
            <div class="text-[11px] text-emerald-800 font-bold mt-0.5 flex items-center gap-1.5 flex-wrap">
              <span>Région : <strong>${c.regionNom}</strong></span>
              ${c.departement ? `<span>• Dépt : <strong>${c.departement}</strong></span>` : ""}
              <span>• Réf. <strong class="font-mono text-[10px]">${c.communeId}</strong></span>
            </div>
          </div>
          <span class="text-[11px] font-black text-emerald-800 bg-emerald-100 group-hover:bg-emerald-200 px-2.5 py-1 rounded-lg">
            Choisir ➔
          </span>
        </div>
      `,
          )
          .join("");

        dropdown.classList.remove("hidden");
      }

      function selectionnerCEC(id) {
        if (!listeCompleteCECs || listeCompleteCECs.length === 0) {
          construireListeCompleteCECs();
        }

        const c = listeCompleteCECs.find((item) => item.id === id);
        if (!c) return;

        const inputRecherche = document.getElementById("input-recherche-cec");
        const selectCec = document.getElementById("select-cec");
        const dropdown = document.getElementById("dropdown-suggestions-cec");
        const labelRegion = document.getElementById("label-region-affichee");
        const labelCommune = document.getElementById(
          "label-detail-commune-affichee",
        );
        const badgeCode = document.getElementById("badge-code-region-affiche");

        if (inputRecherche) inputRecherche.value = c.nomCentre;
        if (selectCec) selectCec.value = c.id;
        if (dropdown) dropdown.classList.add("hidden");

        const prepRegion =
          c.regionNom.startsWith("A") ||
          c.regionNom.startsWith("E") ||
          c.regionNom.startsWith("O")
            ? "d'"
            : "du ";
        const depInfo = c.departement
          ? ` • Département du ${c.departement}`
          : "";
        if (labelRegion)
          labelRegion.textContent = `Région ${prepRegion}${c.regionNom}${depInfo} (Chef-lieu : ${c.chefLieu})`;
        if (labelCommune)
          labelCommune.textContent = `Centre rattaché : ${c.nomCentre}`;
        if (badgeCode) badgeCode.textContent = c.regionId;
      }

      function gererSaisieIdentifiantOuTel(val, critereSupplementaire = "") {
        const v = normaliserSaisieSuivi(val || "").trim();
        const badge = document.getElementById("badge-type-identifiant-saisi");
        const inputTelSuivi = document.getElementById("input-telephone-suivi");
        const digits = v.replace(/\D/g, "");
        const critere = critereSupplementaire || "";

        // Détection si c'est un numéro de téléphone
        const isTel =
          digits.length >= 8 &&
          (digits.startsWith("6") ||
            digits.startsWith("2") ||
            digits.startsWith("237"));

        if (isTel) {
          if (badge) {
            badge.textContent = "TÉLÉPHONE DÉTECTÉ";
            badge.className =
              "text-[10px] font-black text-orange-950 bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-300";
          }
          if (inputTelSuivi && inputTelSuivi.value !== v) {
            inputTelSuivi.value = v;
            detecterMessagerieInstantanee(v);
          }
        } else if (
          v.length >= 3 &&
          !v.includes("/") &&
          !v.includes("-") &&
          isNaN(v)
        ) {
          if (badge) {
            badge.textContent = "NOM ENFANT / MÈRE IDENTIFIÉ";
            badge.className =
              "text-[10px] font-black text-blue-950 bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-300";
          }
        } else {
          if (badge) {
            badge.textContent = "RÉCÉPISSÉ / DÉCLARATION";
            badge.className =
              "text-[10px] font-black text-emerald-950 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300";
          }
        }

      }

      // Gestion de la messagerie rapide et pièces jointes
      function preparerMessageRapide(type) {
        const textarea = document.getElementById("textarea-message-suivi");
        const inputNum = document.getElementById("input-num-declaration");
        const refDossier =
          (inputNum ? inputNum.value.trim() : "") || "DEC-2026-001249";

        if (!textarea) return;

        if (type === "suivi") {
          textarea.value = `Bonjour M. l'Officier d'État Civil. Je sollicite des informations sur l'état d'avancement de mon dossier BUNEC réf. ${refDossier}. Merci.`;
        } else if (type === "piece") {
          textarea.value = `Bonjour, je vous transmets une pièce justificative complémentaire pour compléter l'instruction de mon dossier réf. ${refDossier}.`;
        } else if (type === "retrait") {
          textarea.value = `Bonjour, mon acte civil est-il signé et prêt pour retrait au guichet municipal pour le dossier réf. ${refDossier} ?`;
        }
      }

      function surFichierJointSelectionne(input) {
        if (!input.files || input.files.length === 0) return;
        const file = input.files[0];
        pieceJointeActuelle = {
          name: file.name,
          size: file.size,
          type: file.type,
          date: new Date().toISOString(),
        };

        const container = document.getElementById(
          "apercu-piece-jointe-container",
        );
        const labelNom = document.getElementById("label-nom-fichier-joint");
        const labelTaille = document.getElementById(
          "label-taille-fichier-joint",
        );

        if (labelNom) labelNom.textContent = file.name;
        const sizeKo = (file.size / 1024).toFixed(1);
        const sizeStr =
          sizeKo > 1024 ? (sizeKo / 1024).toFixed(2) + " Mo" : sizeKo + " Ko";
        if (labelTaille)
          labelTaille.textContent = `${sizeStr} • Prêt pour transmission`;
        if (container) container.classList.remove("hidden");

        afficherNotificationToast(
          `✓ Pièce jointe "${file.name}" chargée avec succès.`,
        );
      }

      function supprimerFichierJoint() {
        pieceJointeActuelle = null;
        const input = document.getElementById("input-piece-jointe");
        if (input) input.value = "";
        const container = document.getElementById(
          "apercu-piece-jointe-container",
        );
        if (container) container.classList.add("hidden");
        afficherNotificationToast("Pièce jointe retirée.");
      }

      function envoyerMessageCanal(canal) {
        const textarea = document.getElementById("textarea-message-suivi");
        const inputTel = document.getElementById("input-telephone-suivi");
        const inputNum = document.getElementById("input-num-declaration");

        let message = textarea ? textarea.value.trim() : "Bonjour";
        let tel = inputTel ? inputTel.value.trim() : "";
        let numDeclaration = inputNum ? inputNum.value.trim() : "";

        if (pieceJointeActuelle) {
          message += ` [Pièce jointe : ${pieceJointeActuelle.name}]`;
        }

        let numDigits = tel.replace(/\D/g, "");
        if (!numDigits.startsWith("237") && numDigits.length === 9) {
          numDigits = "237" + numDigits;
        }

        if (canal === "WhatsApp") {
          const urlWa = `https://api.whatsapp.com/send?phone=${numDigits}&text=${encodeURIComponent(message)}`;
          window.open(urlWa, "_blank");
          afficherNotificationToast(
            `✓ Message transmis via WhatsApp (${numDigits}) avec succès !`,
          );
        } else if (canal === "Telegram") {
          const urlTg = `https://t.me/share/url?url=https://bunec.cm&text=${encodeURIComponent(message)}`;
          window.open(urlTg, "_blank");
          afficherNotificationToast(
            `✓ Message transmis via Telegram (${numDigits}) avec succès !`,
          );
        }
      }

      function attacherPieceAuDossierBUNEC() {
        const inputNum = document.getElementById("input-num-declaration");
        const refDossier =
          (inputNum ? inputNum.value.trim() : "") || "DEC-2026-001249";

        if (!pieceJointeActuelle) {
          const inputFichier = document.getElementById("input-piece-jointe");
          if (inputFichier) inputFichier.click();
          return;
        }

        const receiptId = "PJ-2026-" + Math.floor(1000 + Math.random() * 9000);
        afficherNotificationToast(
          `✓ Document "${pieceJointeActuelle.name}" attaché au dossier ${refDossier} avec la référence ${receiptId} !`,
        );
      }

      function afficherNotificationToast(msg) {
        const toast = document.createElement("div");
        toast.className =
          "fixed bottom-5 right-5 z-50 p-4 rounded-2xl shadow-2xl border text-xs bg-slate-900 text-white flex items-center gap-3 border-emerald-400 max-w-md animate-[fadeIn_0.2s_ease-in-out]";
        toast.innerHTML = `<span class="text-base text-emerald-400">✓</span><span>${msg}</span>`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
      }

      // Fermeture du dropdown de suggestions lors d'un clic en dehors
      document.addEventListener("click", (e) => {
        const dropdown = document.getElementById("dropdown-suggestions-cec");
        const input = document.getElementById("input-recherche-cec");
        if (
          dropdown &&
          input &&
          !dropdown.contains(e.target) &&
          e.target !== input
        ) {
          dropdown.classList.add("hidden");
        }
      });

      window.addEventListener("pageshow", () => {
        reinitialiserRecherche();
      });

      function viderResultatRecherche() {
        dossierActuellementCorrespondant = null;
        dossierTermine = false;
        notificationRetraitRecue = false;
        simulatedColorCode = "amber";

        const bandeau = document.getElementById("bandeau-identification-acte");
        const timeline = document.getElementById("container-timeline-dossier");
        const placeholder = document.getElementById("placeholder-avant-recherche");
        const blocBAT = document.getElementById("bloc-visualisation-acte-bat");
        const etatVerrou = document.getElementById("etat-verrouille-acte-civil");

        if (bandeau) {
          bandeau.innerHTML = "";
          bandeau.classList.add("hidden");
        }
        if (timeline) {
          timeline.innerHTML = "";
          timeline.classList.add("hidden");
        }
        if (placeholder) {
          placeholder.classList.remove("hidden");
        }
        if (blocBAT) blocBAT.classList.add("hidden");
        if (etatVerrou) etatVerrou.classList.add("hidden");
        rafraichirPanneauNotifications();
      }

      // RÉINITIALISATION / RETOUR AU FORMULAIRE
      function reinitialiserRecherche() {
        const formCard = document.getElementById("carte-formulaire-recherche");
        const inputCec = document.getElementById("input-recherche-cec");
        const selectCec = document.getElementById("select-cec");
        const selectActe = document.getElementById("select-type-acte");
        const inputDeclaration = document.getElementById(
          "input-num-declaration",
        );
        const inputTelephone = document.getElementById("input-telephone-suivi");
        const inputCritere = document.getElementById(
          "input-critere-supplementaire",
        );

        if (inputCec) inputCec.value = "";
        if (selectCec) selectCec.value = "";
        if (inputDeclaration) inputDeclaration.value = "";
        if (inputTelephone) inputTelephone.value = "";
        if (inputCritere) inputCritere.value = "";
        if (selectActe) {
          selectActe.value = "ACTE_NAISSANCE";
          actualiserBoutonsSelectionTypeActe("ACTE_NAISSANCE");
        }

        viderResultatRecherche();

        formCard.classList.remove("hidden");
        formCard.scrollIntoView({ behavior: "smooth" });
        inputCec?.focus();
      }

      function simulerStatut(couleur) {
        simulatedColorCode = couleur;
        const bandeau = document.getElementById("bandeau-identification-acte");
        if (!bandeau.classList.contains("hidden")) {
          rechercherMonDossierPrecis();
        }
      }

      function obtenirNotificationsLues(dossierId) {
        try {
          const notifications = JSON.parse(
            localStorage.getItem(`bunec_notifications_lues_${dossierId}`) || "[]",
          );
          return new Set(Array.isArray(notifications) ? notifications : []);
        } catch {
          return new Set();
        }
      }

      function construireBoiteNotifications(dossier, cycleDeVie) {
        const messages = cycleDeVie.etapes
          .filter((etape) => ["COMPLETED", "CURRENT", "REJECTED"].includes(etape.statut))
          .map((etape) => ({
            id: `etape-${etape.numero}`,
            titre: etape.nom,
            detail: etape.desc,
            date: etape.date || "Statut actuel",
          }));
        const lues = obtenirNotificationsLues(dossier.id);
        const nonLues = messages.filter((message) => !lues.has(message.id)).length;
        const echapper = (value) =>
          String(value || "").replace(/[&<>"']/g, (character) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
          })[character]);

        return `
          <section class="mt-6 rounded-2xl border border-sky-200 bg-sky-50/70 p-4 sm:p-5" aria-labelledby="titre-boite-notifications">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 id="titre-boite-notifications" class="text-base font-black text-slate-900">Notifications de votre dossier</h4>
                <p class="mt-1 text-xs text-slate-600">Messages associés à la référence ${echapper(dossier.numeroDeclaration || dossier.id)}.</p>
              </div>
              <div class="flex items-center gap-2">
                <span class="rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-black text-sky-900" aria-live="polite">${nonLues} non lue${nonLues === 1 ? "" : "s"}</span>
                <button type="button" onclick="marquerToutesNotificationsLues('${echapper(dossier.id)}')" class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100">Tout marquer comme lu</button>
              </div>
            </div>
            <ul class="mt-4 divide-y divide-sky-100">
              ${messages.map((message) => {
                const estLue = lues.has(message.id);
                return `<li class="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between" data-notification-id="${echapper(message.id)}">
                  <div class="flex items-start gap-3">
                    <span class="mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full ${estLue ? "bg-slate-300" : "bg-sky-600"}" aria-hidden="true"></span>
                    <div>
                      <p class="text-sm font-bold text-slate-900">${echapper(message.titre)}</p>
                      <p class="mt-1 text-xs leading-relaxed text-slate-600">${echapper(message.detail)}</p>
                      <time class="mt-1 block text-[11px] text-slate-500">${echapper(message.date)}</time>
                    </div>
                  </div>
                  ${estLue ? '<span class="text-[11px] font-bold text-slate-500">Lue</span>' : `<button type="button" onclick="marquerNotificationLue('${echapper(dossier.id)}','${echapper(message.id)}')" class="self-start text-xs font-bold text-sky-800 underline underline-offset-2">Marquer comme lue</button>`}
                </li>`;
              }).join("")}
            </ul>
            <p class="mt-4 border-t border-sky-100 pt-3 text-[11px] text-slate-500">L’état de lecture est conservé sur cet appareil. Les notifications ne sont pas envoyées par SMS ni enregistrées sur un compte central.</p>
          </section>
        `;
      }

      function rafraichirPanneauNotifications() {
        const panneau = document.getElementById("panneau-boite-notifications");
        const contenu = document.getElementById("contenu-boite-notifications");
        const badge = document.getElementById("badge-notifications-non-lues");
        const dossier = dossierActuellementCorrespondant;
        const boiteExistante = document.querySelector(
          '#container-timeline-dossier [aria-labelledby="titre-boite-notifications"]',
        );

        if (!dossier || !boiteExistante) {
          if (contenu) {
            contenu.innerHTML =
              '<p class="text-sm text-slate-600">Effectuez une recherche de dossier pour consulter ses notifications.</p>';
          }
          if (badge) badge.classList.add("hidden");
          return;
        }

        const copieBoite = boiteExistante.cloneNode(true);
        copieBoite.querySelector("#titre-boite-notifications")?.removeAttribute("id");
        if (contenu) contenu.innerHTML = copieBoite.innerHTML;

        const compteur = copieBoite.querySelector('[aria-live="polite"]');
        const nombreNonLues = Number.parseInt(compteur?.textContent || "0", 10) || 0;
        if (badge) {
          badge.textContent = nombreNonLues > 99 ? "99+" : String(nombreNonLues);
          badge.classList.toggle("hidden", nombreNonLues === 0);
        }
      }

      function basculerBoiteNotifications() {
        const panneau = document.getElementById("panneau-boite-notifications");
        const bouton = document.getElementById("btn-boite-notifications");
        if (!panneau || !bouton) return;

        const ouvrir = panneau.classList.contains("hidden");
        panneau.classList.toggle("hidden", !ouvrir);
        bouton.setAttribute("aria-expanded", String(ouvrir));
        if (ouvrir) rafraichirPanneauNotifications();
      }

      function fermerBoiteNotifications() {
        document.getElementById("panneau-boite-notifications")?.classList.add("hidden");
        document.getElementById("btn-boite-notifications")?.setAttribute("aria-expanded", "false");
      }

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") fermerBoiteNotifications();
      });

      document.addEventListener("click", (event) => {
        const panneau = document.getElementById("panneau-boite-notifications");
        const bouton = document.getElementById("btn-boite-notifications");
        if (
          panneau &&
          bouton &&
          !panneau.classList.contains("hidden") &&
          !panneau.contains(event.target) &&
          !bouton.contains(event.target)
        ) {
          fermerBoiteNotifications();
        }
      });

      function marquerNotificationLue(dossierId, notificationId) {
        const lues = obtenirNotificationsLues(dossierId);
        lues.add(notificationId);
        localStorage.setItem(
          `bunec_notifications_lues_${dossierId}`,
          JSON.stringify([...lues]),
        );
        rechercherMonDossierPrecis();
        rafraichirPanneauNotifications();
      }

      function marquerToutesNotificationsLues(dossierId) {
        const dossier = baseDossiersNationale.find((item) => item.id === dossierId);
        if (!dossier) return;
        const etapes = dossier.statut === "REJETEE"
          ? [1, 2]
          : dossier.statut === "PRETE_RETRAIT"
            ? [1, 2, 3, 4]
            : [1, 2, 3];
        localStorage.setItem(
          `bunec_notifications_lues_${dossierId}`,
          JSON.stringify(etapes.map((numero) => `etape-${numero}`)),
        );
        rechercherMonDossierPrecis();
        rafraichirPanneauNotifications();
      }

      // ========================================================================
      // RECHERCHER MON DOSSIER : DÉCLENCHÉ UNIQUEMENT APRÈS CLIC SUR LE BOUTON
      // ========================================================================
      async function rechercherMonDossierPrecis() {
        const cecElement = document.getElementById("select-cec");
        const cecRaw = (cecElement ? cecElement.value : "") || "||";
        const [regionId, communeId, communeNom] = cecRaw.split("|");
        const inputDeclaration = document.getElementById("input-num-declaration");
        const inputTelephone = document.getElementById("input-telephone-suivi");

        const numDeclaration = normaliserSaisieSuivi(
          inputDeclaration ? inputDeclaration.value : "",
        ).trim();
        const telephoneSuivi = normaliserSaisieSuivi(
          inputTelephone ? inputTelephone.value : "",
        ).trim();
        const critereSupplementaire = (
          document.getElementById("input-critere-supplementaire")?.value || ""
        ).trim();

        if (!numDeclaration && !telephoneSuivi && !critereSupplementaire) {
          alert(
            "Veuillez renseigner un numéro ou un nom pour rechercher le dossier.",
          );
          document.getElementById("input-num-declaration").focus();
          return;
        }

        // RÉINITIALISATION OBLIGATOIRE AVANT CHAQUE NOUVELLE RECHERCHE
        viderResultatRecherche();

        // Masquer le placeholder d'attente pour la recherche en cours
        document
          .getElementById("placeholder-avant-recherche")
          .classList.add("hidden");

        const selectActe = document.getElementById("select-type-acte");
        const typeSelectionne =
          (selectActe ? selectActe.value : "") || "ACTE_NAISSANCE";
        const criterion = numDeclaration || telephoneSuivi || critereSupplementaire;
        let matched = null;
        let searchError = "";

        try {
          const response = await fetch("/api/v1/dossiers/suivi", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              regionId,
              communeId,
              typeActe: typeSelectionne,
              criterion,
            }),
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error || "Recherche impossible.");
          matched = result.dossier;
        } catch (error) {
          searchError = error.message || "Le service de suivi est indisponible.";
        }

        if (!matched) {
          dossierActuellementCorrespondant = null;
          dossierTermine = false;
          notificationRetraitRecue = false;
          simulatedColorCode = "amber";

          const bandeau = document.getElementById("bandeau-identification-acte");
          const timeline = document.getElementById("container-timeline-dossier");
          if (bandeau) {
            bandeau.innerHTML = `
              <div class="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-center shadow-sm">
                <div class="text-xs font-black uppercase tracking-[0.2em] text-rose-700">Dossier introuvable</div>
                <div id="message-erreur-recherche-suivi" class="mt-2 text-lg font-black text-rose-900"></div>
              </div>
            `;
            const errorMessage = document.getElementById(
              "message-erreur-recherche-suivi",
            );
            if (errorMessage) {
              errorMessage.textContent =
                searchError ||
                "Aucun dossier correspondant aux informations saisies n’a été trouvé dans la base de données.";
            }
            bandeau.classList.remove("hidden");
          }
          if (timeline) {
            timeline.innerHTML = "";
            timeline.classList.add("hidden");
          }

          const blocBAT = document.getElementById("bloc-visualisation-acte-bat");
          if (blocBAT) blocBAT.classList.add("hidden");
          rafraichirPanneauNotifications();

          return;
        }

        dossierActuellementCorrespondant = matched;
        let typeActeDetecte;
        let sigle = "NAIS";
        let reg = "Registre A (Naissances)";
        if (matched.typeActe === "ACTE_MARIAGE") {
          sigle = "MAR";
          reg = "Registre B (Mariages)";
        } else if (matched.typeActe === "ACTE_DECES") {
          sigle = "DEC";
          reg = "Registre C (Décès)";
        } else if (
          matched.typeActe === "DECLARATION_TARDIVE_JUGEMENT_SUPPLETIF"
        ) {
          sigle = "JUG";
          reg = "Registre D (Supplétif)";
        }

        actualiserBoutonsSelectionTypeActe(matched.typeActe);

        typeActeDetecte = {
          code: matched.typeActe,
          titre: matched.titreActe.toUpperCase(),
          sigle: sigle,
          description: `Déclaration certifiée BUNEC pour ${matched.titulaire} (${matched.provenance.communeNom})`,
          registre: reg,
          demandeur: matched.demandeur.nomComplet,
          titulaire: matched.titulaire,
          statut: matched.statut,
        };

        if (matched.statut === "PRETE_RETRAIT") {
          simulatedColorCode = "green";
        } else if (matched.statut === "INSTRUCTION") {
          simulatedColorCode = "amber";
        } else if (matched.statut === "REJETEE") {
          simulatedColorCode = "red";
        }

        if (matched.demandeur && matched.demandeur.telephone) {
          detecterMessagerieInstantanee(matched.demandeur.telephone);
        }

        choisirFormatActeCivil(typeActeDetecte.code);

        // STATUT DU DOSSIER & DÉBLOCAGE DU BON À TIRER (BAT)
        if (simulatedColorCode === "green" && matched.donneesActeCivil) {
          dossierTermine = true;
          notificationRetraitRecue = true;
        } else {
          dossierTermine = false;
          notificationRetraitRecue = false;
        }

        // 1. RENDU DU BANDEAU AVEC BOUTON RETOUR
        const bandeauContainer = document.getElementById(
          "bandeau-identification-acte",
        );
        bandeauContainer.classList.remove("hidden");
        const telAffiche =
          matched && matched.demandeur && matched.demandeur.telephone
            ? matched.demandeur.telephone
            : telephoneSuivi;
        bandeauContainer.innerHTML = `
        <div class="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white shadow-xl border-2 border-emerald-500/50 flex flex-col md:flex-row md:items-center justify-between gap-5 animate-[fadeIn_0.3s_ease-in-out]">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-950 border-2 border-amber-500/40 text-amber-300 font-mono font-black flex flex-col items-center justify-center flex-shrink-0 shadow-lg text-center">
              <span class="text-[8px] tracking-widest text-slate-400 uppercase">ACTE</span>
              <span class="text-sm font-black text-amber-300">${typeActeDetecte.sigle}</span>
              <span class="text-[8px] text-slate-400 uppercase">BUNEC</span>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 px-2 py-0.5 rounded font-mono">
                  TYPE D'ACTE IDENTIFIÉ
                </span>
                <span class="text-xs text-emerald-300 font-bold">• ${typeActeDetecte.registre}</span>
              </div>
              <h3 class="text-xl sm:text-2xl font-black tracking-tight text-white mt-1 uppercase">
                ${typeActeDetecte.titre}
              </h3>
              <p class="text-xs text-slate-300 mt-0.5 font-medium">
                ${typeActeDetecte.description}
              </p>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <div class="hidden bg-white/10 p-2.5 sm:p-3 rounded-2xl border border-white/10 text-xs">
              <span class="text-slate-400 block text-[10px] uppercase font-bold">Canaux Détectés :</span>
              <span class="font-bold text-amber-300">📱 +237 ${telAffiche}</span>
              <div class="flex items-center gap-1.5 mt-1">
                ${messagerieDetectee.whatsapp ? '<span class="bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 text-[10px] px-2 py-0.5 rounded font-bold flex items-center gap-1">💬 WhatsApp ✓</span>' : ""}
                ${messagerieDetectee.telegram ? '<span class="bg-sky-500/30 text-sky-200 border border-sky-400/40 text-[10px] px-2 py-0.5 rounded font-bold flex items-center gap-1">✈️ Telegram ✓</span>' : ""}
              </div>
            </div>

            <!-- BOUTON D'ACCÈS AU FORMAT CIVIL / BAT CONDITIONNEL -->
            ${
              dossierTermine && notificationRetraitRecue && matched.donneesActeCivil
                ? `
              <button type="button" onclick="consulterActeCivilDirect('${typeActeDetecte.code}')" class="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 rounded-xl text-xs font-black shadow-md transition flex items-center gap-1.5 cursor-pointer">
                <span>📜</span>
                <span>Voir le Bon à Tirer (BAT Débloqué)</span>
              </button>
            `
                : `
              <button type="button" onclick="afficherAlerteBatVerrouille('${simulatedColorCode}')" class="px-4 py-2.5 bg-slate-700/80 hover:bg-slate-700 active:scale-95 text-slate-300 border border-slate-600 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer" title="L'acte ne s'affiche que lorsque le processus est terminé et la notification reçue">
                <span>🔒</span>
                <span>BAT Non Débloqué (En cours)</span>
              </button>
            `
            }

            <!-- BOUTON RETOUR HAUT -->
            <button type="button" onclick="reinitialiserRecherche()" class="px-4 py-2.5 bg-white/20 hover:bg-white/30 active:scale-95 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer">
              <span>⬅️</span>
              <span>Retour</span>
            </button>
          </div>
        </div>
      `;

        // 2. CONFIGURATION DU CYCLE DE VIE
        let cycleDeVie;
        if (simulatedColorCode === "green") {
          if (matched && matched.donneesActeCivil) {
            cycleDeVie = {
              codeCouleur: "green",
              libelleStatut: "DISPONIBLE AU GUICHET — PRÊT POUR RETRAIT",
              etapeCourante: 4,
              motifBlocage: null,
              etapes: [
                {
                  numero: 1,
                  nom: "Dossier déposé et enregistré",
                  statut: "COMPLETED",
                  date: "11/07/2019 08:30",
                  desc: `Enregistrement officiel au ${matched.provenance.centreEtatCivil}. Identifiant unique BUNEC certifié généré.`,
                },
                {
                  numero: 2,
                  nom: "Instruction & Vérification juridique",
                  statut: "COMPLETED",
                  date: "11/07/2019 10:15",
                  desc: `Contrôle probant : ${matched.donneesActeCivil.declaration.texteJugement}.`,
                },
                {
                  numero: 3,
                  nom: "Validation & Signature de l’Officier",
                  statut: "COMPLETED",
                  date: "11/07/2019 11:30",
                  desc: `Signé par ${matched.donneesActeCivil.certification.officierNom} (${matched.donneesActeCivil.certification.officierQualite}) et transcrit par ${matched.donneesActeCivil.certification.secretaireNom}.`,
                },
                {
                  numero: 4,
                  nom: "Disponible au guichet / Prêt pour délivrance",
                  statut: "COMPLETED",
                  date: "11/07/2019 14:00",
                  desc: "Votre extrait d'acte de naissance officiel est disponible au guichet.",
                  convocation: `Retrait ouvert au ${matched.lieuRetrait} (Muni du récépissé original).`,
                },
              ],
            };
          } else {
            cycleDeVie = {
              codeCouleur: "green",
              libelleStatut: "DISPONIBLE AU GUICHET — PRÊT POUR RETRAIT",
              etapeCourante: 4,
              motifBlocage: null,
              etapes: [
                {
                  numero: 1,
                  nom: "Dossier déposé et enregistré",
                  statut: "COMPLETED",
                  date: "25/08/2026 08:30",
                  desc: "Enregistrement au guichet n°02. Identifiant unique BUNEC certifié généré.",
                },
                {
                  numero: 2,
                  nom: "Instruction & Vérification juridique",
                  statut: "COMPLETED",
                  date: "27/08/2026 11:15",
                  desc: "Contrôle probant des pièces justificatives, certificats médicaux et CNI des témoins.",
                },
                {
                  numero: 3,
                  nom: "Validation & Signature de l’Officier",
                  statut: "COMPLETED",
                  date: "02/09/2026 14:45",
                  desc: "Signature électronique qualifiée de M. le Maire apposée. Inscription définitive au registre.",
                },
                {
                  numero: 4,
                  nom: "Disponible au guichet / Prêt pour délivrance",
                  statut: "COMPLETED",
                  date: "05/09/2026 09:00",
                  desc: "Votre acte original sécurisé est disponible au guichet.",
                  convocation:
                    "Retrait ouvert dès à présent au Guichet 3 (Muni du récépissé original).",
                },
              ],
            };
          }
        } else if (simulatedColorCode === "red") {
          cycleDeVie = {
            codeCouleur: "red",
            libelleStatut: "PIÈCE REJETÉE — DOSSIER BLOQUÉ",
            etapeCourante: 2,
            motifBlocage: {
              libelle: "Discordance d’Identité & Certificat Médical Illisible",
              description:
                "L’orthographe du nom patronymique sur le certificat médical ne concorde pas avec la CNI légale du déclarant.",
            },
            etapes: [
              {
                numero: 1,
                nom: "Dossier déposé et enregistré",
                statut: "COMPLETED",
                date: "25/08/2026 08:30",
                desc: "Enregistrement initial au guichet n°02.",
              },
              {
                numero: 2,
                nom: "Instruction & Vérification juridique",
                statut: "REJECTED",
                date: "27/08/2026 11:15",
                desc: "Instruction bloquée : anomalie constatée sur les pièces probantes.",
              },
              {
                numero: 3,
                nom: "Validation & Signature de l’Officier",
                statut: "PENDING",
                date: null,
                desc: "En attente de régularisation matérielle des pièces par l’usager.",
              },
              {
                numero: 4,
                nom: "Disponible au guichet / Prêt pour délivrance",
                statut: "PENDING",
                date: null,
                desc: "Délivrance suspendue.",
              },
            ],
          };
        } else {
          cycleDeVie = {
            codeCouleur: "amber",
            libelleStatut: "EN COURS D’INSTRUCTION ADMINISTRATIVE",
            etapeCourante: 3,
            motifBlocage: null,
            etapes: [
              {
                numero: 1,
                nom: "Dossier déposé et enregistré",
                statut: "COMPLETED",
                date: "25/08/2026 08:30",
                desc: "Enregistrement initial. Identifiant BUNEC unique généré.",
              },
              {
                numero: 2,
                nom: "Instruction & Vérification juridique",
                statut: "COMPLETED",
                date: "27/08/2026 11:15",
                desc: "Vérification de concordance du certificat médical et des témoins achevée.",
              },
              {
                numero: 3,
                nom: "Validation & Signature de l’Officier",
                statut: "CURRENT",
                date: "02/09/2026 14:45",
                desc: "En attente d’apposition de la signature électronique de l’Officier d’État Civil.",
              },
              {
                numero: 4,
                nom: "Disponible au guichet / Prêt pour délivrance",
                statut: "PENDING",
                date: null,
                desc: "Convocation programmée dès signature effective.",
                convocation:
                  "Créneau estimé : 10/09/2026 de 09h00 à 11h30 (Guichet 02)",
              },
            ],
          };
        }

        if (matched.cycleDeVie) {
          cycleDeVie = matched.cycleDeVie;
        }

        // 3. RENDU DE LA TIMELINE AVEC BOUTON RETOUR BAS
        const timelineContainer = document.getElementById(
          "container-timeline-dossier",
        );
        timelineContainer.classList.remove("hidden");

        let bannerBg = "bg-amber-50 border-amber-300 text-amber-950";
        let badgeClass = "bg-amber-100 text-amber-900 border-amber-300";
        if (cycleDeVie.codeCouleur === "green") {
          bannerBg = "bg-emerald-50 border-emerald-300 text-emerald-950";
          badgeClass = "bg-emerald-100 text-emerald-900 border-emerald-300";
        } else if (cycleDeVie.codeCouleur === "red") {
          bannerBg = "bg-rose-50 border-rose-300 text-rose-950";
          badgeClass = "bg-rose-100 text-rose-900 border-rose-300";
        }

        const numDecFinal = matched
          ? matched.numeroDeclaration
          : numDeclaration || "12019/CE101/N/0731";
        const idBunecFinal = matched
          ? matched.identifiantBUNEC
          : `${regionId}-${communeId.split("-")[1] || "CEC"}-00-2026-${typeActeDetecte.code.slice(0, 2)}-001249`;
        const centreFinal = matched
          ? matched.provenance.centreEtatCivil
          : `Mairie de ${communeNom} — Centre Principal d'État Civil`;

        timelineContainer.innerHTML = `
        <div class="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden animate-[fadeIn_0.4s_ease-in-out]">

          <div class="p-5 sm:p-8 border-b ${bannerBg}">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xs uppercase tracking-widest font-black text-slate-500">N° DÉCLARATION :</span>
                  <span class="font-mono text-xs bg-white/90 px-2.5 py-0.5 rounded font-black text-slate-800 border border-slate-300">${numDecFinal}</span>
                </div>
                <h4 class="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  ${idBunecFinal}
                </h4>
                <p class="text-xs font-semibold text-slate-600 mt-1">
                  ${centreFinal}
                </p>
              </div>

              <div class="flex flex-col items-start md:items-end gap-2">
                <span class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black border ${badgeClass}">
                  <span class="w-2.5 h-2.5 rounded-full ${cycleDeVie.codeCouleur === "green" ? "bg-emerald-500 animate-pulse" : cycleDeVie.codeCouleur === "amber" ? "bg-amber-500 animate-pulse" : "bg-rose-500"}"></span>
                  ${cycleDeVie.libelleStatut}
                </span>
                <span class="text-xs text-slate-600">Demandeur : <strong>${typeActeDetecte.demandeur}</strong></span>
              </div>
            </div>

            ${
              cycleDeVie.motifBlocage
                ? `
              <div class="mt-5 p-4 rounded-2xl bg-rose-100/90 border border-rose-300 text-rose-950 text-sm flex items-start gap-3">
                <span class="text-2xl">⚠️</span>
                <div>
                  <p class="font-black text-rose-950">Motif officiel du rejet : ${cycleDeVie.motifBlocage.libelle}</p>
                  <p class="text-xs text-rose-900 mt-0.5 font-medium">${cycleDeVie.motifBlocage.description}</p>
                  <p class="text-[11px] font-black uppercase text-rose-900 mt-2 bg-rose-200/80 px-2 py-1 rounded inline-block">
                    Action requise : Présentez-vous muni de la CNI originale et du certificat médical au guichet n°02.
                  </p>
                </div>
              </div>
            `
                : ""
            }
          </div>

          <!-- TIMELINE DES 4 ÉTAPES -->
          <div class="p-5 sm:p-8">
            <h4 class="text-base font-black text-slate-900 mb-6 flex items-center gap-2">
              <span>Timeline Institutionnelle du Cycle de Vie (4 Étapes BUNEC)</span>
            </h4>

            <div class="space-y-6">
              ${cycleDeVie.etapes
                .map((etape) => {
                  const isCurrent = etape.numero === cycleDeVie.etapeCourante;
                  const isCompleted = etape.statut === "COMPLETED";
                  const isRejected = etape.statut === "REJECTED";

                  let iconHtml = `<div class="w-9 h-9 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-black text-xs">${etape.numero}</div>`;
                  let boxClass =
                    "bg-white border-dashed border-slate-200 opacity-60";

                  if (isCompleted) {
                    iconHtml = `<div class="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-md ring-4 ring-emerald-100">✓</div>`;
                    boxClass = "bg-slate-50/90 border-slate-200";
                  } else if (isRejected) {
                    iconHtml = `<div class="w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center font-black text-sm shadow-md ring-4 ring-rose-100">✕</div>`;
                    boxClass = "bg-rose-50 border-rose-300";
                  } else if (isCurrent) {
                    iconHtml = `<div class="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center font-black text-sm shadow-md ring-4 ring-amber-100 animate-bounce">${etape.numero}</div>`;
                    boxClass = "bg-amber-50/80 border-amber-300 shadow-sm";
                  }

                  return `
                  <div class="flex items-start gap-3.5">
                    <div class="flex-shrink-0 pt-0.5">${iconHtml}</div>
                    <div class="flex-grow p-4 sm:p-5 rounded-2xl border ${boxClass}">
                      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <span class="font-extrabold text-sm text-slate-900">Étape ${etape.numero} : ${etape.nom}</span>
                        ${etape.date ? `<span class="text-xs font-mono font-bold text-slate-500">${etape.date}</span>` : ""}
                      </div>
                      <p class="text-xs text-slate-600 mt-0.5">${etape.desc}</p>
                      ${
                        etape.convocation
                          ? `
                        <div class="mt-3 p-3 bg-emerald-100/80 border border-emerald-300 rounded-xl text-xs font-black text-emerald-950">
                          📅 ${etape.convocation}
                        </div>
                      `
                          : ""
                      }
                    </div>
                  </div>
                `;
                })
                .join("")}
            </div>

              ${construireBoiteNotifications(matched, cycleDeVie)}

            <!-- BOUTON RETOUR BAS & NOTIFICATIONS -->
            <div class="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="hidden flex-wrap items-center gap-2 text-xs text-slate-500">
                <span class="font-bold text-slate-700">Notifications reliées :</span>
                ${
                  messagerieDetectee.whatsapp
                    ? `
                  <button type="button" onclick="testerAlerteMessagerie('WhatsApp')" title="Tester la notification WhatsApp" class="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer">
                    <span>💬 WhatsApp (+237 ${telephoneSuivi})</span>
                    <span class="text-[9px] bg-emerald-600 text-white px-1.5 py-0.2 rounded-full font-black">✓ Actif</span>
                  </button>
                `
                    : ""
                }
                ${
                  messagerieDetectee.telegram
                    ? `
                  <button type="button" onclick="testerAlerteMessagerie('Telegram')" title="Tester la notification Telegram" class="bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-300 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer">
                    <span>✈️ Telegram (@BUNEC_Suivi_Bot)</span>
                    <span class="text-[9px] bg-sky-600 text-white px-1.5 py-0.2 rounded-full font-black">✓ Actif</span>
                  </button>
                `
                    : ""
                }
                <span class="bg-slate-100 text-slate-700 border border-slate-300 px-2 py-1 rounded-lg font-semibold text-[11px]">
                  📱 SMS Secours
                </span>
              </div>

              <div class="flex flex-wrap items-center gap-2.5">
                ${
                  dossierTermine && notificationRetraitRecue
                    ? `
                  <button type="button" onclick="consulterActeCivilDirect('${typeActeDetecte.code}')" class="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 rounded-xl text-xs font-black transition flex items-center gap-2 shadow cursor-pointer">
                    <span>📜</span>
                    <span>Visualiser le Bon à Tirer (BAT) Prêt pour Retrait</span>
                  </button>
                `
                    : `
                  <button type="button" onclick="afficherAlerteBatVerrouille('${simulatedColorCode}')" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer" title="L'acte ne s'affiche que lorsque le processus est terminé et la notification reçue">
                    <span>🔒</span>
                    <span>BAT Verrouillé (Instruction en cours)</span>
                  </button>
                `
                }
                <button type="button" onclick="reinitialiserRecherche()" class="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow cursor-pointer">
                  <span>⬅️</span>
                  <span>Retour / Nouvelle Recherche</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      `;

        document
          .getElementById("carte-formulaire-recherche")
          .classList.add("hidden");

        // Défilement fluide vers le bandeau d'identification
        bandeauContainer.scrollIntoView({ behavior: "smooth" });
        rafraichirPanneauNotifications();
      }

      // Chargement & Filtrage des Bans
      async function chargerBans() {
        try {
          const res = await fetch("/api/v1/bans");
          bansList = await res.json();
          const heroCount = document.getElementById("badge-bans-count-hero");
          if (heroCount) {
            heroCount.textContent = `${bansList.length} publication${bansList.length === 1 ? "" : "s"}`;
          }
        } catch (err) {
          console.warn("Fallback bans");
        }
        filtrerBans();
      }

      function normaliserTexteRecherche(value) {
        return String(value || "")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .trim();
      }

      function filtrerBans() {
        const reg = document.getElementById("filter-region").value;
        const stat = document.getElementById("filter-statut").value;
        const regime = document.getElementById("filter-regime").value;
        const searchInput = document.getElementById("search-bans-input");
        const searchTerm = searchInput ? normaliserTexteRecherche(searchInput.value) : "";

        const filtered = bansList.filter((ban) => {
          if (reg !== "ALL" && ban.regionId !== reg) return false;
          if (stat !== "ALL" && ban.statutBan !== stat) return false;
          if (regime !== "ALL" && ban.regimeMatrimonial !== regime)
            return false;

          if (!searchTerm) return true;

          const recherchePleine = [
            ban.referenceLegaleBan,
            ban.centreEtatCivil,
            ban.regionNom,
            ban.communeNom,
            ban.dateDebutAffichage,
            ban.dateFinAffichage,
            ban.datePrevueCelebration,
            ban.epoux?.nom,
            ban.epoux?.prenom,
            ban.epouse?.nom,
            ban.epouse?.prenom,
            `${ban.epoux?.nom || ""} ${ban.epoux?.prenom || ""}`,
            `${ban.epouse?.nom || ""} ${ban.epouse?.prenom || ""}`,
            `${ban.epoux?.prenom || ""} ${ban.epouse?.prenom || ""}`,
            ban.lieuPrevuCelebration,
          ]
            .filter(Boolean)
            .map((value) => normaliserTexteRecherche(value));

          return recherchePleine.some((value) => value.includes(searchTerm));
        });

        document.getElementById("bans-count-display").textContent =
          filtered.length;
        document.getElementById("badge-bans-count-top").textContent =
          `${filtered.length} publication${filtered.length === 1 ? "" : "s"}`;

        const grid = document.getElementById("grid-bans");
        if (filtered.length === 0) {
          grid.innerHTML = `
            <div class="md:col-span-2 lg:col-span-3 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <div class="text-lg font-black text-slate-800">Aucune publication trouvée</div>
            </div>
          `;
          return;
        }

        grid.innerHTML = filtered
          .map((ban) => {
            let badgeBadge =
              '<span class="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">En cours</span>';
            if (ban.statutBan === "EXPIRANT_SOUS_48H") {
              badgeBadge =
                '<span class="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">⚠️ Expire &lt; 48h</span>';
            } else if (ban.statutBan === "CLOTURE_SANS_OPPOSITION") {
              badgeBadge =
                '<span class="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-300">Clôturé</span>';
            } else if (ban.statutBan === "OPPOSITION_ENREGISTREE") {
              badgeBadge =
                '<span class="px-2.5 py-1 text-xs font-bold rounded-full bg-rose-100 text-rose-800 border border-rose-300">⛔ Opposé</span>';
            }

            const formatReg =
              ban.regimeMatrimonial === "MONOGAMIE_BIENS_COMMUNS"
                ? "Monogamie — Biens Communs"
                : ban.regimeMatrimonial === "MONOGAMIE_SEPARATION_BIENS"
                  ? "Monogamie — Séparation"
                  : "Polygamie";

            return `
          <div class="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-xl transition">
            <div class="p-4 sm:p-5">
              <div class="flex items-center justify-between gap-2 mb-3">
                <span class="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">${ban.referenceLegaleBan}</span>
                ${badgeBadge}
              </div>

              <!-- BLOC RESPONSIF DES PHOTOS RÉELLES DES FUTURS ÉPOUX -->
              <div class="bg-gradient-to-r from-blue-50/70 via-slate-50 to-rose-50/70 p-3 sm:p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs mb-3.5">
                <div class="flex items-center justify-between text-[9px] sm:text-[10px] font-black uppercase tracking-wider mb-2.5 px-0.5">
                  <span class="text-blue-900 flex items-center gap-1">
                    <span class="w-2 h-2 rounded-full bg-blue-600"></span> Futur Époux
                  </span>
                  <span class="bg-white/90 px-2 py-0.5 rounded-full border border-slate-200 text-slate-600 font-mono text-[8px] sm:text-[9px] shadow-2xs">
                    Union Officielle
                  </span>
                  <span class="text-rose-900 flex items-center gap-1">
                    Future Épouse <span class="w-2 h-2 rounded-full bg-rose-600"></span>
                  </span>
                </div>

                <div class="grid grid-cols-2 gap-2 sm:gap-3 items-stretch">
                  <!-- Époux -->
                  <div class="flex flex-col items-center text-center p-2 sm:p-2.5 rounded-xl bg-white/90 border border-blue-200 shadow-2xs hover:border-blue-400 transition">
                    <h4 class="font-black text-slate-900 text-xs sm:text-sm leading-snug line-clamp-1">
                      ${ban.epoux.nom}
                    </h4>
                    <p class="text-[11px] font-bold text-blue-950 leading-tight line-clamp-1">
                      ${ban.epoux.prenom}
                    </p>
                    <p class="text-[10px] text-slate-600 mt-0.5 leading-tight line-clamp-1">
                      ${ban.epoux.profession}
                    </p>
                    <span class="text-[9px] text-slate-400 mt-0.5 line-clamp-1">Né à ${ban.epoux.lieuNaissance}</span>
                  </div>

                  <!-- Épouse -->
                  <div class="flex flex-col items-center text-center p-2 sm:p-2.5 rounded-xl bg-white/90 border border-rose-200 shadow-2xs hover:border-rose-400 transition">
                    <h4 class="font-black text-slate-900 text-xs sm:text-sm leading-snug line-clamp-1">
                      ${ban.epouse.nom}
                    </h4>
                    <p class="text-[11px] font-bold text-rose-950 leading-tight line-clamp-1">
                      ${ban.epouse.prenom}
                    </p>
                    <p class="text-[10px] text-slate-600 mt-0.5 leading-tight line-clamp-1">
                      ${ban.epouse.profession}
                    </p>
                    <span class="text-[9px] text-slate-400 mt-0.5 line-clamp-1">Née à ${ban.epouse.lieuNaissance}</span>
                  </div>
                </div>
              </div>

              <!-- DÉTAILS DU MARIAGE PRÉVU -->
              <div class="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                <div class="flex items-start gap-1.5">
                  <span class="font-black text-slate-900 whitespace-nowrap">Lieu de célébration :</span>
                  <span class="text-slate-600 font-medium">${ban.lieuPrevuCelebration}</span>
                </div>
                <div class="flex items-start gap-1.5">
                  <span class="font-black text-slate-900 whitespace-nowrap">Régime :</span>
                  <span class="text-slate-600 font-medium">${formatReg}</span>
                </div>
              </div>
            </div>

            <div class="p-4 sm:p-5 bg-slate-50 border-t border-slate-200">
              <div class="flex items-center justify-between mb-3">
                <span class="text-[11px] font-black text-slate-500 uppercase">Délai Légal :</span>
                <div class="countdown-badge font-mono text-xs font-bold bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm" data-target="${ban.dateFinAffichage}">
                  Calcul...
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <button type="button" onclick="ouvrirDetailBan('${ban.id}')" class="w-full py-2.5 bg-slate-200 hover:bg-slate-300 active:scale-95 text-slate-800 rounded-xl text-xs font-black transition">
                  Fiche Complète
                </button>
                <button type="button" onclick="ouvrirFormOpposition('${ban.id}')" ${ban.statutBan === "CLOTURE_SANS_OPPOSITION" ? "disabled" : ""} class="w-full py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-xl text-xs font-black transition disabled:opacity-40">
                  Former Opposition
                </button>
              </div>
            </div>
          </div>
        `;
          })
          .join("");

        actualiserComptesARebours();
      }

      function actualiserComptesARebours() {
        document.querySelectorAll(".countdown-badge").forEach((badge) => {
          const targetStr = badge.getAttribute("data-target");
          const diff = +new Date(targetStr) - +new Date();
          if (diff > 0) {
            const j = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const m = Math.floor((diff / 1000 / 60) % 60);
            const s = Math.floor((diff / 1000) % 60);
            badge.innerHTML = `<span class="text-emerald-700 font-black">${j}j</span> : ${String(h).padStart(2, "0")}h : ${String(m).padStart(2, "0")}m : <span class="text-slate-400">${String(s).padStart(2, "0")}s</span>`;
          } else {
            badge.innerHTML =
              '<span class="text-slate-500">Affichage expiré</span>';
          }
        });
      }

      function ouvrirDetailBan(id) {
        const ban = bansList.find((b) => b.id === id);
        if (!ban) return;

        document.getElementById("modal-ban-detail-content").innerHTML = `
        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div><span class="text-slate-500 font-bold">Référence BUNEC :</span> <strong class="font-mono text-slate-900">${ban.referenceLegaleBan}</strong></div>
          <div><span class="text-slate-500 font-bold">Centre d'état civil :</span> <strong class="text-slate-900">${ban.centreEtatCivil}</strong></div>
          <div><span class="text-slate-500 font-bold">Période légale :</span> <strong class="text-slate-900">${ban.dateDebutAffichage} au ${ban.dateFinAffichage.split("T")[0]}</strong></div>
          <div><span class="text-slate-500 font-bold">Date célébration :</span> <strong class="text-slate-900">${ban.datePrevueCelebration}</strong></div>
        </div>

        <!-- PORTRAITS RÉELS & FICHES D'IDENTITÉ CIVILE -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- ÉPOUX -->
          <div class="p-4 bg-gradient-to-br from-blue-50/80 to-white rounded-2xl border-2 border-blue-200 text-xs shadow-xs">
                <div class="flex items-center gap-3.5 mb-3 pb-3 border-b border-blue-100">
              <div>
                <span class="inline-block text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-blue-900 bg-blue-100 px-2 py-0.5 rounded-md mb-1 font-mono">
                  FUTUR ÉPOUX
                </span>
                <h5 class="font-black text-slate-900 text-sm sm:text-base leading-tight">
                  ${ban.epoux.nom} ${ban.epoux.prenom}
                </h5>
                <p class="text-xs text-blue-900 font-bold mt-0.5">${ban.epoux.profession}</p>
                <p class="text-[11px] text-slate-500 mt-0.5">Né le ${ban.epoux.dateNaissance} à ${ban.epoux.lieuNaissance}</p>
              </div>
            </div>
            <div class="space-y-1.5 text-slate-700 text-xs">
              <p><strong>Domicile :</strong> ${ban.epoux.domicile}</p>
              <p><strong>Fils de :</strong> ${ban.epoux.pere}</p>
              <p><strong>Et de :</strong> ${ban.epoux.mere}</p>
            </div>
          </div>

          <!-- ÉPOUSE -->
          <div class="p-4 bg-gradient-to-br from-rose-50/80 to-white rounded-2xl border-2 border-rose-200 text-xs shadow-xs">
                <div class="flex items-center gap-3.5 mb-3 pb-3 border-b border-rose-100">
              <div>
                <span class="inline-block text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-rose-900 bg-rose-100 px-2 py-0.5 rounded-md mb-1 font-mono">
                  FUTURE ÉPOUSE
                </span>
                <h5 class="font-black text-slate-900 text-sm sm:text-base leading-tight">
                  ${ban.epouse.nom} ${ban.epouse.prenom}
                </h5>
                <p class="text-xs text-rose-900 font-bold mt-0.5">${ban.epouse.profession}</p>
                <p class="text-[11px] text-slate-500 mt-0.5">Née le ${ban.epouse.dateNaissance} à ${ban.epouse.lieuNaissance}</p>
              </div>
            </div>
            <div class="space-y-1.5 text-slate-700 text-xs">
              <p><strong>Domicile :</strong> ${ban.epouse.domicile}</p>
              <p><strong>Fille de :</strong> ${ban.epouse.pere}</p>
              <p><strong>Et de :</strong> ${ban.epouse.mere}</p>
            </div>
          </div>
        </div>

        <div class="p-3 bg-slate-100 rounded-xl text-[11px] font-mono text-slate-600 break-all">
          Empreinte SHA-256 certifiée BUNEC : ${ban.hashCertifieSha256}
        </div>
      `;

        document.getElementById("modal-ban-detail").classList.remove("hidden");
      }

      function ouvrirFormOpposition(id) {
        const ban = bansList.find((b) => b.id === id);
        if (!ban) return;
        activeBanIdForOpp = id;
        document.getElementById("opposition-ban-ref").textContent =
          `Dossier ${ban.referenceLegaleBan} (${ban.epoux.nom} & ${ban.epouse.nom})`;
        document.getElementById("modal-opposition").classList.remove("hidden");
      }

      function simulerCompressionClient(input) {
        if (input.files && input.files[0]) {
          const feedback = document.getElementById("opp-compression-feedback");
          feedback.classList.remove("hidden");
          feedback.textContent = `⚡ Auto-compression client WebP : ${(input.files[0].size / (1024 * 1024)).toFixed(1)} Mo ➔ 320 Ko (Prêt pour téléversement)`;
        }
      }

      function validerOpposition() {
        const ban = bansList.find((b) => b.id === activeBanIdForOpp);
        if (ban) ban.statutBan = "OPPOSITION_ENREGISTREE";
        fermerModal("modal-opposition");
        filtrerBans();
        alert(
          "Opposition formelle enregistrée avec horodatage certifié SHA-256 et transmise au Procureur de la République.",
        );
      }

      function ouvrirModalRappels() {
        document.getElementById("modal-rappels").classList.remove("hidden");
      }

      function fermerModal(id) {
        document.getElementById(id).classList.add("hidden");
      }

      // ========================================================================
      // DÉTECTION DIRECTE DE MESSAGERIE : WHATSAPP & TELEGRAM
      // ========================================================================
      function detecterMessagerieInstantanee(val) {
        const digits = (val || "").replace(/\D/g, "");
        const badgeOperateur = document.getElementById(
          "label-operateur-detecte",
        );
        const badgeWa = document.getElementById("badge-canal-whatsapp");
        const badgeTg = document.getElementById("badge-canal-telegram");
        const etatWa = document.getElementById("etat-whatsapp");
        const etatTg = document.getElementById("etat-telegram");
        const detailText = document.getElementById(
          "detail-messagerie-detectee",
        );
        const statutVerif = document.getElementById("statut-verification-tel");

        let numClean = digits;
        if (numClean.startsWith("237") && numClean.length > 3) {
          numClean = numClean.substring(3);
        }

        // Identification de l'opérateur mobile camerounais
        let operateur = "Mobile CMR";
        let opClass = "bg-slate-100 text-slate-700 border-slate-200";

        const prefix2 = numClean.substring(0, 2);
        const prefix3 = numClean.substring(0, 3);
        const prefix3Num = parseInt(prefix3, 10);

        if (prefix2 === "69" || (prefix3Num >= 655 && prefix3Num <= 659)) {
          operateur = "Orange CMR";
          opClass = "bg-orange-100 text-orange-900 border-orange-200";
        } else if (
          prefix2 === "67" ||
          prefix2 === "68" ||
          (prefix3Num >= 650 && prefix3Num <= 654)
        ) {
          operateur = "MTN CMR";
          opClass = "bg-amber-100 text-amber-950 border-amber-300";
        } else if (prefix2 === "66") {
          operateur = "Nexttel";
          opClass = "bg-rose-100 text-rose-900 border-rose-200";
        } else if (prefix2 === "24" || prefix3 === "620" || prefix3 === "621") {
          operateur = "Camtel Blue";
          opClass = "bg-blue-100 text-blue-900 border-blue-200";
        }

        if (badgeOperateur) {
          badgeOperateur.textContent = operateur;
          badgeOperateur.className = `text-[10px] font-extrabold px-2 py-0.5 rounded-full border shadow-xs ${opClass}`;
        }

        // Vérification WhatsApp & Telegram
        const isValidNumber = numClean.length >= 8;
        const hasWhatsApp = isValidNumber;
        const hasTelegram = isValidNumber;

        messagerieDetectee = {
          whatsapp: hasWhatsApp,
          telegram: hasTelegram,
          operateur: operateur,
          telephone: val.trim(),
        };

        if (hasWhatsApp) {
          if (badgeWa) {
            badgeWa.className =
              "flex items-center justify-between p-2 rounded-lg bg-emerald-100/90 border border-emerald-400 text-emerald-950 text-xs font-bold shadow-xs transition-all ring-2 ring-emerald-300 cursor-pointer";
            badgeWa.title = "Cliquez pour tester l'envoi WhatsApp";
            badgeWa.onclick = () => testerAlerteMessagerie("WhatsApp");
          }
          if (etatWa) {
            etatWa.textContent = "✓ Détecté";
            etatWa.className =
              "text-[10px] font-black bg-emerald-600 text-white px-1.5 py-0.2 rounded";
          }
        } else {
          if (badgeWa) {
            badgeWa.className =
              "flex items-center justify-between p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-400 text-xs font-medium opacity-60 transition-all";
            badgeWa.onclick = null;
          }
          if (etatWa) {
            etatWa.textContent = "Non actif";
            etatWa.className =
              "text-[10px] bg-slate-300 text-slate-600 px-1.5 py-0.2 rounded";
          }
        }

        if (hasTelegram) {
          if (badgeTg) {
            badgeTg.className =
              "flex items-center justify-between p-2 rounded-lg bg-sky-100/90 border border-sky-400 text-sky-950 text-xs font-bold shadow-xs transition-all ring-2 ring-sky-300 cursor-pointer";
            badgeTg.title = "Cliquez pour tester l'envoi Telegram";
            badgeTg.onclick = () => testerAlerteMessagerie("Telegram");
          }
          if (etatTg) {
            etatTg.textContent = "✓ Détecté";
            etatTg.className =
              "text-[10px] font-black bg-sky-600 text-white px-1.5 py-0.2 rounded";
          }
        } else {
          if (badgeTg) {
            badgeTg.className =
              "flex items-center justify-between p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-400 text-xs font-medium opacity-60 transition-all";
            badgeTg.onclick = null;
          }
          if (etatTg) {
            etatTg.textContent = "Non actif";
            etatTg.className =
              "text-[10px] bg-slate-300 text-slate-600 px-1.5 py-0.2 rounded";
          }
        }

        if (isValidNumber) {
          if (statutVerif)
            statutVerif.innerHTML =
              '<span class="w-2 h-2 rounded-full bg-emerald-500"></span><span class="text-emerald-700">Canaux Vérifiés</span>';
          if (detailText)
            detailText.innerHTML = `Numéro relié à <strong>WhatsApp & Telegram</strong> pour alertes d'état civil`;
        } else {
          if (statutVerif)
            statutVerif.innerHTML =
              '<span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span><span class="text-amber-700">Saisie...</span>';
          if (detailText)
            detailText.innerHTML = `Renseignez les 9 chiffres du numéro de téléphone`;
        }
      }

      // SIMULATION D'ENVOI D'ALERTE PAR MESSAGERIE
      function testerAlerteMessagerie(canal) {
        const tel = document
          .getElementById("input-telephone-suivi")
          .value.trim();
        const toast = document.createElement("div");
        toast.className =
          "fixed bottom-5 right-5 z-50 max-w-sm w-full p-4 rounded-2xl shadow-2xl border text-xs animate-[bounce_0.5s_ease-out] flex items-start gap-3 bg-white";

        if (canal === "WhatsApp") {
          toast.classList.add("border-emerald-500");
          toast.innerHTML = `
          <div class="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-lg flex-shrink-0">💬</div>
          <div class="flex-grow">
            <div class="flex items-center justify-between">
              <span class="font-black text-emerald-900">Notification WhatsApp Détectée</span>
              <span class="text-[10px] text-slate-400">À l'instant</span>
            </div>
            <p class="text-slate-600 mt-1">
              Message certifié BUNEC délivré au <strong>+237 ${tel}</strong> : <em>« Votre suivi de dossier d'état civil a été activé avec succès. »</em>
            </p>
          </div>
        `;
        } else {
          toast.classList.add("border-sky-500");
          toast.innerHTML = `
          <div class="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center text-lg flex-shrink-0">✈️</div>
          <div class="flex-grow">
            <div class="flex items-center justify-between">
              <span class="font-black text-sky-900">Notification Telegram Détectée</span>
              <span class="text-[10px] text-slate-400">À l'instant</span>
            </div>
            <p class="text-slate-600 mt-1">
              Canal Bot <strong>@BUNEC_Suivi_Bot</strong> synchronisé avec le numéro <strong>+237 ${tel}</strong> pour convocations judiciaires.
            </p>
          </div>
        `;
        }

        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 4500);
      }

      // ========================================================================
      // FORMATS CIVILS AUTHENTIQUES (LOI N° 2011/011 DU CAMEROUN)
      // ========================================================================
      const REFERENTIEL_ACTES_CIVILS = {
        ACTE_NAISSANCE: {
          code: "ACTE_NAISSANCE",
          titre: "EXTRAIT D'ACTE DE NAISSANCE / BIRTH CERTIFICATE EXTRACT",
          sousTitre:
            "Délivré en application de l'Article 18 de la Loi N° 2011/011 du 6 mai 2011 modifiant et complétant certaines dispositions de l'Ordonnance n° 81-02 portant organisation de l'état civil.",
          numero: "001249 / 2026",
          volet: "Volet N° 1 (Titulaire)",
          volumeFolio: "Vol. 01 / Fol. 042",
          idnum: "CMR-2026-CE-YA1-NAI-001249",
          mentionsMarginales:
            "Néant à la date de délivrance du présent extrait d'acte de naissance certifié conforme.",
          htmlContenu: `
          <div class="border border-slate-300 rounded-xl overflow-hidden shadow-xs">
            <div class="bg-emerald-900/10 px-4 py-2 border-b border-slate-300 flex items-center justify-between">
              <span class="font-black text-emerald-950 uppercase text-xs">Section I — Informations de l'Enfant / Child's Particulars</span>
              <span class="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">Sexe : MASCULIN</span>
            </div>
            <div class="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white text-xs">
              <div>
                <span class="text-slate-500 font-bold block text-[10px] uppercase">Nom(s) et Prénom(s) :</span>
                <span class="text-sm font-black text-slate-900">TCHOUA MBALLA Christian Lionel</span>
              </div>
              <div>
                <span class="text-slate-500 font-bold block text-[10px] uppercase">Date de Naissance :</span>
                <span class="font-bold text-slate-900">Le quinze août deux mille vingt-six (15/08/2026)</span>
              </div>
              <div>
                <span class="text-slate-500 font-bold block text-[10px] uppercase">Heure de Naissance :</span>
                <span class="font-bold text-slate-800">À quatorze heures trente minutes (14h30)</span>
              </div>
              <div>
                <span class="text-slate-500 font-bold block text-[10px] uppercase">Lieu de Naissance :</span>
                <span class="font-bold text-slate-800">Maternité de l'Hôpital Central de Yaoundé</span>
              </div>
            </div>
          </div>

          <div class="border border-slate-300 rounded-xl overflow-hidden shadow-xs">
            <div class="bg-slate-100 px-4 py-2 border-b border-slate-300">
              <span class="font-black text-slate-900 uppercase text-xs">Section II — Filiation Légale / Parents' Particulars</span>
            </div>
            <div class="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white text-xs">
              <div class="space-y-1 pr-0 sm:pr-3 sm:border-r border-slate-200">
                <span class="font-black text-emerald-900 block uppercase text-[11px]">PÈRE / FATHER :</span>
                <p><span class="text-slate-500 font-bold">Nom :</span> <strong class="text-slate-900">MBALLA Jean-Baptiste</strong></p>
                <p><span class="text-slate-500 font-bold">Né le :</span> 12/03/1988 à Yaoundé</p>
                <p><span class="text-slate-500 font-bold">Nationalité :</span> Camerounaise</p>
                <p><span class="text-slate-500 font-bold">Profession :</span> Ingénieur des Travaux Informatiques</p>
                <p><span class="text-slate-500 font-bold">Domicile :</span> Yaoundé - Quartier Bastos</p>
                <p><span class="text-slate-500 font-bold">CNI N° :</span> 118472910 délivrée le 10/01/2021</p>
              </div>

              <div class="space-y-1">
                <span class="font-black text-emerald-900 block uppercase text-[11px]">MÈRE / MOTHER :</span>
                <p><span class="text-slate-500 font-bold">Nom :</span> <strong class="text-slate-900">NGO TCHOUA épse MBALLA Marie Madeleine</strong></p>
                <p><span class="text-slate-500 font-bold">Née le :</span> 04/09/1992 à Edéa</p>
                <p><span class="text-slate-500 font-bold">Nationalité :</span> Camerounaise</p>
                <p><span class="text-slate-500 font-bold">Profession :</span> Enseignante des Lycées</p>
                <p><span class="text-slate-500 font-bold">Domicile :</span> Yaoundé - Quartier Bastos</p>
                <p><span class="text-slate-500 font-bold">CNI N° :</span> 201948291 délivrée le 03/05/2022</p>
              </div>
            </div>
          </div>

          <div class="border border-slate-300 rounded-xl overflow-hidden shadow-xs">
            <div class="bg-slate-100 px-4 py-2 border-b border-slate-300">
              <span class="font-black text-slate-900 uppercase text-xs">Section III — Déclaration & Témoins Légaux / Informant & Witnesses</span>
            </div>
            <div class="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white text-xs">
              <div>
                <span class="text-slate-500 font-bold block text-[10px] uppercase">Déclarant :</span>
                <span class="font-bold text-slate-800">Le Père (Sieur MBALLA Jean-Baptiste) sur présentation du certificat médical de naissance n° HCY/2026/0928</span>
              </div>
              <div>
                <span class="text-slate-500 font-bold block text-[10px] uppercase">Date de la Déclaration :</span>
                <span class="font-bold text-slate-800">Le vingt-cinq août deux mille vingt-six (25/08/2026)</span>
              </div>
              <div class="sm:col-span-2 pt-1 border-t border-slate-100">
                <span class="text-slate-500 font-bold block text-[10px] uppercase">Témoins instrumentaires :</span>
                <span class="text-slate-700">1. Sieur OWONA Paul (Juriste, Yaoundé) • 2. Dame ATANGANA Suzanne (Commerçante, Yaoundé)</span>
              </div>
            </div>
          </div>
        `,
        },

        ACTE_MARIAGE: {
          code: "ACTE_MARIAGE",
          titre: "EXTRAIT D'ACTE DE MARIAGE / MARRIAGE CERTIFICATE EXTRACT",
          sousTitre:
            "Délivré en application des Articles 47 et suivants de la Loi N° 2011/011 régissant l'état civil et des dispositions applicables du Code Civil camerounais.",
          numero: "000418 / 2026",
          volet: "Volet N° 1 (Époux)",
          volumeFolio: "Vol. 01 / Fol. 029",
          idnum: "CMR-2026-CE-YA1-MAR-000418",
          mentionsMarginales:
            "Publication des bans légaux effectuée du 10/08/2026 au 25/08/2026 sans opposition notifiée.",
          htmlContenu: `
          <div class="border border-slate-300 rounded-xl overflow-hidden shadow-xs">
            <div class="bg-blue-900/10 px-4 py-2 border-b border-slate-300 flex items-center justify-between">
              <span class="font-black text-blue-950 uppercase text-xs">Section I — Renseignements sur les Époux / Spouses' Particulars</span>
              <span class="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">Régime : MONOGAMIE / BIENS COMMUNS</span>
            </div>
            <div class="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white text-xs">
              <div class="space-y-1 pr-0 sm:pr-3 sm:border-r border-slate-200">
                <span class="font-black text-blue-900 block uppercase text-[11px]">L'ÉPOUX / HUSBAND :</span>
                <p><span class="text-slate-500 font-bold">Nom(s) :</span> <strong class="text-slate-900 text-sm">EBELLE Samuel</strong></p>
                <p><span class="text-slate-500 font-bold">Né le :</span> 14/11/1985 à Douala (Littoral)</p>
                <p><span class="text-slate-500 font-bold">Profession :</span> Cadre Bancaire Financier</p>
                <p><span class="text-slate-500 font-bold">Domicile :</span> Yaoundé - Dragages</p>
                <p><span class="text-slate-500 font-bold">Fils de :</span> EBELLE Jacques et de DISSAKE Jeanne</p>
                <p><span class="text-slate-500 font-bold">CNI N° :</span> 109283741 délivrée le 14/02/2020</p>
              </div>

              <div class="space-y-1">
                <span class="font-black text-blue-900 block uppercase text-[11px]">L'ÉPOUSE / WIFE :</span>
                <p><span class="text-slate-500 font-bold">Nom(s) :</span> <strong class="text-slate-900 text-sm">NGONO Clarisse</strong></p>
                <p><span class="text-slate-500 font-bold">Née le :</span> 22/07/1990 à Yaoundé (Centre)</p>
                <p><span class="text-slate-500 font-bold">Profession :</span> Médecin Spécialiste</p>
                <p><span class="text-slate-500 font-bold">Domicile :</span> Yaoundé - Bastos</p>
                <p><span class="text-slate-500 font-bold">Fille de :</span> NGONO Ferdinand et de BILO'O Christine</p>
                <p><span class="text-slate-500 font-bold">CNI N° :</span> 200394812 délivrée le 19/08/2021</p>
              </div>
            </div>
          </div>

          <div class="border border-slate-300 rounded-xl overflow-hidden shadow-xs">
            <div class="bg-slate-100 px-4 py-2 border-b border-slate-300">
              <span class="font-black text-slate-900 uppercase text-xs">Section II — Célébration Matrimoniale & Accord Légal</span>
            </div>
            <div class="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white text-xs">
              <div>
                <span class="text-slate-500 font-bold block text-[10px] uppercase">Date de la Célébration :</span>
                <span class="font-bold text-slate-900">Le vingt-sept août deux mille vingt-six (27/08/2026) à 11h00</span>
              </div>
              <div>
                <span class="text-slate-500 font-bold block text-[10px] uppercase">Lieu de la Célébration :</span>
                <span class="font-bold text-slate-800">Salle des Actes de l'Hôtel de Ville de Yaoundé Iᵉʳ</span>
              </div>
              <div>
                <span class="text-slate-500 font-bold block text-[10px] uppercase">Option Matrimoniale :</span>
                <span class="font-black text-blue-950">MONOGAMIE (Consentement mutuel et irrévocable)</span>
              </div>
              <div>
                <span class="text-slate-500 font-bold block text-[10px] uppercase">Régime des Biens :</span>
                <span class="font-black text-blue-950">COMMUNAUTÉ DES BIENS</span>
              </div>
            </div>
          </div>

          <div class="border border-slate-300 rounded-xl overflow-hidden shadow-xs">
            <div class="bg-slate-100 px-4 py-2 border-b border-slate-300">
              <span class="font-black text-slate-900 uppercase text-xs">Section III — Témoins Instrumentaires du Mariage</span>
            </div>
            <div class="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white text-xs">
              <div>
                <span class="text-slate-500 font-bold block text-[10px] uppercase">Témoin de l'Époux :</span>
                <span class="font-bold text-slate-800">Sieur EKOLLO Paul (Directeur Commercial, CNI n° 110293847)</span>
              </div>
              <div>
                <span class="text-slate-500 font-bold block text-[10px] uppercase">Témoin de l'Épouse :</span>
                <span class="font-bold text-slate-800">Dame ABENA Marie-Gisèle (Pharmacienne, CNI n° 201192834)</span>
              </div>
            </div>
          </div>
        `,
        },

        ACTE_DECES: {
          code: "ACTE_DECES",
          titre: "EXTRAIT D'ACTE DE DÉCÈS / DEATH CERTIFICATE EXTRACT",
          sousTitre:
            "Délivré en application des Articles 67 et suivants de la Loi N° 2011/011 du 6 mai 2011 régissant l'état civil en République du Cameroun.",
          numero: "000105 / 2026",
          volet: "Volet N° 1 (Famille / Ayants droit)",
          volumeFolio: "Vol. 01 / Fol. 012",
          idnum: "CMR-2026-CE-YA1-DEC-000105",
          mentionsMarginales:
            "Certificat médical de constatation de décès légal dressé par autorité médicale assermentée.",
          htmlContenu: `
          <div class="border border-slate-300 rounded-xl overflow-hidden shadow-xs">
            <div class="bg-slate-800/10 px-4 py-2 border-b border-slate-300 flex items-center justify-between">
              <span class="font-black text-slate-950 uppercase text-xs">Section I — Identité du Défunt / Deceased's Particulars</span>
              <span class="text-[10px] font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded">Sexe : MASCULIN</span>
            </div>
            <div class="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white text-xs">
              <div>
                <span class="text-slate-500 font-bold block text-[10px] uppercase">Nom(s) et Prénom(s) :</span>
                <span class="text-sm font-black text-slate-900">FOTSO Émile</span>
              </div>
              <div>
                <span class="text-slate-500 font-bold block text-[10px] uppercase">Date & Lieu de Naissance :</span>
                <span class="font-bold text-slate-800">12/04/1954 à Bandjoun (Ouest)</span>
              </div>
              <div>
                <span class="text-slate-500 font-bold block text-[10px] uppercase">Âge au Décès :</span>
                <span class="font-bold text-slate-800">72 ans</span>
              </div>
              <div>
                <span class="text-slate-500 font-bold block text-[10px] uppercase">Profession & Nationalité :</span>
                <span class="font-bold text-slate-800">Commerçant retraité • Camerounaise</span>
              </div>
              <div>
                <span class="text-slate-500 font-bold block text-[10px] uppercase">Dernier Domicile :</span>
                <span class="font-bold text-slate-800">Yaoundé Iᵉʳ - Quartier Nlongkak</span>
              </div>
              <div>
                <span class="text-slate-500 font-bold block text-[10px] uppercase">État Matrimonial :</span>
                <span class="font-bold text-slate-800">Marié sous le régime de la monogamie</span>
              </div>
            </div>
          </div>

          <div class="border border-slate-300 rounded-xl overflow-hidden shadow-xs">
            <div class="bg-slate-100 px-4 py-2 border-b border-slate-300">
              <span class="font-black text-slate-900 uppercase text-xs">Section II — Constatation du Décès & Certificat Médical</span>
            </div>
            <div class="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white text-xs">
              <div>
                <span class="text-slate-500 font-bold block text-[10px] uppercase">Date et Heure du Décès :</span>
                <span class="font-bold text-slate-900">Le dix août deux mille vingt-six (10/08/2026) à 06h15</span>
              </div>
              <div>
                <span class="text-slate-500 font-bold block text-[10px] uppercase">Lieu du Décès :</span>
                <span class="font-bold text-slate-800">Hôpital Général de Yaoundé (HGY)</span>
              </div>
              <div class="sm:col-span-2 pt-1 border-t border-slate-100">
                <span class="text-slate-500 font-bold block text-[10px] uppercase">Constatation Médicale :</span>
                <span class="text-slate-700">Certificat de genre de mort N° CM/2026/0819 dressé par le Dr. NDONGO Albert, Médecin Chef de Service.</span>
              </div>
            </div>
          </div>

          <div class="border border-slate-300 rounded-xl overflow-hidden shadow-xs">
            <div class="bg-slate-100 px-4 py-2 border-b border-slate-300">
              <span class="font-black text-slate-900 uppercase text-xs">Section III — Déclarant du Décès</span>
            </div>
            <div class="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white text-xs">
              <div>
                <span class="text-slate-500 font-bold block text-[10px] uppercase">Identité du Déclarant :</span>
                <span class="font-bold text-slate-900">Sieur FOTSO KAMGA Alain (Fils majeur du défunt)</span>
              </div>
              <div>
                <span class="text-slate-500 font-bold block text-[10px] uppercase">Date de Déclaration :</span>
                <span class="font-bold text-slate-800">Le douze août deux mille vingt-six (12/08/2026)</span>
              </div>
            </div>
          </div>
        `,
        },

        DECLARATION_TARDIVE_JUGEMENT_SUPPLETIF: {
          code: "DECLARATION_TARDIVE_JUGEMENT_SUPPLETIF",
          titre:
            "JUGEMENT SUPPLÉTIF TENANT LIEU D'ACTE D'ÉTAT CIVIL / DECLARATORY JUDGMENT",
          sousTitre:
            "Transcription de Décision Judiciaire rendue en audience publique par le Tribunal de Première Instance (TPI) conformément aux Articles 22 à 25 de la Loi N° 2011/011.",
          numero: "000072 / 2026 (Ordonnance TPI n° 88/CIV)",
          volet: "Transcription Légale (Registre Supplétif)",
          volumeFolio: "Vol. Supplétif D / Fol. 008",
          idnum: "CMR-2026-CE-YA1-JUG-000072",
          mentionsMarginales:
            "Transcription ordonnée par jugement civil contradictoire coulé en force de chose jugée (Certificat de non-appel n° 314/2026).",
          htmlContenu: `
          <div class="border border-slate-300 rounded-xl overflow-hidden shadow-xs">
            <div class="bg-purple-900/10 px-4 py-2 border-b border-slate-300 flex items-center justify-between">
              <span class="font-black text-purple-950 uppercase text-xs">Section I — Décision Judiciaire / Court Decision</span>
              <span class="text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">TPI DE YAOUNDÉ - CENTRE</span>
            </div>
            <div class="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white text-xs">
              <div>
                <span class="text-slate-500 font-bold block text-[10px] uppercase">Juridiction Compétente :</span>
                <span class="text-sm font-black text-slate-900">Tribunal de Première Instance de Yaoundé</span>
              </div>
              <div>
                <span class="text-slate-500 font-bold block text-[10px] uppercase">Réf. Jugement / Ordonnance :</span>
                <span class="font-bold text-purple-950 font-mono">Jugement Civil N° 88/CIV du 14/06/2026</span>
              </div>
              <div>
                <span class="text-slate-500 font-bold block text-[10px] uppercase">Composition du Tribunal :</span>
                <span class="font-bold text-slate-800">M. le Juge Président du Tribunal, assisté du Greffier en chef</span>
              </div>
              <div>
                <span class="text-slate-500 font-bold block text-[10px] uppercase">Requérant Légitime :</span>
                <span class="font-bold text-slate-800">Sieur KAMDEM Joseph (CNI N° 108392019)</span>
              </div>
            </div>
          </div>

          <div class="border border-slate-300 rounded-xl overflow-hidden shadow-xs">
            <div class="bg-slate-100 px-4 py-2 border-b border-slate-300">
              <span class="font-black text-slate-900 uppercase text-xs">Section II — Dispositif Souverain du Tribunal</span>
            </div>
            <div class="p-4 bg-white text-xs space-y-2 leading-relaxed">
              <p class="font-serif italic text-slate-800 border-l-4 border-purple-600 pl-3">
                « LE TRIBUNAL, statuant publiquement, contradictoirement à l'égard de toutes les parties, en premier ressort et en matière d'état civil :<br>
                Vu la requête présentée aux fins de reconstitution d'acte de naissance ;<br>
                Vu le rapport d'enquête de moralité et l'avis favorable du Ministère Public ;<br>
                <strong>ORDONNE</strong> la transcription sur les registres d'état civil de la Commune de Yaoundé Iᵉʳ de la naissance de :<br>
                <span class="text-sm font-black font-sans not-italic text-slate-950">KAMDEM Joseph</span>, né le <strong>18 mai 1996 à Yaoundé</strong>, de sexe masculin, de nationalité camerounaise, de feu KAMDEM Pierre et de MEKONTCHOU Suzanne. »
              </p>
            </div>
          </div>

          <div class="border border-slate-300 rounded-xl overflow-hidden shadow-xs">
            <div class="bg-slate-100 px-4 py-2 border-b border-slate-300">
              <span class="font-black text-slate-900 uppercase text-xs">Section III — Transcription Municipale & Enregistrement BUNEC</span>
            </div>
            <div class="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white text-xs">
              <div>
                <span class="text-slate-500 font-bold block text-[10px] uppercase">Centre d'Enregistrement :</span>
                <span class="font-bold text-slate-900">Centre Principal d'État Civil de Yaoundé Iᵉʳ</span>
              </div>
              <div>
                <span class="text-slate-500 font-bold block text-[10px] uppercase">Date de Transcription :</span>
                <span class="font-bold text-slate-800">Le vingt-cinq août deux mille vingt-six (25/08/2026)</span>
              </div>
            </div>
          </div>
        `,
        },
      };

      // Changement de format d'acte civil
      function choisirFormatActeCivil(typeKey, dossierForce) {
        const targetDossier = dossierForce || dossierActuellementCorrespondant;

        const btnNaissance = document.getElementById("btn-format-naissance");
        const btnMariage = document.getElementById("btn-format-mariage");
        const btnDeces = document.getElementById("btn-format-deces");
        const btnJugement = document.getElementById("btn-format-jugement");

        const styleActif =
          "px-3.5 py-3 rounded-xl border-2 font-black text-xs transition flex items-center justify-center gap-2 bg-emerald-50 border-emerald-600 text-emerald-950 shadow-xs";
        const styleInactif =
          "px-3.5 py-3 rounded-xl border-2 font-bold text-xs transition flex items-center justify-center gap-2 bg-white border-slate-200 text-slate-700 hover:border-slate-300";

        if (btnNaissance)
          btnNaissance.className =
            typeKey === "ACTE_NAISSANCE" ? styleActif : styleInactif;
        if (btnMariage)
          btnMariage.className =
            typeKey === "ACTE_MARIAGE" ? styleActif : styleInactif;
        if (btnDeces)
          btnDeces.className =
            typeKey === "ACTE_DECES" ? styleActif : styleInactif;
        if (btnJugement)
          btnJugement.className =
            typeKey === "DECLARATION_TARDIVE_JUGEMENT_SUPPLETIF"
              ? styleActif
              : styleInactif;

        const elNum = document.getElementById("acte-ref-numero");
        const elVolet = document.getElementById("acte-ref-volet");
        const elVolume = document.getElementById("acte-ref-volume");
        const elIdnum = document.getElementById("acte-ref-idnum");
        const elTitre = document.getElementById("acte-titre-principal");
        const elSousTitre = document.getElementById("acte-sous-titre-loi");
        const elMentions = document.getElementById("acte-mentions-marginales");
        const elContenu = document.getElementById(
          "contenu-acte-civil-dynamique",
        );

        // Éléments d'en-tête et signatures
        const enteteRegFr = document.getElementById("entete-region-fr");
        const enteteDeptFr = document.getElementById("entete-dept-fr");
        const enteteComFr = document.getElementById("entete-commune-fr");
        const enteteCentFr = document.getElementById("entete-centre-fr");

        const enteteRegEn = document.getElementById("entete-region-en");
        const enteteDeptEn = document.getElementById("entete-dept-en");
        const enteteComEn = document.getElementById("entete-commune-en");
        const enteteCentEn = document.getElementById("entete-centre-en");

        const elFaitA = document.getElementById("acte-fait-a");
        const elFaitLe = document.getElementById("acte-fait-le");
        const elNomOfficier = document.getElementById("acte-nom-officier");
        const blockSecretaire = document.getElementById(
          "acte-secretaire-block",
        );
        const elNomSecretaire = document.getElementById("acte-nom-secretaire");
        const elTamponCom = document.getElementById("acte-tampon-commune");
        const elTamponCent = document.getElementById("acte-tampon-centre");
        const elSigOfficier = document.getElementById(
          "acte-signature-officier",
        );

        // 1. Cas d'un dossier sélectionné avec données civiles spécifiques authentiques
        if (
          targetDossier &&
          targetDossier.typeActe === typeKey &&
          targetDossier.donneesActeCivil
        ) {
          const dCivil = targetDossier.donneesActeCivil;

          if (elNum) elNum.textContent = dCivil.numeroActe;
          if (elVolet)
            elVolet.textContent = dCivil.volet || "Volet N° 1 (Titulaire)";
          if (elVolume)
            elVolume.textContent =
              dCivil.volumeFolio || "Vol. 2019 / Fol. 0731";
          if (elIdnum) elIdnum.textContent = dCivil.identifiantBUNEC;
          if (elTitre) elTitre.textContent = dCivil.titrePrincipal;
          if (elSousTitre) elSousTitre.textContent = dCivil.sousTitreLoi;
          if (elMentions) elMentions.textContent = dCivil.mentionsMarginales;

          if (enteteRegFr) enteteRegFr.textContent = dCivil.regionFr;
          if (enteteDeptFr) enteteDeptFr.textContent = dCivil.departementFr;
          if (enteteComFr) enteteComFr.textContent = dCivil.communeFr;
          if (enteteCentFr) enteteCentFr.textContent = dCivil.centreFr;

          if (enteteRegEn) enteteRegEn.textContent = dCivil.regionEn;
          if (enteteDeptEn) enteteDeptEn.textContent = dCivil.departementEn;
          if (enteteComEn) enteteComEn.textContent = dCivil.communeEn;
          if (enteteCentEn) enteteCentEn.textContent = dCivil.centreEn;

          if (elFaitA) elFaitA.textContent = dCivil.certification.faitA;
          if (elFaitLe) elFaitLe.textContent = dCivil.certification.faitLe;
          if (elNomOfficier)
            elNomOfficier.textContent = `${dCivil.certification.officierNom} (${dCivil.certification.officierQualite})`;

          if (blockSecretaire && elNomSecretaire) {
            if (dCivil.certification.secretaireNom) {
              blockSecretaire.classList.remove("hidden");
              elNomSecretaire.textContent = `${dCivil.certification.secretaireNom} (${dCivil.certification.secretaireQualite})`;
            } else {
              blockSecretaire.classList.add("hidden");
            }
          }

          if (elTamponCom) elTamponCom.textContent = dCivil.communeFr;
          if (elTamponCent) elTamponCent.textContent = dCivil.centreFr;
          if (elSigOfficier)
            elSigOfficier.textContent = dCivil.certification.signatureNom;

          if (elContenu) {
            elContenu.innerHTML = `
            <div class="border border-slate-300 rounded-xl overflow-hidden shadow-xs">
              <div class="bg-emerald-900/10 px-4 py-2 border-b border-slate-300 flex items-center justify-between">
                <span class="font-black text-emerald-950 uppercase text-xs">Section I — Informations de l'Enfant / Child's Particulars</span>
                <span class="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">Sexe : ${dCivil.enfant.sexe}</span>
              </div>
              <div class="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white text-xs">
                <div class="sm:col-span-2">
                  <span class="text-slate-500 font-bold block text-[10px] uppercase">Nom(s) et Prénom(s) / Full Name :</span>
                  <span class="text-base font-black text-slate-900">${dCivil.enfant.nomComplet}</span>
                </div>
                <div>
                  <span class="text-slate-500 font-bold block text-[10px] uppercase">Date de Naissance / Date of Birth :</span>
                  <span class="font-bold text-slate-900">${dCivil.enfant.dateNaissanceTexte}</span>
                </div>
                <div>
                  <span class="text-slate-500 font-bold block text-[10px] uppercase">Lieu de Naissance / Place of Birth :</span>
                  <span class="font-bold text-slate-800">${dCivil.enfant.lieuNaissance}</span>
                </div>
              </div>
            </div>

            <div class="border border-slate-300 rounded-xl overflow-hidden shadow-xs">
              <div class="bg-slate-100 px-4 py-2 border-b border-slate-300">
                <span class="font-black text-slate-900 uppercase text-xs">Section II — Filiation Légale / Parents' Particulars</span>
              </div>
              <div class="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white text-xs">
                <div class="space-y-1 pr-0 sm:pr-3 sm:border-r border-slate-200">
                  <span class="font-black text-emerald-900 block uppercase text-[11px]">PÈRE / FATHER :</span>
                  <p><span class="text-slate-500 font-bold">Nom :</span> <strong class="text-slate-900">${dCivil.pere.nomComplet}</strong></p>
                  <p><span class="text-slate-500 font-bold">Né à :</span> ${dCivil.pere.lieuNaissance}</p>
                  <p><span class="text-slate-500 font-bold">Nationalité :</span> ${dCivil.pere.nationalite}</p>
                  <p><span class="text-slate-500 font-bold">Profession :</span> ${dCivil.pere.profession}</p>
                  <p><span class="text-slate-500 font-bold">Domicile :</span> ${dCivil.pere.domicile}</p>
                </div>

                <div class="space-y-1">
                  <span class="font-black text-emerald-900 block uppercase text-[11px]">MÈRE / MOTHER :</span>
                  <p><span class="text-slate-500 font-bold">Nom :</span> <strong class="text-slate-900">${dCivil.mere.nomComplet}</strong></p>
                  <p><span class="text-slate-500 font-bold">Née à :</span> ${dCivil.mere.lieuNaissance} ${dCivil.mere.dateNaissanceTexte ? "— " + dCivil.mere.dateNaissanceTexte : ""}</p>
                  <p><span class="text-slate-500 font-bold">Nationalité :</span> ${dCivil.mere.nationalite}</p>
                  <p><span class="text-slate-500 font-bold">Profession :</span> ${dCivil.mere.profession}</p>
                  <p><span class="text-slate-500 font-bold">Domicile :</span> ${dCivil.mere.domicile}</p>
                </div>
              </div>
            </div>

            <div class="border border-slate-300 rounded-xl overflow-hidden shadow-xs">
              <div class="bg-slate-100 px-4 py-2 border-b border-slate-300">
                <span class="font-black text-slate-900 uppercase text-xs">Section III — Déclaration, Jugement & Signatures / Informant & Judgment</span>
              </div>
              <div class="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white text-xs">
                <div class="sm:col-span-2">
                  <span class="text-slate-500 font-bold block text-[10px] uppercase">Référence Déclaration / Jugement :</span>
                  <span class="font-bold text-slate-900 text-xs">${dCivil.declaration.texteJugement}</span>
                </div>
                <div>
                  <span class="text-slate-500 font-bold block text-[10px] uppercase">Date de Rédaction / Dressé le :</span>
                  <span class="font-bold text-slate-800">${dCivil.declaration.dateTexte}</span>
                </div>
                <div>
                  <span class="text-slate-500 font-bold block text-[10px] uppercase">Déclarants :</span>
                  <span class="text-slate-800 font-semibold">${dCivil.declaration.declarants}</span>
                </div>
              </div>
            </div>
          `;
          }
          return;
        }

        // 2. Format standard / modèle de référence pour les autres types d'actes
        const config =
          REFERENTIEL_ACTES_CIVILS[typeKey] ||
          REFERENTIEL_ACTES_CIVILS.ACTE_NAISSANCE;

        if (elNum) elNum.textContent = config.numero;
        if (elVolet)
          elVolet.textContent = config.volet || "Volet N° 1 (Titulaire)";
        if (elVolume)
          elVolume.textContent = config.volumeFolio || "Vol. 01 / Fol. 042";
        if (elIdnum) elIdnum.textContent = config.idnum;
        if (elTitre) elTitre.textContent = config.titre;
        if (elSousTitre) elSousTitre.textContent = config.sousTitre;
        if (elMentions) elMentions.textContent = config.mentionsMarginales;
        if (elContenu) elContenu.innerHTML = config.htmlContenu;

        if (enteteRegFr) enteteRegFr.textContent = "RÉGION DU CENTRE";
        if (enteteDeptFr) enteteDeptFr.textContent = "DÉPARTEMENT DU MFOUNDI";
        if (enteteComFr) enteteComFr.textContent = "COMMUNE DE YAOUNDÉ Iᵉʳ";
        if (enteteCentFr)
          enteteCentFr.textContent = "CENTRE PRINCIPAL D'ÉTAT CIVIL";

        if (enteteRegEn) enteteRegEn.textContent = "CENTRE REGION";
        if (enteteDeptEn) enteteDeptEn.textContent = "MFOUNDI DIVISION";
        if (enteteComEn) enteteComEn.textContent = "YAOUNDE I COUNCIL";
        if (enteteCentEn)
          enteteCentEn.textContent = "MAIN CIVIL STATUS REGISTRY";

        if (elFaitA) elFaitA.textContent = "Yaoundé";
        if (elFaitLe) elFaitLe.textContent = "25 août 2026";
        if (elNomOfficier)
          elNomOfficier.textContent = "M. le Maire / Officier Titulaire";
        if (blockSecretaire) blockSecretaire.classList.add("hidden");
        if (elTamponCom) elTamponCom.textContent = "MAIRIE DE YAOUNDÉ I";
        if (elTamponCent) elTamponCent.textContent = "CENTRE PRINCIPAL";
        if (elSigOfficier) elSigOfficier.textContent = "E. Mballa";
      }

      // ========================================================================
      // LOGIQUE DE DÉBLOCAGE DU BON À TIRER (BAT) CITOYEN
      // ========================================================================
      function actualiserAffichageBAT() {
        const blocBAT = document.getElementById("bloc-visualisation-acte-bat");
        const etatVerrou = document.getElementById(
          "etat-verrouille-acte-civil",
        );
        const btnPrintTop = document.getElementById("btn-print-acte-top");
        const badgeVerrou = document.getElementById("badge-statut-verrou-acte");
        const messageDetailVerrou = document.getElementById(
          "message-detail-verrou",
        );
        const checkEtape2 = document.getElementById("check-etape2-bat");
        const checkEtape3 = document.getElementById("check-etape3-bat");
        const checkEtape4 = document.getElementById("check-etape4-bat");

        // Le Bon à Tirer (BAT) ne s'affiche que si le processus est terminé ET notification reçue
        const estDebloque = dossierTermine && notificationRetraitRecue;

        if (estDebloque) {
          if (blocBAT) blocBAT.classList.remove("hidden");
          if (etatVerrou) etatVerrou.classList.add("hidden");
          if (btnPrintTop) btnPrintTop.classList.remove("hidden");
        } else {
          if (blocBAT) blocBAT.classList.add("hidden");
          if (etatVerrou) etatVerrou.classList.remove("hidden");
          if (btnPrintTop) btnPrintTop.classList.add("hidden");

          // Mise à jour de la checklist selon simulatedColorCode
          if (simulatedColorCode === "red") {
            if (badgeVerrou) {
              badgeVerrou.className =
                "text-[10px] font-black px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300";
              badgeVerrou.textContent = "Dossier Rejeté / Bloqué";
            }
            if (checkEtape2) checkEtape2.innerHTML = "✕";
            if (checkEtape2)
              checkEtape2.className =
                "w-5 h-5 rounded-full bg-rose-600 text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0";
            if (checkEtape3) checkEtape3.innerHTML = "3";
            if (checkEtape3)
              checkEtape3.className =
                "w-5 h-5 rounded-full bg-slate-200 text-slate-500 font-bold text-[10px] flex items-center justify-center flex-shrink-0";
            if (messageDetailVerrou) {
              messageDetailVerrou.className =
                "mt-3 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-950 space-y-1";
              messageDetailVerrou.innerHTML = `
              <p class="font-bold flex items-center gap-1.5 text-rose-950">
                <span>⚠️</span>
                <span>Statut actuel : Dossier Bloqué pour anomalie documentaire</span>
              </p>
              <p class="text-[11px] text-rose-800">
                Le Bon à Tirer (BAT) ne peut être émis. Une discordance de pièces justificatives a été constatée. Présentez-vous au guichet n° 02 muni des pièces originales pour régularisation.
              </p>
            `;
            }
          } else {
            if (badgeVerrou) {
              badgeVerrou.className =
                "text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300";
              badgeVerrou.textContent = "Instruction en cours";
            }
            if (checkEtape2) checkEtape2.innerHTML = "✓";
            if (checkEtape2)
              checkEtape2.className =
                "w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0";
            if (checkEtape3) checkEtape3.innerHTML = "⏳";
            if (checkEtape3)
              checkEtape3.className =
                "w-5 h-5 rounded-full bg-amber-500 text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0 animate-pulse";
            if (messageDetailVerrou) {
              messageDetailVerrou.className =
                "mt-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 space-y-1";
              messageDetailVerrou.innerHTML = `
              <p class="font-bold flex items-center gap-1.5">
                <span>ℹ️</span>
                <span>Statut actuel : En cours de validation administrative</span>
              </p>
              <p class="text-[11px] text-slate-600">
                Votre dossier est en cours de traitement. Dès signature définitive par M. le Maire et envoi de la convocation de retrait par SMS/WhatsApp, votre Bon à Tirer (BAT) sera automatiquement consultable.
              </p>
            `;
            }
          }
        }
      }

      function normaliserSaisieSuivi(value) {
        const raw = String(value || "").trim();
        if (!raw) return "";

        const normalized = raw
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[\u0000-\u001F\u007F]/g, " ")
          .replace(/\s+/g, " ")
          .replace(/[<>"'`]/g, "")
          .trim();

        if (!normalized) return "";
        return normalized.toUpperCase();
      }

      function ouvrirModalSignalementBAT() {
        const modal = document.getElementById("modal-signalement-bat");
        if (modal) {
          modal.classList.remove("hidden");
          setTimeout(() => {
            const field = document.getElementById("signalement-bat-detail");
            if (field) field.focus();
          }, 100);
        }
      }

      function soumettreSignalementBAT(event) {
        event.preventDefault();

        const type =
          document.getElementById("signalement-bat-type")?.value || "autre";
        const detail =
          document.getElementById("signalement-bat-detail")?.value || "";
        const dossierRef =
          dossierActuellementCorrespondant?.numeroDeclaration ||
          "Dossier non identifié";

        if (!detail.trim()) {
          alert("Veuillez préciser l’erreur à signaler.");
          return;
        }

        const signalement = {
          id: `bat-signal-${Date.now()}`,
          dossierRef,
          type,
          detail: detail.trim(),
          statut: "EN_COURS_DE_TRAITEMENT",
          date: new Date().toISOString(),
        };

        signalementsBat = [signalement, ...signalementsBat].slice(0, 40);
        localStorage.setItem(
          "bunec_signalements_bat",
          JSON.stringify(signalementsBat),
        );

        const field = document.getElementById("signalement-bat-detail");
        if (field) field.value = "";

        fermerModal("modal-signalement-bat");
        afficherNotificationToast(
          "✓ Signalement enregistré : le service BUNEC a bien reçu votre anomalie BAT.",
        );
      }

      // Consultation directe de l'acte au format civil depuis le suivi
      function consulterActeCivilDirect(typeCode) {
        if (!dossierTermine || !notificationRetraitRecue) {
          afficherAlerteBatVerrouille(simulatedColorCode);
          switchTab("dr");
          actualiserAffichageBAT();
          return;
        }
        choisirFormatActeCivil(typeCode);
        switchTab("dr");
        actualiserAffichageBAT();
        const docActe = document.getElementById("document-acte-civil-officiel");
        if (docActe) {
          setTimeout(() => {
            docActe.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 100);
        }
      }

      // Alerte pédagogique quand l'acte n'est pas encore prêt
      function afficherAlerteBatVerrouille(statut) {
        const toast = document.createElement("div");
        toast.className =
          "fixed bottom-5 right-5 z-50 max-w-md w-full p-4 rounded-2xl shadow-2xl border text-xs animate-[bounce_0.5s_ease-out] flex items-start gap-3 bg-white border-amber-400";
        toast.innerHTML = `
        <div class="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xl flex-shrink-0">🔒</div>
        <div class="flex-grow">
          <div class="flex items-center justify-between">
            <span class="font-black text-amber-950">Bon à Tirer (BAT) Non Débloqué</span>
            <span class="text-[10px] text-slate-400 font-mono">Loi N° 2011/011</span>
          </div>
          <p class="text-slate-600 mt-1 leading-relaxed">
            L'acte ne s'affiche que lorsque <strong>le processus est terminé</strong> et que la <strong>notification de retrait a été reçue</strong>. Votre dossier est actuellement ${statut === "red" ? "bloqué pour pièce rejetée" : "en cours d’instruction"}.
          </p>
          <div class="mt-2 flex items-center gap-2">
            <button type="button" onclick="this.closest('.fixed').remove(); switchTab('dr');" class="text-amber-800 font-black underline text-[11px] cursor-pointer">
              Voir les conditions réglementaires de déblocage →
            </button>
          </div>
        </div>
      `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 6000);
      }

      // Confirmation citoyenne du Bon à Tirer
      function validerBATCitoyen() {
        alert(
          "✓ Votre Bon à Tirer (BAT) est validé conforme !\n\nVous pouvez maintenant imprimer ou télécharger votre spécimen PDF en cliquant sur le bouton d’impression en haut. Présentez-vous ensuite au Guichet n° 03 muni de votre récépissé pour le retrait de l’acte original revêtu du timbre fiscal.",
        );
      }

      // Démonstration interactive des états du dossier (Vert, Orange, Rouge)
      function simulerEtatDossierPourTest(color) {
        simulatedColorCode = color;
        if (color === "green") {
          dossierTermine = true;
          notificationRetraitRecue = true;
        } else {
          dossierTermine = false;
          notificationRetraitRecue = false;
        }

        // Mettre à jour l'affichage de la recherche si elle est déjà lancée
        const placeholder = document.getElementById(
          "placeholder-avant-recherche",
        );
        if (placeholder && placeholder.classList.contains("hidden")) {
          rechercherMonDossierPrecis();
        }

        actualiserAffichageBAT();

        const toast = document.createElement("div");
        toast.className =
          "fixed top-5 right-5 z-50 p-4 rounded-2xl shadow-2xl border text-xs flex items-center gap-3 text-white " +
          (color === "green"
            ? "bg-emerald-900 border-emerald-400"
            : color === "amber"
              ? "bg-amber-900 border-amber-400"
              : "bg-rose-900 border-rose-400");
        toast.innerHTML =
          color === "green"
            ? "<span>✅</span><span>Notification de Retrait Reçue : Le <strong>Bon à Tirer (BAT)</strong> est maintenant débloqué !</span>"
            : color === "amber"
              ? "<span>⏳</span><span>Dossier en cours d’instruction : Le <strong>Bon à Tirer (BAT)</strong> est verrouillé.</span>"
              : "<span>❌</span><span>Dossier rejeté : L’acte et le BAT sont bloqués.</span>";
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 4500);
      }

      // ========================================================================
      // LOGIQUE DE L'ESPACE ADMINISTRATION CENTRALE (BUNEC / 333669)
      // ========================================================================
      function ouvrirEspaceAdmin() {
        if (sessionAdminActive) {
          switchTab("admin");
        } else {
          ouvrirModalAdminLogin();
        }
      }

      function ouvrirModalAdminLogin() {
        const modal = document.getElementById("modal-admin-login");
        const err = document.getElementById("erreur-admin-login");
        if (err) err.classList.add("hidden");
        if (modal) {
          modal.classList.remove("hidden");
          setTimeout(() => {
            const pwdInput = document.getElementById("input-admin-password");
            if (pwdInput) pwdInput.focus();
          }, 150);
        }
      }

      function fermerModalAdminLogin() {
        const modal = document.getElementById("modal-admin-login");
        if (modal) modal.classList.add("hidden");
      }

      function toggleAdminPasswordVisibility() {
        const pwdInput = document.getElementById("input-admin-password");
        const labelToggle = document.getElementById("label-toggle-pwd");
        if (!pwdInput) return;
        if (pwdInput.type === "password") {
          pwdInput.type = "text";
          if (labelToggle) labelToggle.textContent = "🙈 Masquer";
        } else {
          pwdInput.type = "password";
          if (labelToggle) labelToggle.textContent = "👁️ Afficher";
        }
      }

      async function connexionAdmin() {
        const usernameInput = document.getElementById("input-admin-username");
        const passwordInput = document.getElementById("input-admin-password");
        const errBox = document.getElementById("erreur-admin-login");

        const username = (usernameInput ? usernameInput.value : "").trim();
        const password = (passwordInput ? passwordInput.value : "").trim();

        // Tentative via API serveur avec repli synchrone sur bunec / 333669
        let authValide = false;
        try {
          const res = await fetch("/api/v1/auth/admin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
          });
          const data = await res.json();
          if (res.ok && data.success) {
            adminCsrfToken = data.csrfToken || "";
            sessionStorage.setItem("bunec_csrf_token", adminCsrfToken);
            authValide = true;
          }
        } catch (err) {
          console.error("Échec de connexion à l’API admin.", err);
        }

        if (authValide) {
          sessionAdminActive = true;
          sessionStorage.setItem("admin_auth_bunec", "true");

          fermerModalAdminLogin();

          // Notification toast de bienvenue admin
          const toast = document.createElement("div");
          toast.className =
            "fixed top-5 right-5 z-50 p-4 rounded-2xl shadow-2xl border text-xs bg-slate-900 text-white flex items-center gap-3 border-amber-400 animate-[fadeIn_0.3s_ease-out]";
          toast.innerHTML =
            "<span>🔐</span><span>Session Authentifiée : Bienvenue sur l’<strong>Espace Admin National BUNEC</strong>.</span>";
          document.body.appendChild(toast);
          setTimeout(() => toast.remove(), 4000);

          switchTab("admin");
          chargerHistoriqueAdmin();
        } else {
          if (errBox) {
            errBox.classList.remove("hidden");
            errBox.textContent =
              "Identifiant ou mot de passe invalide, ou service indisponible.";
          }
          if (passwordInput) {
            passwordInput.value = "";
            passwordInput.focus();
          }
        }
      }

      function deconnexionAdmin() {
        sessionAdminActive = false;
        sessionStorage.removeItem("admin_auth_bunec");
        sessionStorage.removeItem("bunec_csrf_token");
        adminCsrfToken = "";

        switchTab("suivi");

        const toast = document.createElement("div");
        toast.className =
          "fixed bottom-5 right-5 z-50 p-4 rounded-2xl shadow-2xl border text-xs bg-slate-900 text-white flex items-center gap-3 border-slate-700";
        toast.innerHTML =
          "<span>🚪</span><span>Session Administrateur déconnectée avec succès.</span>";
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
      }

      // Chargement de l'historique national
      async function chargerHistoriqueAdmin() {
        try {
          const res = await fetch("/api/v1/admin/historique");
          if (res.ok) {
            const data = await res.json();
            dossiersHistoriqueAdmin = data.dossiers || [];
          }
        } catch (err) {
          console.warn("Fallback local dossiers admin");
        }

        // Si le backend n'a pas répondu, alimentation par la base nationale
        if (!dossiersHistoriqueAdmin || dossiersHistoriqueAdmin.length === 0) {
          dossiersHistoriqueAdmin = baseDossiersNationale;
        }

        // Calcul des KPIs
        const total = dossiersHistoriqueAdmin.length;
        const prets = dossiersHistoriqueAdmin.filter(
          (d) => d.statut === "PRETE_RETRAIT",
        ).length;
        const instruction = dossiersHistoriqueAdmin.filter(
          (d) => d.statut === "INSTRUCTION",
        ).length;
        const rejetes = dossiersHistoriqueAdmin.filter(
          (d) => d.statut === "REJETEE",
        ).length;

        const elTotal = document.getElementById("kpi-total-dossiers");
        const elPrets = document.getElementById("kpi-prets-dossiers");
        const elInstruction = document.getElementById(
          "kpi-instruction-dossiers",
        );
        const elRejetes = document.getElementById("kpi-rejetes-dossiers");

        if (elTotal) elTotal.textContent = total;
        if (elPrets) elPrets.textContent = prets;
        if (elInstruction) elInstruction.textContent = instruction;
        if (elRejetes) elRejetes.textContent = rejetes;

        filtrerHistoriqueAdmin();
      }

      // Filtrage dynamique du tableau admin
      function filtrerHistoriqueAdmin() {
        const searchTxt = (
          document.getElementById("admin-search-text")
            ? document.getElementById("admin-search-text").value
            : ""
        )
          .toLowerCase()
          .trim();
        const filterReg = document.getElementById("admin-filter-region")
          ? document.getElementById("admin-filter-region").value
          : "ALL";
        const filterType = document.getElementById("admin-filter-type")
          ? document.getElementById("admin-filter-type").value
          : "ALL";
        const filterStat = document.getElementById("admin-filter-statut")
          ? document.getElementById("admin-filter-statut").value
          : "ALL";

        const filtered = dossiersHistoriqueAdmin.filter((item) => {
          if (filterReg !== "ALL" && item.provenance.regionId !== filterReg)
            return false;
          if (filterType !== "ALL" && item.typeActe !== filterType)
            return false;
          if (filterStat !== "ALL" && item.statut !== filterStat) return false;

          if (searchTxt) {
            const matchStr = (
              item.numeroDeclaration +
              " " +
              item.identifiantBUNEC +
              " " +
              item.titulaire +
              " " +
              item.demandeur.nomComplet +
              " " +
              item.provenance.communeNom +
              " " +
              item.provenance.departement +
              " " +
              item.provenance.regionNom +
              " " +
              item.provenance.canalDepot +
              " " +
              item.provenance.adresseIp +
              " " +
              (item.demandeur.telephone || "") +
              " " +
              (item.demandeur.cni || "")
            ).toLowerCase();
            if (!matchStr.includes(searchTxt)) return false;
          }

          return true;
        });

        const compteur = document.getElementById("compteur-resultats-admin");
        if (compteur)
          compteur.textContent = `${filtered.length} dossier(s) répertorié(s)`;

        const pdfTotal = document.getElementById("pdf-total-actes");
        if (pdfTotal) pdfTotal.textContent = `${filtered.length} acte(s)`;

        // Rendu du tableau Admin interactif
        const tbody = document.getElementById("tbody-historique-admin");
        if (tbody) {
          if (filtered.length === 0) {
            tbody.innerHTML = `
            <tr>
              <td colspan="7" class="py-8 text-center text-slate-400">
                Aucun dossier ne correspond à ces critères d’inspection administrative.
              </td>
            </tr>
          `;
          } else {
            tbody.innerHTML = filtered
              .map((item) => {
                const isPret = item.statut === "PRETE_RETRAIT";
                const isRejet = item.statut === "REJETEE";

                let badgeStatut =
                  '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">⏳ En Instruction (BAT Bloqué)</span>';
                if (isPret) {
                  badgeStatut =
                    '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">✓ Prêt (BAT Débloqué)</span>';
                } else if (isRejet) {
                  badgeStatut =
                    '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-900 border border-rose-300">✕ Rejeté (BAT Bloqué)</span>';
                }

                let typeBadge =
                  '<span class="inline-block px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-100 text-emerald-950 border border-emerald-300">NAISSANCE</span>';
                if (item.typeActe === "ACTE_MARIAGE")
                  typeBadge =
                    '<span class="inline-block px-1.5 py-0.5 rounded text-[9px] font-black bg-blue-100 text-blue-950 border border-blue-300">MARIAGE</span>';
                else if (item.typeActe === "ACTE_DECES")
                  typeBadge =
                    '<span class="inline-block px-1.5 py-0.5 rounded text-[9px] font-black bg-rose-100 text-rose-950 border border-rose-300">DÉCÈS</span>';
                else if (
                  item.typeActe === "DECLARATION_TARDIVE_JUGEMENT_SUPPLETIF"
                )
                  typeBadge =
                    '<span class="inline-block px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-100 text-amber-950 border border-amber-300">JUGEMENT</span>';

                const dateFmt = new Date(
                  item.dateEnregistrement,
                ).toLocaleString("fr-FR", {
                  dateStyle: "short",
                  timeStyle: "short",
                });

                return `
              <tr class="hover:bg-slate-50 transition border-b border-slate-100 text-xs">
                <td class="py-3 px-4">
                  <span class="font-mono font-black text-slate-900 block text-xs">${item.numeroDeclaration}</span>
                  <span class="font-mono text-[10px] text-emerald-800 font-bold block">${item.identifiantBUNEC}</span>
                  <span class="text-[10px] text-slate-400">Le ${dateFmt}</span>
                </td>
                <td class="py-3 px-4">
                  <div class="space-y-1">
                    <div>${typeBadge}</div>
                    <span class="font-black text-slate-900 block text-xs">${item.titreActe}</span>
                  </div>
                </td>
                <td class="py-3 px-4">
                  <span class="font-black text-slate-900 block">${item.titulaire}</span>
                  <span class="text-[11px] text-slate-500 block">Demandeur : ${item.demandeur.nomComplet}</span>
                  <span class="text-[10px] font-mono text-emerald-700 font-bold">📱 +237 ${item.demandeur.telephone}</span>
                </td>
                <td class="py-3 px-4">
                  <div class="space-y-0.5">
                    <span class="font-black text-purple-900 block text-xs">Région : ${item.provenance.regionNom} (${item.provenance.departement})</span>
                    <span class="text-[11px] font-semibold text-slate-700 block">${item.provenance.communeNom}</span>
                    <span class="text-[10px] text-slate-500 block italic">${item.provenance.centreEtatCivil}</span>
                  </div>
                </td>
                <td class="py-3 px-4">
                  <div class="space-y-0.5">
                    <span class="font-bold text-slate-800 block text-[11px]">📍 ${item.provenance.canalDepot}</span>
                    <span class="font-mono text-[10px] text-slate-500 block">IP : ${item.provenance.adresseIp}</span>
                    <span class="text-[10px] text-slate-400 block">${item.provenance.operateur}</span>
                  </div>
                </td>
                <td class="py-3 px-4">
                  ${badgeStatut}
                  ${
                    item.notificationRetraitEnvoyee
                      ? `
                    <span class="block text-[9px] text-emerald-700 font-bold mt-1">🔔 Notifié WhatsApp/SMS</span>
                  `
                      : ""
                  }
                </td>
                <td class="py-3 px-4 text-center">
                  <div class="flex items-center justify-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onclick="basculerStatutDossierAdmin('${item.id}')"
                      title="Changer le statut administratif et débloquer/verrouiller le BAT"
                      class="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[10px] border border-slate-300 transition active:scale-95 cursor-pointer"
                    >
                      ⚡ Statut
                    </button>
                    <button
                      type="button"
                      onclick="ouvrirBATAdmin('${item.typeActe}', '${item.id}')"
                      title="Consulter le Bon à Tirer (BAT) correspondant"
                      class="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-[10px] border border-emerald-300 transition active:scale-95 cursor-pointer"
                    >
                      👁️ Spécimen BAT
                    </button>
                  </div>
                </td>
              </tr>
            `;
              })
              .join("");
          }
        }

        // Rendu du tableau PDF d'export
        const tbodyPdf = document.getElementById("tbody-pdf-historique");
        if (tbodyPdf) {
          tbodyPdf.innerHTML = filtered
            .map((item) => {
              return `
            <tr class="text-[9px]">
              <td class="border border-slate-400 p-1 font-mono font-bold">${item.numeroDeclaration}<br><span class="text-[8px] text-emerald-800">${item.identifiantBUNEC}</span></td>
              <td class="border border-slate-400 p-1 font-bold">${item.titreActe}</td>
              <td class="border border-slate-400 p-1"><strong>${item.titulaire}</strong><br>Req: ${item.demandeur.nomComplet} (Tel: ${item.demandeur.telephone})</td>
              <td class="border border-slate-400 p-1 font-semibold">${item.provenance.regionNom} - ${item.provenance.departement}<br>${item.provenance.communeNom}</td>
              <td class="border border-slate-400 p-1 font-mono text-[8px]">${item.provenance.canalDepot}<br>IP: ${item.provenance.adresseIp}</td>
              <td class="border border-slate-400 p-1 font-bold ${item.statut === "PRETE_RETRAIT" ? "text-emerald-900" : "text-amber-900"}">${item.statut === "PRETE_RETRAIT" ? "PRÊT (BAT DÉBLOQUÉ)" : item.statut}</td>
            </tr>
          `;
            })
            .join("");
        }
      }

      // Basculement rapide de statut par l'admin
      async function basculerStatutDossierAdmin(dossierId) {
        const item = dossiersHistoriqueAdmin.find((d) => d.id === dossierId);
        if (!item) return;

        const nouveauStatut =
          item.statut === "PRETE_RETRAIT" ? "INSTRUCTION" : "PRETE_RETRAIT";

        try {
          await fetch(`/api/v1/admin/dossiers/${dossierId}/statut`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRF-Token": adminCsrfToken,
            },
            body: JSON.stringify({ nouveauStatut }),
          });
        } catch (err) {
          // Fallback local
        }

        item.statut = nouveauStatut;
        if (nouveauStatut === "PRETE_RETRAIT") {
          item.etapeCourante = 4;
          item.notificationRetraitEnvoyee = true;
          item.libelleStatut =
            "Disponible au guichet — Prêt pour délivrance (BAT Émis)";
        } else {
          item.etapeCourante = 2;
          item.notificationRetraitEnvoyee = false;
          item.libelleStatut =
            "En cours d’instruction administrative (BAT Verrouillé)";
        }

        filtrerHistoriqueAdmin();

        const toast = document.createElement("div");
        toast.className =
          "fixed bottom-5 right-5 z-50 p-4 rounded-2xl shadow-2xl border text-xs bg-slate-900 text-white flex items-center gap-3 border-emerald-400";
        toast.innerHTML =
          nouveauStatut === "PRETE_RETRAIT"
            ? `<span>✓</span><span>Dossier <strong>${item.numeroDeclaration}</strong> passé à <strong>PRÊT POUR RETRAIT</strong> : Bon à Tirer débloqué pour le citoyen et notification envoyée !</span>`
            : `<span>⏳</span><span>Dossier <strong>${item.numeroDeclaration}</strong> remis en <strong>INSTRUCTION</strong> (BAT verrouillé).</span>`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
      }

      // Visualisation du BAT par l'admin
      function ouvrirBATAdmin(typeActe, dossierId) {
        if (dossierId && dossiersHistoriqueAdmin) {
          const found = dossiersHistoriqueAdmin.find(
            (d) => d.id === dossierId || d.numeroDeclaration === dossierId,
          );
          if (found) {
            dossierActuellementCorrespondant = found;
          }
        }
        dossierTermine = true;
        notificationRetraitRecue = true;
        choisirFormatActeCivil(typeActe, dossierActuellementCorrespondant);
        switchTab("dr");
        actualiserAffichageBAT();
        const docActe = document.getElementById("document-acte-civil-officiel");
        if (docActe) {
          setTimeout(() => {
            docActe.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 100);
        }
      }

      // Exportation / Impression officielle du Rapport d'Audit en PDF (A4)
      function imprimerRapportAdminPDF() {
        const elDate = document.getElementById("pdf-date-extraction");
        if (elDate) {
          elDate.textContent = new Date().toLocaleString("fr-FR", {
            dateStyle: "full",
            timeStyle: "medium",
          });
        }

        document.body.classList.add("printing-admin");
        window.print();
        window.addEventListener(
          "afterprint",
          () => {
            document.body.classList.remove("printing-admin");
          },
          { once: true },
        );
      }

      const privacyKey = "bunec_privacy_accepted";

      function initPrivacyGate() {
        const hasAccepted = localStorage.getItem(privacyKey) === "true";
        const body = document.body;

        if (hasAccepted) {
          body.classList.add("app-ready");
          return;
        }

        body.classList.remove("app-ready");
        const checkbox = document.getElementById("privacy-checkbox");
        const acceptBtn = document.getElementById("privacy-accept-btn");

        if (!checkbox || !acceptBtn) return;

        checkbox.addEventListener("change", () => {
          acceptBtn.disabled = !checkbox.checked;
        });

        acceptBtn.addEventListener("click", () => {
          if (!checkbox.checked) return;
          localStorage.setItem(privacyKey, "true");
          body.classList.add("app-ready");
        });
      }

      // Configuration fixe : Police Administrative (Arial / Helvetica / Liberation Sans)
      (function initPoliceAdministrative() {
        try {
          localStorage.removeItem("bunec_police_choisie");
          initPrivacyGate();
        } catch (e) {
          initPrivacyGate();
        }
      })();


Object.assign(window, {
  ouvrirEspaceAdmin,
  connexionAdmin,
  basculerBoiteNotifications,
  fermerBoiteNotifications,
  switchTab,
  filtrerSuggestionsCEC,
  changerSelectionTypeActe,
  gererSaisieIdentifiantOuTel,
  rechercherMonDossierPrecis,
  effacerInputDeclaration,
  filtrerBans,
  simulerEtatDossierPourTest,
  ouvrirModalSignalementBAT,
  validerBATCitoyen,
  choisirFormatActeCivil,
  imprimerRapportAdminPDF,
  chargerHistoriqueAdmin,
  deconnexionAdmin,
  filtrerHistoriqueAdmin,
  fermerModalAdminLogin,
  toggleAdminPasswordVisibility,
  fermerModal,
  simulerCompressionClient,
  selectionnerCEC,
  marquerToutesNotificationsLues,
  marquerNotificationLue,
  consulterActeCivilDirect,
  afficherAlerteBatVerrouille,
  reinitialiserRecherche,
  testerAlerteMessagerie,
  ouvrirDetailBan,
  ouvrirFormOpposition,
  basculerStatutDossierAdmin,
  ouvrirBATAdmin,
});
