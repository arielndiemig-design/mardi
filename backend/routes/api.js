const crypto = require("node:crypto");
const {
  bansDatabase,
  dossiersHistoriqueDatabase,
  dossierMatchesQuery,
  getDossierNotificationEmail,
  normalizeEmail,
  otpVerificationStore,
  territorialData,
} = require("../data/store");
const {
  ADMIN_USERNAME,
  csrfTokens,
  ensureCsrf,
  getClientIp,
  issueCsrfToken,
  issueSession,
  loginAttemptStore,
  maskIdentifier,
  maskPhoneNumber,
  requireAdmin,
  requireSession,
  setCsrfCookie,
  setSessionCookie,
  stripSensitiveText,
  validateAdminCredentials,
} = require("../middleware/security");
const { findByExactCriteria } = require("../services/trackingRepository");
const { checkDatabaseConnection } = require("../database/pool");

function apiRouter(req, res, next) {
  const requestUrl = new URL(req.url, "http://localhost");
  const pathname = requestUrl.pathname;

  // API ROUTING
  // --------------------------------------------------------------------------

  if (pathname === "/api/v1/health" && req.method === "GET") {
    checkDatabaseConnection().then((databaseConnected) => {
      res.writeHead(databaseConnected ? 200 : 503, {
        "Content-Type": "application/json; charset=utf-8",
      });
      res.end(
        JSON.stringify({
          success: databaseConnected,
          database: databaseConnected ? "connected" : "unavailable",
        }),
      );
    });
    return;
  }

  // 1. Référentiel territorial hiérarchique
  if (pathname === "/api/v1/referentiel/cameroun" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(territorialData));
    return;
  }

  // 2. Moteur de Suivi de Dossier
  if (pathname === "/api/v1/dossiers/suivi" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 16_384) req.destroy();
    });
    req.on("end", async () => {
      try {
        const payload = JSON.parse(body || "{}");
        const dossier = await findByExactCriteria({
          regionId: String(payload.regionId || "").trim(),
          communeId: String(payload.communeId || "").trim(),
          typeActe: String(payload.typeActe || "").trim(),
          criterion: String(payload.criterion || "").trim(),
        });

        if (!dossier) {
          res.writeHead(404, {
            "Content-Type": "application/json; charset=utf-8",
          });
          res.end(
            JSON.stringify({
              success: false,
              error: "Aucun dossier ne correspond exactement aux informations saisies.",
            }),
          );
          return;
        }

        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ success: true, found: true, dossier }));
      } catch (error) {
        const statusCode = error.statusCode || 503;
        if (statusCode >= 500) {
          console.error("[BUNEC] Échec de recherche dans PostgreSQL:", error.message);
        }
        res.writeHead(statusCode, {
          "Content-Type": "application/json; charset=utf-8",
        });
        res.end(
          JSON.stringify({
            success: false,
            error:
              statusCode >= 500
                ? "Le service de suivi est indisponible. Vérifiez la connexion à la base de données."
                : error.message,
          }),
        );
      }
    });
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

  next();
}

module.exports = apiRouter;