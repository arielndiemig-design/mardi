import React, { useState, useMemo } from 'react';
import { CAMEROUN_REGIONS_DATA } from '../data/camerounAdministrativeData';
import { TypeActe, DossierSuiviDetail } from '../types';
import { TimelineDossier } from './TimelineDossier';

export const SuiviDossierForm: React.FC = () => {
  // Service sélectionné en haut
  const [activeService, setActiveService] = useState<'SUIVI' | 'BANS' | 'DR'>('SUIVI');

  // Champs de saisie précis
  const [selectedRegionId, setSelectedRegionId] = useState<string>('CE');
  const [selectedCommuneId, setSelectedCommuneId] = useState<string>('CE-YA1');
  const [numeroDeclaration, setNumeroDeclaration] = useState<string>('DEC-2026-001249');
  const [numeroTelephone, setNumeroTelephone] = useState<string>('699 12 34 56');

  // État de chargement et détection
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [typeActeIdentifie, setTypeActeIdentifie] = useState<{
    code: TypeActe;
    titre: string;
    icone: string;
    registre: string;
    description: string;
  } | null>(null);

  const [dossierResult, setDossierResult] = useState<DossierSuiviDetail | null>(null);
  const [testColor, setTestColor] = useState<'green' | 'amber' | 'red'>('amber');

  // Communes disponibles
  const availableCommunes = useMemo(() => {
    const region = CAMEROUN_REGIONS_DATA.find((r) => r.id === selectedRegionId);
    return region ? region.communes : [];
  }, [selectedRegionId]);

  // Déclenchement de la recherche
  const handleRechercheDossier = (couleur: 'green' | 'amber' | 'red' = testColor) => {
    setIsLoading(true);

    // 1. Identification automatique du type d'acte d'après le numéro de déclaration
    const numUpper = numeroDeclaration.toUpperCase();
    let typeDetecte: {
      code: TypeActe;
      titre: string;
      icone: string;
      registre: string;
      description: string;
      demandeur: string;
    } = {
      code: 'ACTE_NAISSANCE',
      titre: 'ACTE DE NAISSANCE',
      icone: '👶',
      registre: 'Registre A (Naissances)',
      description: 'Déclaration et enregistrement de naissance de premier degré',
      demandeur: 'TCHOUA MBALLA Christian Lionel'
    };

    if (numUpper.includes('MAR') || numUpper.includes('AM') || numUpper.includes('BAN')) {
      typeDetecte = {
        code: 'ACTE_MARIAGE',
        titre: 'ACTE DE MARIAGE',
        icone: '💍',
        registre: 'Registre B (Mariages)',
        description: 'Célébration matrimoniale et enregistrement d’acte de mariage civil',
        demandeur: 'EBELLE Samuel & NGONO Clarisse'
      };
    } else if (numUpper.includes('DEC') && (numUpper.includes('DECES') || numUpper.includes('AD'))) {
      typeDetecte = {
        code: 'ACTE_DECES',
        titre: 'ACTE DE DÉCÈS',
        icone: '🕊️',
        registre: 'Registre C (Décès)',
        description: 'Constatation légale et déclaration d’acte de décès',
        demandeur: 'Ayants droit de feu FOTSO Émile'
      };
    } else if (numUpper.includes('JUG') || numUpper.includes('TARD')) {
      typeDetecte = {
        code: 'DECLARATION_TARDIVE_JUGEMENT_SUPPLETIF',
        titre: 'DÉCLARATION TARDIVE / JUGEMENT SUPPLÉTIF',
        icone: '⚖️',
        registre: 'Registre D (Supplétifs)',
        description: 'Transcription d’ordonnance de jugement supplétif rendu par le Tribunal',
        demandeur: 'Requérant KAMDEM Joseph'
      };
    }

    setTypeActeIdentifie(typeDetecte);

    const regionObj = CAMEROUN_REGIONS_DATA.find((r) => r.id === selectedRegionId);
    const communeObj = availableCommunes.find((c) => c.id === selectedCommuneId);

    // 2. Construction du cycle de vie
    let cycleDeVieMock: DossierSuiviDetail['cycleDeVie'];
    if (couleur === 'green') {
      cycleDeVieMock = {
        etapeCourante: 4,
        codeCouleur: 'green',
        statutActuel: 'PRET_DELIVRANCE',
        libelleStatut: 'DISPONIBLE AU GUICHET — PRÊT POUR RETRAIT',
        motifBlocage: null,
        etapes: [
          { numero: 1, nom: 'Dossier déposé et enregistré', statut: 'COMPLETED', horodatage: '2026-08-25T08:30:00Z', description: 'Enregistrement initial. Identifiant BUNEC unique généré.' },
          { numero: 2, nom: 'Instruction & Vérification juridique', statut: 'COMPLETED', horodatage: '2026-08-27T11:15:00Z', description: 'Concordance vérifiée des pièces d’état civil.' },
          { numero: 3, nom: 'Validation & Signature de l’Officier', statut: 'COMPLETED', horodatage: '2026-09-02T14:45:00Z', description: 'Signature électronique qualifiée apposée.' },
          { numero: 4, nom: 'Disponible au guichet / Prêt pour délivrance', statut: 'COMPLETED', horodatage: '2026-09-05T09:00:00Z', description: 'Votre acte original sécurisé est prêt au guichet.', convocation: 'Retrait ouvert au Guichet n°03 (sur présentation du récépissé).' }
        ]
      };
    } else if (couleur === 'red') {
      cycleDeVieMock = {
        etapeCourante: 2,
        codeCouleur: 'red',
        statutActuel: 'REJETE_BLOQUE',
        libelleStatut: 'PIÈCE REJETÉE — DOSSIER BLOQUÉ',
        motifBlocage: {
          code: 'REJ_01',
          libelle: 'Discordance d’Identité & Certificat Médical Illisible',
          description: 'L’orthographe du nom patronymique sur le certificat médical d’accouchement ne concorde pas avec la CNI légale.'
        },
        etapes: [
          { numero: 1, nom: 'Dossier déposé et enregistré', statut: 'COMPLETED', horodatage: '2026-08-25T08:30:00Z', description: 'Enregistrement initial au guichet n°02.' },
          { numero: 2, nom: 'Instruction & Vérification juridique', statut: 'REJECTED', horodatage: '2026-08-27T11:15:00Z', description: 'Instruction bloquée : anomalie constatée sur les pièces requises.' },
          { numero: 3, nom: 'Validation & Signature de l’Officier', statut: 'PENDING', horodatage: null, description: 'En attente de régularisation des pièces.' },
          { numero: 4, nom: 'Disponible au guichet / Prêt pour délivrance', statut: 'PENDING', horodatage: null, description: 'Délivrance suspendue.' }
        ]
      };
    } else {
      cycleDeVieMock = {
        etapeCourante: 3,
        codeCouleur: 'amber',
        statutActuel: 'VALIDATION_SIGNEE',
        libelleStatut: 'EN COURS D’INSTRUCTION ADMINISTRATIVE',
        motifBlocage: null,
        etapes: [
          { numero: 1, nom: 'Dossier déposé et enregistré', statut: 'COMPLETED', horodatage: '2026-08-25T08:30:00Z', description: 'Enregistrement initial. Identifiant BUNEC certifié généré.' },
          { numero: 2, nom: 'Instruction & Vérification juridique', statut: 'COMPLETED', horodatage: '2026-08-27T11:15:00Z', description: 'Vérification de concordance du certificat médical et témoins.' },
          { numero: 3, nom: 'Validation & Signature de l’Officier', statut: 'CURRENT', horodatage: '2026-09-02T14:45:00Z', description: 'En attente d’apposition de la signature de l’Officier d’État Civil.' },
          { numero: 4, nom: 'Disponible au guichet / Prêt pour délivrance', statut: 'PENDING', horodatage: null, description: 'Convocation programmée dès signature effective.', convocation: 'Créneau estimé : 10/09/2026 de 09h00 à 11h30 (Guichet 02)' }
        ]
      };
    }

    setDossierResult({
      id: 'dossier-mock-id-2026',
      bunecTrackingId: `${selectedRegionId}-${selectedCommuneId.replace(/^[A-Z]+-/, '')}-00-2026-AN-001249`,
      numeroRecepisse: numeroDeclaration,
      typeActe: typeDetecte.code,
      localisation: {
        region: regionObj?.nom || 'Centre',
        regionId: selectedRegionId,
        commune: communeObj?.nom || 'Yaoundé Iᵉʳ',
        communeId: selectedCommuneId,
        centre: `Centre d’État Civil Principal de ${communeObj?.nom || 'Yaoundé Iᵉʳ'}`,
        annee: 2026,
        numeroSequentiel: 1249
      },
      demandeur: {
        nom: typeDetecte.demandeur,
        telephoneMasque: `+237 ${numeroTelephone}`
      },
      cycleDeVie: cycleDeVieMock,
      derniereMiseAJour: new Date().toISOString()
    });

    setIsLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* ================================================================== */}
      <!-- 1. EN DESSUS : LES 3 ICÔNES D'ACTION                              -->
      {/* ================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* ICÔNE 1 : SUIVI */}
        <button
          type="button"
          onClick={() => setActiveService('SUIVI')}
          className={`p-5 rounded-2xl border text-left flex items-center gap-4 transition-all cursor-pointer ${
            activeService === 'SUIVI'
              ? 'border-emerald-600 bg-emerald-50/70 shadow-md ring-2 ring-emerald-500/20'
              : 'border-slate-200 bg-white hover:border-emerald-300'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-emerald-600/30 flex-shrink-0">
            📋
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              Service 1
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-1 leading-tight">
              Suivi de Dossier
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Suivre l'avancement en direct
            </p>
          </div>
        </button>

        {/* ICÔNE 2 : PUBLICATION DE BANS */}
        <button
          type="button"
          onClick={() => setActiveService('BANS')}
          className={`p-5 rounded-2xl border text-left flex items-center gap-4 transition-all cursor-pointer ${
            activeService === 'BANS'
              ? 'border-blue-600 bg-blue-50/70 shadow-md ring-2 ring-blue-500/20'
              : 'border-slate-200 bg-white hover:border-blue-300'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-blue-600/20 flex-shrink-0">
            💍
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
              Service 2
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-1 leading-tight">
              Publication de Bans
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Registre des projets de mariage
            </p>
          </div>
        </button>

        {/* ICÔNE 3 : DR (VOTRE ACTE D'ÉTAT CIVIL) */}
        <button
          type="button"
          onClick={() => setActiveService('DR')}
          className={`p-5 rounded-2xl border text-left flex items-center gap-4 transition-all cursor-pointer relative ${
            activeService === 'DR'
              ? 'border-purple-600 bg-purple-50/70 shadow-md ring-2 ring-purple-500/20'
              : 'border-slate-200 bg-white hover:border-purple-300'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-700 to-indigo-800 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-purple-600/20 flex-shrink-0 relative">
            <span>📜</span>
            <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-900 text-[10px] font-black px-1.5 py-0.2 rounded-full shadow">DR</span>
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
              Délivrance Rapide (DR)
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-1 leading-tight">
              Votre Acte d'État Civil
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Consulter, imprimer ou duplicata
            </p>
          </div>
        </button>

      </div>

      {/* ================================================================== */}
      <!-- 2. FORMULAIRE : CHOISIR VOTRE CEC | NUMÉRO DÉCLARATION | TÉLÉPHONE -->
      {/* ================================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200">
        
        <div class="pb-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              INTERROGATION IMMÉDIATE DU REGISTRE
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-2">
              Identifier le Type d'Acte & Suivre mon Dossier
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Sélectionnez votre CEC et indiquez votre numéro de déclaration pour identification automatique.
            </p>
          </div>

          <!-- Test rapide de code couleur -->
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-xl text-xs">
            <span className="font-bold text-slate-600 px-2">Tester état :</span>
            <button
              type="button"
              onClick={() => { setTestColor('green'); handleRechercheDossier('green'); }}
              className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-800 font-bold rounded-lg border border-slate-200"
            >
              🟢 Vert
            </button>
            <button
              type="button"
              onClick={() => { setTestColor('amber'); handleRechercheDossier('amber'); }}
              className="px-2.5 py-1 bg-white hover:bg-amber-50 text-amber-900 font-bold rounded-lg border border-slate-200"
            >
              🟠 Ambre
            </button>
            <button
              type="button"
              onClick={() => { setTestColor('red'); handleRechercheDossier('red'); }}
              className="px-2.5 py-1 bg-white hover:bg-rose-50 text-rose-800 font-bold rounded-lg border border-slate-200"
            >
              🔴 Rouge
            </button>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRechercheDossier();
          }}
          className="mt-6 space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* CHAMP 1 : CHOISIR VOTRE CEC */}
            <div className="lg:col-span-5">
              <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
                🏛️ Choisir votre CEC (Centre d'État Civil) <span className="text-rose-600">*</span>
              </label>

              <div className="space-y-2">
                <select
                  value={selectedCommuneId}
                  onChange={(e) => setSelectedCommuneId(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition shadow-sm"
                >
                  {availableCommunes.map((c) => (
                    <option key={c.id} value={c.id}>
                      Mairie de {c.nom} — Centre d'État Civil Principal
                    </option>
                  ))}
                </select>

                <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                  <span>Région :</span>
                  <select
                    value={selectedRegionId}
                    onChange={(e) => {
                      setSelectedRegionId(e.target.value);
                      const r = CAMEROUN_REGIONS_DATA.find((reg) => reg.id === e.target.value);
                      if (r && r.communes.length > 0) setSelectedCommuneId(r.communes[0].id);
                    }}
                    className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-700"
                  >
                    {CAMEROUN_REGIONS_DATA.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.nom} (10)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* CHAMP 2 : NUMÉRO DE DÉCLARATION (OBLIGATOIRE) */}
            <div className="lg:col-span-4">
              <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
                🔢 Numéro de déclaration (obligatoire) <span className="text-rose-600">*</span>
              </label>
              
              <div>
                <input
                  type="text"
                  required
                  value={numeroDeclaration}
                  onChange={(e) => setNumeroDeclaration(e.target.value)}
                  placeholder="Ex: DEC-2026-001249 ou 001249"
                  className="w-full bg-slate-50 border-2 border-emerald-600/70 rounded-xl px-4 py-3 text-sm font-mono font-black text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition shadow-sm"
                />
              </div>

              <span className="text-[11px] text-slate-500 block mt-1.5">
                Identifie automatiquement si c'est Naissance, Mariage, etc.
              </span>
            </div>

            {/* CHAMP 3 : NUMÉRO DE TÉLÉPHONE POUR LE SUIVI AVEC DÉTECTION WHATSAPP & TELEGRAM */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                  📱 N° de téléphone <span className="text-rose-600">*</span>
                </label>
                <span className="text-[10px] font-extrabold text-orange-800 bg-orange-100 px-2 py-0.5 rounded-full border border-orange-200">
                  {numeroTelephone.startsWith('67') || numeroTelephone.startsWith('68') ? 'MTN CMR' : 'Orange CMR'}
                </span>
              </div>

              <div className="flex rounded-xl shadow-sm">
                <span className="inline-flex items-center px-3 py-3 rounded-l-xl border-2 border-r-0 border-slate-300 bg-slate-100 text-slate-700 font-bold text-xs">
                  🇨🇲 +237
                </span>
                <input
                  type="tel"
                  required
                  value={numeroTelephone}
                  onChange={(e) => setNumeroTelephone(e.target.value)}
                  placeholder="699 12 34 56"
                  className="w-full bg-slate-50 border-2 border-slate-300 rounded-r-xl px-3.5 py-3 text-sm font-mono font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
              </div>

              {/* PANNEAU DE DÉTECTION MESSAGERIE */}
              <div className="mt-2 p-2 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase">
                  <span>Messageries Détectées</span>
                  <span className="text-emerald-700 font-black">✓ Actif</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-950 text-[11px] font-bold">
                    <span>💬 WhatsApp</span>
                    <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.2 rounded">✓</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-sky-50 border border-sky-300 text-sky-950 text-[11px] font-bold">
                    <span>✈️ Telegram</span>
                    <span className="text-[9px] bg-sky-600 text-white px-1.5 py-0.2 rounded">✓</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* BOUTON D'ACTION : RECHERCHER MON DOSSIER */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Cliquez pour <strong>identifier automatiquement le type d'acte</strong> et ouvrir le suivi</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider text-white bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:ring-emerald-200 transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-700/25"
            >
              <span className="text-lg">🔍</span>
              <span>Rechercher mon dossier</span>
            </button>
          </div>
        </form>
      </div>

      {/* BANDEAU D'IDENTIFICATION IMMÉDIATE DU TYPE D'ACTE */}
      {typeActeIdentifie && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white shadow-xl border-2 border-emerald-500/50 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 text-3xl flex items-center justify-center flex-shrink-0">
              {typeActeIdentifie.icone}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 px-2 py-0.5 rounded font-mono">
                  TYPE D'ACTE IDENTIFIÉ
                </span>
                <span className="text-xs text-emerald-300 font-bold">• {typeActeIdentifie.registre}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                {typeActeIdentifie.titre}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {typeActeIdentifie.description}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">N° Déclaration :</span>
              <span className="font-bold text-emerald-200">{numeroDeclaration}</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-white/20"></div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Alerte SMS/WhatsApp :</span>
              <span className="font-bold text-amber-300">📱 +237 {numeroTelephone}</span>
            </div>
          </div>
        </div>
      )}

      {/* RENDU DE LA TIMELINE DU DOSSIER */}
      {dossierResult && <TimelineDossier dossier={dossierResult} />}

    </div>
  );
};
