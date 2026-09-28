import React from "react";
import { DossierSuiviDetail } from "../types";

interface TimelineDossierProps {
  dossier: DossierSuiviDetail;
  language?: "fr" | "en";
  onReset?: () => void;
  onVisualiserBat?: () => void;
}

export const TimelineDossier: React.FC<TimelineDossierProps> = ({
  dossier,
  language = "fr",
  onReset,
  onVisualiserBat,
}) => {
  const isReady =
    dossier.bat?.available === true && dossier.bat.dossierId === dossier.id;
  const steps = dossier.cycleDeVie.etapes.map((etape) => {
    const date = etape.horodatage
      ? new Date(etape.horodatage)
      : null;
    return {
      numero: etape.numero,
      title: etape.nom,
      date: date && !Number.isNaN(date.getTime())
        ? date.toLocaleDateString(language === "fr" ? "fr-FR" : "en-GB")
        : language === "fr" ? "À venir" : "Pending",
      time: date && !Number.isNaN(date.getTime())
        ? date.toLocaleTimeString(language === "fr" ? "fr-FR" : "en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",
      responsable: etape.acteur || "—",
      description: etape.description,
      statut: etape.statut,
    };
  });

  const activeStep = dossier.cycleDeVie.etapeCourante;

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
      <div className="border-b border-slate-200 bg-gradient-to-r from-emerald-50 via-white to-emerald-100 p-5 sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">
              {language === "fr" ? "Résultat du dossier" : "File result"}
            </div>
            <h3 className="mt-1 text-2xl font-black text-slate-900">
              {dossier.bunecTrackingId}
            </h3>
            <p className="text-sm text-slate-600">
              {dossier.localisation.centre}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-900">
            {language === "fr" ? "État actuel" : "Current status"} :{" "}
            {dossier.cycleDeVie.libelleStatut}
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
              {language === "fr" ? "Type d’acte" : "Act type"}
            </div>
            <div className="mt-1 font-bold text-slate-900">
              {dossier.typeActe}
            </div>
          </div>
          <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
              {language === "fr" ? "Centre" : "Center"}
            </div>
            <div className="mt-1 font-bold text-slate-900">
              {dossier.localisation.commune}
            </div>
          </div>
          <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
              {language === "fr" ? "Référence" : "Reference"}
            </div>
            <div className="mt-1 font-bold text-slate-900">
              {dossier.numeroRecepisse}
            </div>
          </div>
          <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
              {language === "fr" ? "Responsable" : "Responsible"}
            </div>
            <div className="mt-1 font-bold text-slate-900">
              {dossier.demandeur.nomComplet || dossier.demandeur.nom || "—"}
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
          <h4 className="text-lg font-black text-slate-900">
            {language === "fr" ? "Chronologie du dossier" : "File timeline"}
          </h4>
          {isReady && onVisualiserBat && (
            <button
              type="button"
              onClick={onVisualiserBat}
              className="rounded-xl bg-violet-600 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white hover:bg-violet-700"
            >
              {language === "fr" ? "Visualiser le BAT" : "View BAT"}
            </button>
          )}
        </div>

        <div className="relative space-y-6 before:absolute before:left-5 before:top-3 before:h-[calc(100%-1.5rem)] before:w-px before:bg-slate-200">
          {steps.map((step) => {
            const isCurrent = step.statut === "CURRENT" || step.numero === activeStep;
            const isCompleted = step.statut === "COMPLETED";

            return (
              <div key={step.numero} className="relative flex gap-4">
                <div
                  className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white text-xs font-black shadow-md"
                  style={{
                    background: isCurrent
                      ? "#f59e0b"
                      : isCompleted
                        ? "#10b981"
                        : "#e2e8f0",
                    color: isCurrent || isCompleted ? "white" : "#475569",
                  }}
                >
                  {isCompleted ? "✓" : step.numero}
                </div>

                <div
                  className={`flex-1 rounded-2xl border p-4 ${isCurrent ? "border-amber-200 bg-amber-50" : isCompleted ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                        {language === "fr" ? "Étape" : "Step"} {step.numero}
                      </div>
                      <div className="mt-1 text-base font-black text-slate-900">
                        {step.title}
                      </div>
                    </div>
                    <div className="text-xs font-mono text-slate-600">
                      {step.date} {step.time}
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-slate-700">
                    {step.description}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                    <span className="rounded-full bg-white px-2 py-1 font-bold">
                      {language === "fr" ? "Responsable" : "Person in charge"} :{" "}
                      {step.responsable}
                    </span>
                    {isCurrent && (
                      <span className="rounded-full bg-amber-200 px-2 py-1 font-black text-amber-900">
                        {language === "fr" ? "Étape actuelle" : "Current step"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {onReset && (
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onReset}
              className="rounded-xl bg-slate-200 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-slate-700"
            >
              {language === "fr" ? "Nouvelle recherche" : "New search"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineDossier;
