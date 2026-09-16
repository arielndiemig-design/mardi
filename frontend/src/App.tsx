import React, { useState } from 'react';
import SuiviDossierForm from './components/SuiviDossierForm';
import TimelineDossier from './components/TimelineDossier';
import PublicationsBansGrid from './components/PublicationsBansGrid';

export default function App() {
  const [activeTab, setActiveTab] = useState<'suivi' | 'bans' | 'dr'>('suivi');
  const [dossierActif, setDossierActif] = useState<any | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* BANDEAU TRICOLORE CAMEROUN */}
      <div className="h-1.5 w-full flex">
        <div className="w-1/3 bg-emerald-600"></div>
        <div className="w-1/3 bg-rose-600"></div>
        <div className="w-1/3 bg-amber-400"></div>
      </div>

      {/* EN-TÊTE CENTRÉ SOUVERAIN */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm py-3.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-white flex items-center justify-center font-black text-xl shadow-md border-2 border-amber-400">
            CMR
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-extrabold tracking-wider text-slate-500 uppercase">
              RÉPUBLIQUE DU CAMEROUN • <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-black">BUNEC CENTRAL</span>
            </span>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Bureau National de l'État Civil
            </h1>
            <p className="text-xs text-slate-500">
              Système d'Interconnexion Souverain des Centres d'État Civil (CEC)
            </p>
          </div>
        </div>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* MOT DE BIENVENUE AVEC CLOCHE DE NOTIFICATION / RAPPEL */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 rounded-3xl p-5 sm:p-6 mb-7 text-white shadow-xl border-2 border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="relative p-3.5 rounded-2xl bg-white/10 border border-white/20 text-3xl">
              🔔
              <span className="absolute -top-1 -right-1 flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-amber-400 text-slate-950 text-[10px] font-black items-center justify-center">2</span>
              </span>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-mono">
                PORTAIL OFFICIEL CITOYEN
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                Bienvenue sur le Service Public d'État Civil
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5 max-w-xl">
                Suivi d'avancement d'actes en temps réel, publications légales de bans et convocations SMS/WhatsApp.
              </p>
            </div>
          </div>
        </div>

        {/* 3 ICÔNES D'ACTION SUPÉRIEURES */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-8">
          <button
            onClick={() => setActiveTab('suivi')}
            className={`p-4 sm:p-5 rounded-2xl border text-left flex items-center gap-3.5 transition-all ${
              activeTab === 'suivi' ? 'border-2 border-emerald-600 bg-emerald-50 shadow-md' : 'bg-white border-slate-200'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl shadow-md">
              📋
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">Suivi</span>
              <h3 className="font-black text-slate-900 text-base">Suivi de Dossier</h3>
              <p className="text-xs text-slate-500">Avancement en temps réel</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('bans')}
            className={`p-4 sm:p-5 rounded-2xl border text-left flex items-center gap-3.5 transition-all ${
              activeTab === 'bans' ? 'border-2 border-blue-600 bg-blue-50 shadow-md' : 'bg-white border-slate-200'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl shadow-md">
              💍
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-blue-800 bg-blue-100 px-2 py-0.5 rounded">Bans</span>
              <h3 className="font-black text-slate-900 text-base">Publication de Bans</h3>
              <p className="text-xs text-slate-500">Projets de mariage légaux</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('dr')}
            className={`p-4 sm:p-5 rounded-2xl border text-left flex items-center gap-3.5 transition-all ${
              activeTab === 'dr' ? 'border-2 border-purple-600 bg-purple-50 shadow-md' : 'bg-white border-slate-200'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-2xl shadow-md">
              📜
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-purple-800 bg-purple-100 px-2 py-0.5 rounded">Délivrance Rapide</span>
              <h3 className="font-black text-slate-900 text-base">Votre Acte d'État Civil</h3>
              <p className="text-xs text-slate-500">Consulter & imprimer acte</p>
            </div>
          </button>
        </div>

        {/* CONTENU SELON ONGLET */}
        {activeTab === 'suivi' && (
          <div className="space-y-6">
            <SuiviDossierForm onDossierTrouve={(d) => setDossierActif(d)} />
            {dossierActif && <TimelineDossier dossier={dossierActif} onReset={() => setDossierActif(null)} />}
          </div>
        )}

        {activeTab === 'bans' && (
          <div>
            <div className="mb-4">
              <button onClick={() => setActiveTab('suivi')} className="px-3.5 py-1.5 bg-slate-200 rounded-xl text-xs font-bold">
                ⬅️ Retour au Suivi
              </button>
            </div>
            <PublicationsBansGrid />
          </div>
        )}

        {activeTab === 'dr' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200">
            <button onClick={() => setActiveTab('suivi')} className="px-3.5 py-1.5 bg-slate-200 rounded-xl text-xs font-bold mb-4">
              ⬅️ Retour au Suivi
            </button>
            <h3 className="text-xl font-black text-slate-900">Extrait d'Acte Numérique Certifié</h3>
            <p className="text-xs text-slate-500 mt-1">
              Consultez et imprimez votre extrait avec scellé HMAC-SHA256 souverain BUNEC.
            </p>
          </div>
        )}

      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        BUNEC — Bureau National de l'État Civil • République du Cameroun • Loi N° 2011/011
      </footer>
    </div>
  );
}
