import React from 'react';
import { DossierSuiviDetail, EtapeCycleVie } from '../types';

interface TimelineDossierProps {
  dossier: DossierSuiviDetail;
}

export const TimelineDossier: React.FC<TimelineDossierProps> = ({ dossier }) => {
  const { cycleDeVie, demandeur, localisation, typeActe, bunecTrackingId, numeroRecepisse } = dossier;

  // Code couleur de la carte globale
  const getBannerColorClass = (codeCouleur: 'green' | 'amber' | 'red') => {
    switch (codeCouleur) {
      case 'green':
        return 'bg-emerald-50 border-emerald-300 text-emerald-900';
      case 'amber':
        return 'bg-amber-50 border-amber-300 text-amber-900';
      case 'red':
        return 'bg-rose-50 border-rose-300 text-rose-900';
    }
  };

  const getStatusBadge = (codeCouleur: 'green' | 'amber' | 'red', libelle: string) => {
    switch (codeCouleur) {
      case 'green':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {libelle}
          </span>
        );
      case 'amber':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            {libelle}
          </span>
        );
      case 'red':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            {libelle}
          </span>
        );
    }
  };

  const getStepIcon = (etape: EtapeCycleVie, isCurrent: boolean, isBlocked: boolean) => {
    if (isBlocked) {
      return (
        <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-sm shadow-md ring-4 ring-rose-100">
          ✕
        </div>
      );
    }
    if (etape.statut === 'COMPLETED') {
      return (
        <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-md ring-4 ring-emerald-100">
          ✓
        </div>
      );
    }
    if (isCurrent) {
      return (
        <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-md ring-4 ring-amber-100 animate-bounce">
          {etape.numero}
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm">
        {etape.numero}
      </div>
    );
  };

  const isDossierBloque = cycleDeVie.codeCouleur === 'red';

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-300">
      {/* En-tête officiel du dossier */}
      <div className={`p-6 border-b ${getBannerColorClass(cycleDeVie.codeCouleur)}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-widest font-extrabold text-slate-500">
                RÉPÉCISSÉ BUNEC
              </span>
              <span className="font-mono text-xs bg-slate-200/70 px-2 py-0.5 rounded text-slate-700">
                {numeroRecepisse}
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {bunecTrackingId}
            </h2>
            <p className="text-sm font-medium text-slate-600 mt-1">
              {localisation.centre} — {localisation.commune} ({localisation.region})
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            {getStatusBadge(cycleDeVie.codeCouleur, cycleDeVie.libelleStatut)}
            <span className="text-xs text-slate-500">
              Demandeur: <strong className="text-slate-700">{demandeur.nom} {demandeur.prenom}</strong>
            </span>
          </div>
        </div>

        {/* Alerte explicite si dossier rejeté ou bloqué */}
        {isDossierBloque && cycleDeVie.motifBlocage && (
          <div className="mt-4 p-4 rounded-xl bg-rose-100 border border-rose-300 text-rose-900 text-sm flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-bold text-rose-950">
                Motif du blocage : {cycleDeVie.motifBlocage.libelle}
              </p>
              <p className="mt-0.5 text-rose-800">
                {cycleDeVie.motifBlocage.description}
              </p>
              <p className="mt-2 text-xs font-semibold text-rose-900 uppercase">
                Action requise : Présentez-vous muni des pièces complémentaires au guichet n°02.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Timeline visuelle des 4 étapes */}
      <div className="p-6 md:p-8">
        <h3 className="text-lg font-bold text-slate-800 mb-8 flex items-center gap-2">
          <span>Cycle de Vie Institutionnel du Dossier</span>
          <span className="text-xs font-normal text-slate-500">(Interconnecté BUNEC Central)</span>
        </h3>

        <div className="relative">
          {/* Ligne connectrice de fond */}
          <div className="absolute top-5 left-5 -ml-px w-0.5 h-[calc(100%-40px)] bg-slate-200 hidden md:block" />

          <div className="space-y-8">
            {cycleDeVie.etapes.map((etape) => {
              const isCurrent = etape.numero === cycleDeVie.etapeCourante;
              const isStepBlocked = isDossierBloque && isCurrent;

              return (
                <div key={etape.numero} className="relative flex flex-col md:flex-row items-start gap-4">
                  {/* Puce d'étape */}
                  <div className="flex-shrink-0 z-10">
                    {getStepIcon(etape, isCurrent, isStepBlocked)}
                  </div>

                  {/* Contenu textuel de l'étape */}
                  <div
                    className={`flex-grow p-4 md:p-5 rounded-xl border transition-all ${
                      isCurrent
                        ? isStepBlocked
                          ? 'bg-rose-50/70 border-rose-300 shadow-sm'
                          : 'bg-amber-50/70 border-amber-300 shadow-sm'
                        : etape.statut === 'COMPLETED'
                        ? 'bg-slate-50/80 border-slate-200'
                        : 'bg-white border-dashed border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                        <span>Étape {etape.numero} : {etape.nom}</span>
                        {isCurrent && (
                          <span className="text-xs px-2 py-0.5 bg-amber-200 text-amber-900 rounded font-semibold">
                            Étape active
                          </span>
                        )}
                      </h4>
                      {etape.horodatage && (
                        <span className="text-xs font-mono text-slate-500">
                          {new Date(etape.horodatage).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-slate-600 mt-1">{etape.description}</p>

                    {etape.acteur && (
                      <div className="mt-2 text-xs font-medium text-slate-500">
                        Agent / Entité d’instruction : <span className="text-slate-700">{etape.acteur}</span>
                      </div>
                    )}

                    {/* Étape 4 spécifique : Convocation et délai de retrait */}
                    {etape.convocation && (
                      <div className="mt-3 p-3 bg-emerald-100/70 border border-emerald-300 rounded-lg text-xs text-emerald-900">
                        <strong className="block font-bold mb-0.5">📅 Convocation citoyenne :</strong>
                        {etape.convocation}
                        {etape.dateLimiteConservation && (
                          <span className="block text-emerald-700 mt-1">
                            Conservation garantie au centre jusqu’au :{' '}
                            {new Date(etape.dateLimiteConservation).toLocaleDateString('fr-FR')}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notifications multicanal statut */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-700">Canaux d'alerte actifs :</span>
            <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded text-slate-700">
              📱 SMS ({demandeur.telephoneMasque})
            </span>
            <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded text-slate-700">
              💬 WhatsApp
            </span>
            <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded text-slate-700">
              ✉️ E-mail
            </span>
          </div>

          <div className="font-mono text-[11px] text-slate-400">
            Dernière synchronisation centrale : {new Date(dossier.derniereMiseAJour).toLocaleTimeString('fr-FR')}
          </div>
        </div>
      </div>
    </div>
  );
};
