import { useState } from "react";
import SuiviDossierForm from "./components/SuiviDossierForm";
import TimelineDossier from "./components/TimelineDossier";
import { PublicationsBansGrid } from "./components/PublicationsBansGrid";
import { DossierSuiviDetail } from "./types";

type Lang = "fr" | "en";
type Tab = "accueil" | "suivi" | "bans" | "acte";

const textContent = {
  fr: {
    home: "Accueil",
    suivi: "Suivi de dossier",
    bans: "Publication des bans",
    acte: "Votre acte",
    official: "Portail",
    quickSearch: "Recherche rapide",
    dossierReady: "Votre acte est disponible",
    openAct: "Visualiser le BAT",
    subtitle: "Portail de suivi de dossier des faits d'état civil",
  },
  en: {
    home: "Home",
    suivi: "Case tracking",
    bans: "Marriage bans",
    acte: "Your act",
    official: "Portal",
    quickSearch: "Quick search",
    dossierReady: "Your certificate is ready",
    openAct: "View BAT",
    subtitle: "Civil status case tracking portal",
  },
} as const;

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("accueil");
  const [lang, setLang] = useState<Lang>("fr");
  const [dossierActif, setDossierActif] = useState<DossierSuiviDetail | null>(
    null,
  );

  const resetResultatsRecherche = () => {
    setDossierActif(null);
    setActiveTab("suivi");
  };

  const isBatAvailable =
    dossierActif?.bat?.available === true &&
    dossierActif.bat.dossierId === dossierActif.id;
  const t = textContent[lang];

  const overviewCards = [
    {
      id: "accueil",
      label: t.home,
      icon: "🏠",
      desc: "Vue d’ensemble du portail",
    },
    { id: "suivi", label: t.suivi, icon: "📋", desc: "Suivi des dossiers" },
    { id: "bans", label: t.bans, icon: "💍", desc: "Registre des bans" },
    ...(isBatAvailable
      ? [{ id: "acte", label: t.acte, icon: "📜", desc: "BAT disponible" }]
      : []),
  ] as const;

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 text-slate-800 flex flex-col font-sans">
      <div className="h-1.5 w-full flex">
        <div className="w-1/3 bg-emerald-600" />
        <div className="w-1/3 bg-rose-600" />
        <div className="w-1/3 bg-amber-400" />
      </div>

      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-3 py-3 sm:px-4 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex items-center justify-center gap-3 md:justify-start">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-lg font-black text-white shadow-md border-2 border-amber-400 sm:h-12 sm:w-12">
              CMR
            </div>
            <div className="text-center md:text-left">
              <div className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-slate-500 sm:text-[10px]">
                République du Cameroun
              </div>
              <h1 className="text-base font-black text-slate-900 sm:text-lg">
                {t.subtitle}
              </h1>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 md:justify-end">
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1">
              {(["fr", "en"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setLang(option)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    lang === option
                      ? "bg-white text-emerald-800 shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  {option === "fr" ? "FR" : "EN"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {overviewCards.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id as Tab)}
              className={`w-full rounded-2xl border p-4 text-left transition ${
                activeTab === item.id
                  ? "border-emerald-600 bg-emerald-50 shadow-md"
                  : "border-slate-200 bg-white hover:border-emerald-200 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-xl text-white shadow-sm">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                    {t.official}
                  </div>
                  <h2 className="text-base font-black text-slate-900">
                    {item.label}
                  </h2>
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-600">{item.desc}</p>
            </button>
          ))}
        </div>

        {activeTab === "accueil" && (
          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
                {t.official}
              </div>
              <h2 className="mt-2 text-xl font-black text-slate-900 sm:text-2xl">
                {t.subtitle}
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-slate-600">
                Suivi citoyen, publication des bans et visualisation des actes
                de l’état civil du Cameroun dans une interface unique et
                lisible.
              </p>
            </section>

            <section className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <div className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">
                  Suivi
                </div>
                <div className="mt-2 text-xl font-black text-slate-900">
                  Dossiers
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Traçabilité complète des actes et étapes.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <div className="text-xs font-black uppercase tracking-[0.16em] text-amber-700">
                  Bans
                </div>
                <div className="mt-2 text-xl font-black text-slate-900">
                  Publication
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Inventaire des bans avec statut et opposition.
                </p>
              </div>

              <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5">
                <div className="text-xs font-black uppercase tracking-[0.16em] text-violet-700">
                  Acte
                </div>
                <div className="mt-2 text-xl font-black text-slate-900">
                  BAT
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Accès direct au document prêt à être délivré.
                </p>
              </div>
            </section>
          </div>
        )}

        {activeTab === "suivi" && (
          <div className="space-y-6">
            <SuiviDossierForm
              language={lang}
              onRechercheDebut={resetResultatsRecherche}
              onDossierTrouve={(d) => {
                setDossierActif(d);
                setActiveTab("suivi");
              }}
            />
            {dossierActif && (
              <TimelineDossier
                dossier={dossierActif}
                language={lang}
                onReset={() => setDossierActif(null)}
                onVisualiserBat={() => setActiveTab("acte")}
              />
            )}
          </div>
        )}

        {activeTab === "bans" && <PublicationsBansGrid language={lang} />}

        {activeTab === "acte" && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.2em] text-violet-700">
                  BAT
                </div>
                <h3 className="mt-2 text-2xl font-black text-slate-900">
                  {t.dossierReady}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("suivi")}
                className="rounded-xl bg-slate-200 px-4 py-2 text-xs font-black text-slate-700"
              >
                {lang === "fr" ? "Retour au suivi" : "Back to tracking"}
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-violet-200 bg-violet-50 p-5 text-sm text-violet-900">
              {isBatAvailable && dossierActif ? (
                <>
                  <div className="font-bold">
                    {lang === "fr"
                      ? "Votre document est prêt à être visualisé."
                      : "Your document is ready to be reviewed."}
                  </div>
                  <div className="mt-2">
                    {lang === "fr" ? "Type d’acte" : "Document type"} :{" "}
                    {dossierActif.typeActe}
                  </div>
                  <div className="mt-2">
                    {lang === "fr" ? "Numéro de référence" : "Reference number"}{" "}
                    : {dossierActif.numeroRecepisse}
                  </div>
                </>
              ) : (
                <div>
                  {lang === "fr"
                    ? "Aucun dossier éligible pour l’affichage du BAT."
                    : "No eligible file is available for BAT viewing."}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        BUNEC — Bureau National de l’État Civil • République du Cameroun
      </footer>
    </div>
  );
}
