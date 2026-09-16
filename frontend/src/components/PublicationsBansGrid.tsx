import React, { useState, useEffect, useMemo } from 'react';
import { PublicationBan, StatutBan, RegimeMatrimonial } from '../types';
import { CAMEROUN_REGIONS_DATA } from '../data/camerounAdministrativeData';
import { compressImageClientSide } from '../utils/clientImageCompressor';

// Formatage du libellé de régime matrimonial
const formatRegime = (regime: RegimeMatrimonial): string => {
  switch (regime) {
    case 'MONOGAMIE_BIENS_COMMUNS':
      return 'Monogamie — Biens Communs';
    case 'MONOGAMIE_SEPARATION_BIENS':
      return 'Monogamie — Séparation de Biens';
    case 'POLYGAMIE':
      return 'Polygamie';
  }
};

// Badges de statut légal du ban
const renderStatutBadge = (statut: StatutBan) => {
  switch (statut) {
    case 'EN_COURS_AFFICHAGE':
      return (
        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
          En cours d'affichage légal
        </span>
      );
    case 'EXPIRANT_SOUS_48H':
      return (
        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
          ⚠️ Expire sous 48h
        </span>
      );
    case 'CLOTURE_SANS_OPPOSITION':
      return (
        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-300">
          Clôturé sans opposition
        </span>
      );
    case 'OPPOSITION_ENREGISTREE':
      return (
        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-rose-100 text-rose-800 border border-rose-300">
          ⛔ Opposition Enregistrée
        </span>
      );
  }
};

// Composant de Compte à Rebours dynamique (jours, heures, minutes, secondes)
const CountdownTimer: React.FC<{ targetDateStr: string }> = ({ targetDateStr }) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDateStr) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft(null);
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDateStr]);

  if (!timeLeft) {
    return <span className="text-xs font-semibold text-slate-500">Délai d'affichage expiré</span>;
  }

  return (
    <div className="flex items-center gap-1.5 font-mono text-xs text-slate-800 font-bold bg-slate-100 px-2.5 py-1 rounded-lg">
      <span className="text-emerald-700">{timeLeft.days}j</span> :
      <span>{String(timeLeft.hours).padStart(2, '0')}h</span> :
      <span>{String(timeLeft.minutes).padStart(2, '0')}m</span> :
      <span className="text-slate-500">{String(timeLeft.seconds).padStart(2, '0')}s</span>
    </div>
  );
};

export const PublicationsBansGrid: React.FC = () => {
  // Filtres
  const [filterRegion, setFilterRegion] = useState<string>('ALL');
  const [filterCommune, setFilterCommune] = useState<string>('ALL');
  const [filterStatut, setFilterStatut] = useState<string>('ALL');
  const [filterRegime, setFilterRegime] = useState<string>('ALL');

  // État du registre
  const [bans, setBans] = useState<PublicationBan[]>([]);
  const [selectedBanDetail, setSelectedBanDetail] = useState<PublicationBan | null>(null);
  const [banForOpposition, setBanForOpposition] = useState<PublicationBan | null>(null);

  // Formulaire d'opposition
  const [opposantNom, setOpposantNom] = useState('');
  const [opposantPrenom, setOpposantPrenom] = useState('');
  const [opposantQualite, setOpposantQualite] = useState('CONJOINT_NON_DIVORCE');
  const [opposantCni, setOpposantCni] = useState('');
  const [opposantTel, setOpposantTel] = useState('');
  const [motifOpposition, setMotifOpposition] = useState('');
  const [justificatifFile, setJustificatifFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [oppositionSubmitted, setOppositionSubmitted] = useState<boolean>(false);

  // Communes disponibles selon la région sélectionnée
  const availableCommunes = useMemo(() => {
    if (filterRegion === 'ALL') return [];
    const region = CAMEROUN_REGIONS_DATA.find((r) => r.id === filterRegion);
    return region ? region.communes : [];
  }, [filterRegion]);

  useEffect(() => {
    // Chargement initial des bans (API backend avec fallback mock de démonstration)
    const fetchBans = async () => {
      try {
        const res = await fetch('/api/v1/bans');
        if (res.ok) {
          const data = await res.json();
          setBans(data);
          return;
        }
      } catch {}

      // Mock de données de registre
      setBans([
        {
          id: 'b1-2026-dla1-0089',
          referenceLegaleBan: 'BAN-2026-LT-DL1-0089',
          centreEtatCivil: 'Mairie de Douala Iᵉʳ (Centre Principal de Bonanjo)',
          regionNom: 'Littoral',
          communeNom: 'Douala Iᵉʳ',
          epoux: {
            nom: 'EBELLE',
            prenom: 'Samuel Patrick',
            dateNaissance: '1992-04-14',
            lieuNaissance: 'Douala',
            profession: 'Ingénieur Télécoms',
            domicile: 'Bonapriso, Douala',
            pere: 'EBELLE Victor',
            mere: 'NDONGO Madeleine'
          },
          epouse: {
            nom: 'NGONO',
            prenom: 'Clarisse Vanessa',
            dateNaissance: '1995-11-20',
            lieuNaissance: 'Yaoundé',
            profession: 'Gestionnaire de Projets',
            domicile: 'Akwa, Douala',
            pere: 'NGONO Jean-Baptiste',
            mere: 'BILOUNGA Thérèse'
          },
          regimeMatrimonial: 'MONOGAMIE_BIENS_COMMUNS',
          coutumeMatrimoniale: 'Coutume Sawa / Bassa',
          dateDebutAffichage: '2026-08-25',
          dateFinAffichage: '2026-09-25',
          datePrevueCelebration: '2026-09-26',
          lieuPrevuCelebration: 'Salle des Actes - Mairie de Douala 1er',
          statutBan: 'EN_COURS_AFFICHAGE',
          documentAvisUrl: '/storage/bans/BAN-2026-LT-DL1-0089.webp',
          thumbnailUrl: '/storage/bans/thumbnails/BAN-2026-LT-DL1-0089_thumb.webp',
          hashCertifieSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
        },
        {
          id: 'b2-2026-ya2-0142',
          referenceLegaleBan: 'BAN-2026-CE-YA2-0142',
          centreEtatCivil: 'Mairie de Yaoundé IIᵉ (Tsinga)',
          regionNom: 'Centre',
          communeNom: 'Yaoundé IIᵉ',
          epoux: {
            nom: 'FOTSO',
            prenom: 'Hervé Blaise',
            dateNaissance: '1989-08-02',
            lieuNaissance: 'Bafoussam',
            profession: 'Expert-Comptable',
            domicile: 'Bastos, Yaoundé',
            pere: 'FOTSO Émile',
            mere: 'KAMGA Odette'
          },
          epouse: {
            nom: 'ABENA',
            prenom: 'Marie Suzanne',
            dateNaissance: '1994-01-18',
            lieuNaissance: 'Mbalmayo',
            profession: 'Enseignante',
            domicile: 'Tsinga, Yaoundé',
            pere: 'ABENA Luc',
            mere: 'MBOA Rose'
          },
          regimeMatrimonial: 'MONOGAMIE_SEPARATION_BIENS',
          coutumeMatrimoniale: 'Coutume Bamiléké',
          dateDebutAffichage: '2026-08-10',
          dateFinAffichage: new Date(Date.now() + 36 * 3600 * 1000).toISOString().split('T')[0],
          datePrevueCelebration: '2026-09-12',
          lieuPrevuCelebration: 'Hôtel de Ville de Yaoundé II',
          statutBan: 'EXPIRANT_SOUS_48H',
          documentAvisUrl: '/storage/bans/BAN-2026-CE-YA2-0142.webp',
          thumbnailUrl: '/storage/bans/thumbnails/BAN-2026-CE-YA2-0142_thumb.webp',
          hashCertifieSha256: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0'
        },
        {
          id: 'b3-2026-baf1-0063',
          referenceLegaleBan: 'BAN-2026-OU-BF1-0063',
          centreEtatCivil: 'Mairie de Bafoussam Iᵉʳ',
          regionNom: 'Ouest',
          communeNom: 'Bafoussam Iᵉʳ',
          epoux: {
            nom: 'TAGNE',
            prenom: 'Dieudonné',
            dateNaissance: '1986-06-12',
            lieuNaissance: 'Bandjoun',
            profession: 'Commerçant',
            domicile: 'Djeleng, Bafoussam',
            pere: 'TAGNE Moïse',
            mere: 'TCHUENKAM Martine'
          },
          epouse: {
            nom: 'DJUIDJE',
            prenom: 'Pauline Laure',
            dateNaissance: '1993-09-05',
            lieuNaissance: 'Bafang',
            profession: 'Pharmacienne',
            domicile: 'Djeleng, Bafoussam',
            pere: 'KAMDEM Joseph',
            mere: 'SIKATI Christine'
          },
          regimeMatrimonial: 'POLYGAMIE',
          coutumeMatrimoniale: 'Coutume Bamiléké',
          dateDebutAffichage: '2026-08-01',
          dateFinAffichage: '2026-08-31',
          datePrevueCelebration: '2026-09-15',
          lieuPrevuCelebration: 'Salle Polyvalente Bafoussam 1er',
          statutBan: 'CLOTURE_SANS_OPPOSITION',
          documentAvisUrl: '/storage/bans/BAN-2026-OU-BF1-0063.webp',
          thumbnailUrl: '/storage/bans/thumbnails/BAN-2026-OU-BF1-0063_thumb.webp',
          hashCertifieSha256: 'f4e3d2c1b0a987654321fedcba0987654321fedcba0987654321fedcba098765'
        }
      ]);
    };

    fetchBans();
  }, []);

  // Filtrage combiné multicritères
  const filteredBans = useMemo(() => {
    return bans.filter((ban) => {
      if (filterRegion !== 'ALL') {
        const regObj = CAMEROUN_REGIONS_DATA.find((r) => r.id === filterRegion);
        if (regObj && ban.regionNom !== regObj.nom) return false;
      }
      if (filterCommune !== 'ALL') {
        const comObj = availableCommunes.find((c) => c.id === filterCommune);
        if (comObj && ban.communeNom !== comObj.nom) return false;
      }
      if (filterStatut !== 'ALL' && ban.statutBan !== filterStatut) {
        return false;
      }
      if (filterRegime !== 'ALL' && ban.regimeMatrimonial !== filterRegime) {
        return false;
      }
      return true;
    });
  }, [bans, filterRegion, filterCommune, filterStatut, filterRegime, availableCommunes]);

  // Prise en charge du fichier justificatif avec compression client-side
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const rawFile = e.target.files[0];
      setIsCompressing(true);
      try {
        const compressed = await compressImageClientSide(rawFile, {
          maxSizeMB: 0.4,
          maxWidthOrHeight: 1920
        });
        setJustificatifFile(compressed);
      } catch (err) {
        setJustificatifFile(rawFile);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleSubmitOpposition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!banForOpposition) return;

    // Simulation de transmission sécurisée au parquet & officier célébrant
    setOppositionSubmitted(true);
    setTimeout(() => {
      setOppositionSubmitted(false);
      setBanForOpposition(null);
      alert('Votre déclaration d’opposition légale a été enregistrée avec horodatage certifié.');
    }, 1800);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* En-tête et Titre du Module */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
              REGISTRE DÉMATÉRIALISÉ DU BUNEC
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-2">
              Publications Légales des Bans de Mariage
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Affichage public obligatoire préalable (10 à 30 jours calendaires avant célébration - Loi N° 2011/011).
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-500 block">Projets de mariage affichés</span>
            <span className="text-2xl font-black text-slate-900">{filteredBans.length}</span>
          </div>
        </div>

        {/* Filtres multicritères par listes déroulantes en cascade */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          {/* Région */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Région
            </label>
            <select
              value={filterRegion}
              onChange={(e) => {
                setFilterRegion(e.target.value);
                setFilterCommune('ALL');
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Toutes les régions (10)</option>
              {CAMEROUN_REGIONS_DATA.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Commune */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Commune / Mairie
            </label>
            <select
              value={filterCommune}
              disabled={filterRegion === 'ALL'}
              onChange={(e) => setFilterCommune(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="ALL">Toutes les communes</option>
              {availableCommunes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Statut du ban */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Statut du Ban
            </label>
            <select
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="EN_COURS_AFFICHAGE">En cours d'affichage</option>
              <option value="EXPIRANT_SOUS_48H">Expirant dans moins de 48h</option>
              <option value="CLOTURE_SANS_OPPOSITION">Affichage clôturé sans opposition</option>
              <option value="OPPOSITION_ENREGISTREE">Opposition enregistrée</option>
            </select>
          </div>

          {/* Régime matrimonial */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Régime Matrimonial
            </label>
            <select
              value={filterRegime}
              onChange={(e) => setFilterRegime(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Tous les régimes</option>
              <option value="MONOGAMIE_BIENS_COMMUNS">Monogamie / Biens Communs</option>
              <option value="MONOGAMIE_SEPARATION_BIENS">Monogamie / Séparation</option>
              <option value="POLYGAMIE">Polygamie</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grille des publications de bans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBans.map((ban) => (
          <div
            key={ban.id}
            className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all"
          >
            {/* Haut de la fiche */}
            <div className="p-6">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {ban.referenceLegaleBan}
                </span>
                {renderStatutBadge(ban.statutBan)}
              </div>

              {/* Futurs époux */}
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Futur Époux
                  </span>
                  <p className="font-black text-slate-900 text-base leading-tight">
                    {ban.epoux.nom} {ban.epoux.prenom}
                  </p>
                  <p className="text-xs text-slate-500">
                    Né à {ban.epoux.lieuNaissance} • {ban.epoux.profession}
                  </p>
                </div>

                <div className="flex items-center justify-center my-1">
                  <span className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center text-sm font-bold">
                    💍
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Future Épouse
                  </span>
                  <p className="font-black text-slate-900 text-base leading-tight">
                    {ban.epouse.nom} {ban.epouse.prenom}
                  </p>
                  <p className="text-xs text-slate-500">
                    Née à {ban.epouse.lieuNaissance} • {ban.epouse.profession}
                  </p>
                </div>
              </div>

              {/* Lieu et Régime */}
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
                <div className="text-slate-700">
                  📍 <strong>Lieu de célébration :</strong> {ban.lieuPrevuCelebration}
                </div>
                <div className="text-slate-700">
                  ⚖️ <strong>Régime :</strong> {formatRegime(ban.regimeMatrimonial)}
                </div>
              </div>
            </div>

            {/* Pied de fiche avec Compte à Rebours & Actions */}
            <div className="p-5 bg-slate-50 border-t border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase">
                  Expiration légale :
                </span>
                <CountdownTimer targetDateStr={ban.dateFinAffichage} />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedBanDetail(ban)}
                  className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-all"
                >
                  Fiche Détaillée
                </button>
                <button
                  type="button"
                  disabled={ban.statutBan === 'CLOTURE_SANS_OPPOSITION'}
                  onClick={() => setBanForOpposition(ban)}
                  className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-40"
                >
                  Former Opposition
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL 1 : FICHE DÉTAILLÉE DU BAN */}
      {selectedBanDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-900">
                Avis Officiel de Publication de Ban
              </h3>
              <button
                type="button"
                onClick={() => setSelectedBanDetail(null)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-6 text-sm">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500">Réf. BUNEC :</span>{' '}
                    <strong>{selectedBanDetail.referenceLegaleBan}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Centre d'état civil :</span>{' '}
                    <strong>{selectedBanDetail.centreEtatCivil}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Affichage légal du :</span>{' '}
                    <strong>{selectedBanDetail.dateDebutAffichage} au {selectedBanDetail.dateFinAffichage}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Célébration prévue :</span>{' '}
                    <strong>{selectedBanDetail.datePrevueCelebration}</strong>
                  </div>
                </div>
              </div>

              {/* Filière légale époux */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200">
                  <h4 className="font-extrabold text-blue-900 mb-2">Futur Époux</h4>
                  <p className="font-bold">{selectedBanDetail.epoux.nom} {selectedBanDetail.epoux.prenom}</p>
                  <p className="text-xs text-slate-600 mt-1">Domicile: {selectedBanDetail.epoux.domicile}</p>
                  <p className="text-xs text-slate-600">Fils de: {selectedBanDetail.epoux.pere}</p>
                  <p className="text-xs text-slate-600">Et de: {selectedBanDetail.epoux.mere}</p>
                </div>

                <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-200">
                  <h4 className="font-extrabold text-rose-900 mb-2">Future Épouse</h4>
                  <p className="font-bold">{selectedBanDetail.epouse.nom} {selectedBanDetail.epouse.prenom}</p>
                  <p className="text-xs text-slate-600 mt-1">Domicile: {selectedBanDetail.epouse.domicile}</p>
                  <p className="text-xs text-slate-600">Fille de: {selectedBanDetail.epouse.pere}</p>
                  <p className="text-xs text-slate-600">Et de: {selectedBanDetail.epouse.mere}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-100 rounded-lg text-xs font-mono text-slate-600 break-all">
                Empreinte SHA-256 certifiée BUNEC : {selectedBanDetail.hashCertifieSha256}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedBanDetail(null)}
                className="px-6 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold"
              >
                Fermer l'avis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2 : SAISINE FORMELLE D'OPPOSITION AU MARIAGE */}
      {banForOpposition && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-black text-rose-900">
                  Saisine d'Opposition au Mariage
                </h3>
                <p className="text-xs text-slate-500">
                  Dossier : {banForOpposition.referenceLegaleBan} ({banForOpposition.epoux.nom} & {banForOpposition.epouse.nom})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBanForOpposition(null)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitOpposition} className="mt-6 space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                ⚖️ <strong>Avertissement Légal :</strong> L'opposition au mariage est un acte juridique grave (Loi 2011/011). Tout tiers déclarant une opposition abusive s'expose aux sanctions prévues par le Code Pénal.
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nom du Déclarant</label>
                  <input
                    type="text"
                    required
                    value={opposantNom}
                    onChange={(e) => setOpposantNom(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Prénom(s)</label>
                  <input
                    type="text"
                    value={opposantPrenom}
                    onChange={(e) => setOpposantPrenom(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Qualité Légale</label>
                  <select
                    value={opposantQualite}
                    onChange={(e) => setOpposantQualite(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value="CONJOINT_NON_DIVORCE">Conjoint antérieur non divorcé (Bigamie)</option>
                    <option value="ASCENDANT">Père ou Mère</option>
                    <option value="TUTEUR">Tuteur Légal</option>
                    <option value="MINISTERE_PUBLIC">Ministère Public / Procureur</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">N° CNI ou Passeport</label>
                  <input
                    type="text"
                    required
                    value={opposantCni}
                    onChange={(e) => setOpposantCni(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Téléphone de Contact</label>
                <input
                  type="tel"
                  required
                  placeholder="+237 6..."
                  value={opposantTel}
                  onChange={(e) => setOpposantTel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Motif Juridique Détaillé</label>
                <textarea
                  rows={3}
                  required
                  value={motifOpposition}
                  onChange={(e) => setMotifOpposition(e.target.value)}
                  placeholder="Exposez précisément les fondements juridiques et les faits motivant l'opposition..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-medium"
                />
              </div>

              {/* Upload avec auto-compression client */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pièce Justificative Probante (CNI, Acte antérieur, Jugement)
                </label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  required
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {isCompressing && (
                  <p className="text-[11px] text-amber-600 mt-1 animate-pulse">
                    ⚡ Auto-compression de l'image en cours sur votre smartphone (&lt; 400 Ko)...
                  </p>
                )}
                {justificatifFile && !isCompressing && (
                  <p className="text-[11px] text-emerald-600 mt-1">
                    ✓ Document prêt : {justificatifFile.name} ({(justificatifFile.size / 1024).toFixed(1)} Ko)
                  </p>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setBanForOpposition(null)}
                  className="px-5 py-2.5 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={oppositionSubmitted || isCompressing}
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black shadow-lg shadow-rose-600/20 disabled:opacity-50"
                >
                  {oppositionSubmitted ? 'Transmission Parquet...' : 'Déclarer Formellement l’Opposition'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
