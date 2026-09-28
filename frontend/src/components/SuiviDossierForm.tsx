import React, { useMemo, useRef, useState } from "react";
import { DossierSuiviDetail, TypeActe } from "../types";

type Lang = "fr" | "en";

type Props = {
  language?: Lang;
  onRechercheDebut?: () => void;
  onDossierTrouve?: (dossier: DossierSuiviDetail) => void;
};

const typeOptions: Array<{
  code: TypeActe;
  labelFr: string;
  labelEn: string;
  icon: string;
}> = [
  {
    code: "ACTE_NAISSANCE",
    labelFr: "Naissance",
    labelEn: "Birth",
    icon: "👶",
  },
  { code: "ACTE_MARIAGE", labelFr: "Mariage", labelEn: "Marriage", icon: "💍" },
  { code: "ACTE_DECES", labelFr: "Décès", labelEn: "Death", icon: "🕊️" },
];

const suggestionCatalog: Record<string, string[]> = {
  numeroReference: [
    "REF-2026-001245",
    "REF-2026-001246",
    "REF-2026-001247",
    "REF-2026-001248",
    "REF-2026-001249",
  ],
  numeroDeclaration: [
    "DEC-2026-001249",
    "MAR-2026-004011",
    "DEC-2026-004208",
    "NAI-2026-002315",
    "MAR-2026-007025",
  ],
  nomEnfant: [
    "Jean Luc Mballa",
    "Marie Eve Ndombe",
    "Aubin Tchoua",
    "Nadia Fokou",
    "Esther Moukoko",
  ],
  nomConjoint: [
    "Ebelle Samuel",
    "Fotso Hervé",
    "Kouassi Daniel",
    "Ngono Clarisse",
    "Moundi Éric",
  ],
  nomDecede: [
    "Fouda Roger",
    "Mbang Joseph",
    "Etoe Martin",
    "Noutchou",
    "Tchumeni Nathalie",
  ],
  telephone: ["699123456", "655987321", "675442800", "677889012", "650774112"],
};

const translations = {
  fr: {
    title: "Suivi de dossier",
    subtitle: "Recherche rapide",
    typeActe: "Type d’acte",
    centre: "Centre d’état civil",
    reference: "N° de référence",
    declaration: "N° de déclaration",
    telephone: "Numéro de téléphone",
    email: "Email",
    childName: "Nom de l’enfant",
    marriageName: "Noms des époux",
    deceasedName: "Nom de la personne concernée",
    search: "Rechercher mon dossier",
    verifyOtp: "Vérifier le code OTP",
    otpLabel: "Code OTP",
    noResult: "Aucune correspondance trouvée pour les informations saisies.",
    found: "Dossier trouvé",
    ready: "BAT disponible",
    inProgress: "Dossier en cours de traitement",
    otpMessage: "Saisissez le code reçu par email pour consulter le statut.",
  },
  en: {
    title: "File tracking",
    subtitle: "Quick search",
    typeActe: "Act type",
    centre: "Civil registry center",
    reference: "Ref. no",
    declaration: "Decl. no",
    telephone: "Phone number",
    email: "Email",
    childName: "Child name",
    marriageName: "Spouses’ names",
    deceasedName: "Name of the person concerned",
    search: "Search my file",
    verifyOtp: "Verify OTP code",
    otpLabel: "OTP code",
    noResult: "No match found for the entered information.",
    found: "File found",
    ready: "BAT available",
    inProgress: "File in progress",
    otpMessage: "Enter the code received by email to view the file status.",
  },
} as const;

const centreOptions = [
  "Centre d’État Civil de Yaoundé",
  "Centre d’État Civil de Douala",
  "Centre d’État Civil de Bafoussam",
  "Centre d’État Civil de Garoua",
  "Centre d’État Civil de Bertoua",
];

export const SuiviDossierForm: React.FC<Props> = ({
  language = "fr",
  onRechercheDebut,
  onDossierTrouve,
}) => {
  const [typeActe, setTypeActe] = useState<TypeActe>("ACTE_NAISSANCE");
  const [centreEtatCivil, setCentreEtatCivil] = useState(centreOptions[0]);
  const [numeroReference, setNumeroReference] = useState("");
  const [numeroDeclaration, setNumeroDeclaration] = useState("");
  const [numeroTelephone, setNumeroTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [nomEnfant, setNomEnfant] = useState("");
  const [nomsEpoux, setNomsEpoux] = useState("");
  const [nomDecede, setNomDecede] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpRequired, setOtpRequired] = useState(false);
  const [notificationInfo, setNotificationInfo] = useState("");
  const [pendingDossierId, setPendingDossierId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const searchSequence = useRef(0);

  const t = translations[language];

  const activeFieldLabel = useMemo(() => {
    if (typeActe === "ACTE_NAISSANCE") return t.childName;
    if (typeActe === "ACTE_MARIAGE") return t.marriageName;
    return t.deceasedName;
  }, [typeActe, t]);

  const getDynamicSuggestions = (field: string, value: string) => {
    const source = suggestionCatalog[field] ?? [];
    if (!value.trim()) return source.slice(0, 5);
    const typed = value.toLowerCase();
    return source
      .filter((item) => item.toLowerCase().includes(typed))
      .slice(0, 5);
  };

  const getFieldValue = () => {
    if (typeActe === "ACTE_NAISSANCE") return nomEnfant;
    if (typeActe === "ACTE_MARIAGE") return nomsEpoux;
    return nomDecede;
  };

  const setFieldValue = (value: string) => {
    if (typeActe === "ACTE_NAISSANCE") setNomEnfant(value);
    if (typeActe === "ACTE_MARIAGE") setNomsEpoux(value);
    if (typeActe === "ACTE_DECES") setNomDecede(value);
  };

  const resetCurrentSearchState = () => {
    setPendingDossierId("");
    setOtpRequired(false);
    setNotificationInfo("");
    setOtpCode("");
    setError("");
    setIsLoading(false);
  };

  const buildSearchQuery = () => {
    const params = new URLSearchParams();
    const activeFieldValue = getFieldValue().trim();
    if (numeroReference.trim())
      params.set("numeroRecepisse", numeroReference.trim());
    if (numeroDeclaration.trim())
      params.set("numeroDeclaration", numeroDeclaration.trim());
    if (numeroTelephone.trim()) params.set("telephone", numeroTelephone.trim());
    if (email.trim()) params.set("email", email.trim());
    if (activeFieldValue) params.set("search", activeFieldValue);
    if (typeActe) params.set("typeActe", typeActe);
    return params;
  };

  const handleSearchDossier = async () => {
    const currentSequence = ++searchSequence.current;
    resetCurrentSearchState();
    onRechercheDebut?.();
    const searchParams = buildSearchQuery();
    const hasEnoughInfo =
      getFieldValue().trim().length > 2 ||
      numeroReference.trim() ||
      numeroDeclaration.trim() ||
      numeroTelephone.trim() ||
      email.trim();

    if (!hasEnoughInfo) {
      setError(
        language === "fr"
          ? "Veuillez fournir au moins une information utile pour la recherche."
          : "Please provide at least one useful search detail.",
      );
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/v1/dossiers/suivi?${searchParams.toString()}`,
      );
      const data = await response.json();

      if (currentSequence !== searchSequence.current) return;

      if (!response.ok || !data.success || data.found === false || data.error) {
        onRechercheDebut?.();
        resetCurrentSearchState();
        setError(
          data.error ||
            (language === "fr"
              ? "Aucun dossier correspondant aux informations saisies n’a été trouvé dans la base de données."
              : "No dossier matching the entered information was found in the database."),
        );
        return;
      }

      const dossierId = data.dossier?.id || data.dossierId;
      if (!dossierId) {
        setError(
          language === "fr"
            ? "Le service n’a pas retourné d’identifiant de dossier valide."
            : "The service did not return a valid file identifier.",
        );
        setIsLoading(false);
        return;
      }
      setPendingDossierId(String(dossierId));
      setOtpRequired(true);
      const otpHint = data.otpCode
        ? `Code OTP temporaire : ${data.otpCode}`
        : "";
      setNotificationInfo(
        [
          data.message ||
            (language === "fr"
              ? "Un code OTP a été envoyé pour sécuriser l’accès au statut."
              : "An OTP code was sent to secure access to the file status."),
          otpHint,
        ]
          .filter(Boolean)
          .join(" "),
      );
      setOtpCode(data.otpCode || "");
      setIsLoading(false);
    } catch (err) {
      if (currentSequence !== searchSequence.current) return;
      setOtpRequired(false);
      setNotificationInfo("");
      setError(
        language === "fr"
          ? "Erreur de connexion au service de suivi."
          : "Tracking service connection error.",
      );
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async () => {
    if (!otpCode.trim()) {
      setError(
        language === "fr"
          ? "Veuillez saisir le code OTP."
          : "Please enter the OTP code.",
      );
      return;
    }

    const verifiedDossierId = pendingDossierId;
    const verificationSequence = searchSequence.current;
    try {
      setIsLoading(true);
      setError("");
      const response = await fetch("/api/v1/dossiers/suivi/verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dossierId: verifiedDossierId,
          otp: otpCode.trim(),
          email: email.trim(),
        }),
      });

      const data = await response.json();

      if (
        !response.ok ||
        !data.success ||
        !data.dossier ||
        String(data.dossier.id) !== verifiedDossierId ||
        verifiedDossierId !== pendingDossierId ||
        verificationSequence !== searchSequence.current
      ) {
        setError(
          data.error ||
            (language === "fr"
              ? "Code OTP invalide ou expiré."
              : "OTP code invalid or expired."),
        );
        setIsLoading(false);
        return;
      }

      onDossierTrouve?.(data.dossier as DossierSuiviDetail);
      setOtpRequired(false);
      setNotificationInfo("");
      setError("");
      setIsLoading(false);
    } catch (err) {
      setError(
        language === "fr"
          ? "Vérification OTP impossible."
          : "OTP verification failed.",
      );
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (otpRequired) {
      await handleOtpVerification();
      return;
    }

    await handleSearchDossier();
  };

  const inputFields = [
    {
      key: "numeroReference",
      label: t.reference,
      value: numeroReference,
      setValue: setNumeroReference,
      placeholder: "REF-2026-001249",
    },
    {
      key: "numeroDeclaration",
      label: t.declaration,
      value: numeroDeclaration,
      setValue: setNumeroDeclaration,
      placeholder: "DEC-2026-001249",
    },
    {
      key: "phone",
      label: t.telephone,
      value: numeroTelephone,
      setValue: setNumeroTelephone,
      placeholder: "699123456",
    },
  ];

  const dynamicValue = getFieldValue();
  const suggestions = getDynamicSuggestions(
    typeActe === "ACTE_NAISSANCE"
      ? "nomEnfant"
      : typeActe === "ACTE_MARIAGE"
        ? "nomConjoint"
        : "nomDecede",
    dynamicValue,
  );

  return (
    <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-6">
      <div className="mb-4 border-b border-slate-100 pb-4">
        <div className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
          {t.title}
        </div>
        <h2 className="mt-1 text-xl font-black text-slate-900">{t.subtitle}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-700">
              {t.typeActe}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {typeOptions.map((option) => (
                <button
                  key={option.code}
                  type="button"
                  onClick={() => setTypeActe(option.code)}
                  className={`rounded-2xl border p-3 text-center transition ${
                    typeActe === option.code
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm"
                      : "border-slate-200 bg-slate-50 text-slate-600"
                  }`}
                >
                  <div className="text-2xl">{option.icon}</div>
                  <div className="mt-1 text-xs font-black uppercase">
                    {language === "fr" ? option.labelFr : option.labelEn}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-700">
              {t.centre}
            </label>
            <select
              value={centreEtatCivil}
              onChange={(event) => setCentreEtatCivil(event.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              {centreOptions.map((centre) => (
                <option key={centre} value={centre}>
                  {centre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          {inputFields.map((field) => (
            <div key={field.key} className="relative">
              <label className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.18em] text-slate-700">
                {field.label}
              </label>
              <input
                value={field.value}
                onChange={(event) => field.setValue(event.target.value)}
                placeholder={field.placeholder}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
              {field.key !== "phone" && (
                <div className="mt-2 flex max-h-24 flex-col gap-1 overflow-hidden">
                  {getDynamicSuggestions(
                    field.key === "numeroReference"
                      ? "numeroReference"
                      : field.key === "numeroDeclaration"
                        ? "numeroDeclaration"
                        : "telephone",
                    field.value,
                  ).map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => field.setValue(suggestion)}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-left text-xs text-slate-600 hover:bg-emerald-50 hover:text-emerald-800"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="relative">
            <label className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.18em] text-slate-700">
              {t.email}
            </label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="citoyen@bunec.cm"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          <div className="relative">
            <label className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.18em] text-slate-700">
              {activeFieldLabel}
            </label>
            <input
              value={dynamicValue}
              onChange={(event) => setFieldValue(event.target.value)}
              placeholder={
                typeActe === "ACTE_MARIAGE"
                  ? "Ebelle Samuel & Ngono Clarisse"
                  : typeActe === "ACTE_DECES"
                    ? "Fouda Roger"
                    : "Jean Luc Mballa"
              }
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
            {dynamicValue && (
              <div className="mt-2 flex max-h-24 flex-col gap-1 overflow-hidden">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setFieldValue(suggestion)}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-left text-xs text-slate-600 hover:bg-emerald-50 hover:text-emerald-800"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </div>
        )}

        {otpRequired && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="mb-2 text-sm font-bold text-amber-800">
              {notificationInfo || t.otpMessage}
            </div>
            <label className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.18em] text-slate-700">
              {t.otpLabel}
            </label>
            <input
              value={otpCode}
              onChange={(event) => setOtpCode(event.target.value)}
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-emerald-700 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {isLoading
              ? language === "fr"
                ? otpRequired
                  ? "Vérification..."
                  : "Recherche..."
                : otpRequired
                  ? "Verifying..."
                  : "Searching..."
              : otpRequired
                ? t.verifyOtp
                : t.search}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SuiviDossierForm;
