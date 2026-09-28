import crypto from "crypto";

export interface BunecStatusTransitionPayload {
  trackingId: string;
  numeroRecepisse: string;
  statutNouveau:
    | "DEPOSE"
    | "EN_INSTRUCTION"
    | "VALIDATION_SIGNEE"
    | "PRET_DELIVRANCE"
    | "REJETE_BLOQUE";
  etape: 1 | 2 | 3 | 4;
  agentMatricule: string;
  motifRejetCode?: string;
  motifRejetDescription?: string;
  signatureElectroniqueHash?: string;
  convocationHoraire?: string;
  guichetNumero?: string;
  timestamp: string;
}

export class BunecSyncService {
  private static BUNEC_HMAC_SECRET =
    process.env.BUNEC_HMAC_SECRET ||
    (process.env.NODE_ENV === "production"
      ? (() => {
          throw new Error(
            "BUNEC_HMAC_SECRET must be configured in production.",
          );
        })()
      : "dev-bunec-hmac-secret");
  private static BUNEC_API_URL =
    process.env.BUNEC_CENTRAL_URL || "https://central.bunec.cm/api/v1";

  /**
   * Vérifie la signature HMAC-SHA256 d'un webhook émis par le système central BUNEC
   */
  public static verifyWebhookSignature(
    payload: string,
    receivedSignature: string,
  ): boolean {
    const computedSignature = crypto
      .createHmac("sha256", this.BUNEC_HMAC_SECRET)
      .update(payload)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(computedSignature, "utf8"),
      Buffer.from(receivedSignature, "utf8"),
    );
  }

  /**
   * Génère un identifiant de traçabilité BUNEC normalisé
   * Exemple : CE-YA1-00-2026-AN-001249
   */
  public static generateTrackingId(
    regionId: string,
    communeCode: string,
    centreCode: string,
    annee: number,
    typeActeCode: string,
    seq: number,
  ): string {
    const paddedSeq = String(seq).padStart(6, "0");
    return `${regionId}-${communeCode}-${centreCode}-${annee}-${typeActeCode}-${paddedSeq}`;
  }

  /**
   * Déclencheur des notifications proactives multicanal
   * Passerelle SMS locale (ex: Orange/MTN Cameroon), WhatsApp Cloud API, E-mail
   */
  public static async dispatchMultichannelNotification(params: {
    telephone: string;
    email?: string;
    trackingId: string;
    nouveauStatut: string;
    etape: number;
    convocation?: string;
    motifRejet?: string;
  }): Promise<{ sms: boolean; whatsapp: boolean; email: boolean }> {
    console.log(
      `[BUNEC-NOTIF] Envoi notification transition état pour dossier ${params.trackingId} vers ${params.telephone}`,
    );

    const messageCitoyen = this.buildNotificationMessage(params);

    // Simulation des appels d'API vers les passerelles télécoms sécurisées
    const results = {
      sms: true,
      whatsapp: true,
      email: !!params.email,
    };

    // Logique réelle d'intégration des passerelles :
    // 1. Appel HTTP API passerelle SMS nationale (SMPP/HTTPS)
    // 2. Appel WhatsApp Cloud API (Graph API Meta)
    // 3. Appel SMTP sécurisé vers l'adresse du citoyen
    return results;
  }

  private static buildNotificationMessage(params: {
    trackingId: string;
    nouveauStatut: string;
    etape: number;
    convocation?: string;
    motifRejet?: string;
  }): string {
    switch (params.nouveauStatut) {
      case "EN_INSTRUCTION":
        return `[BUNEC] Votre dossier ${params.trackingId} est en cours d'instruction et vérification juridique en mairie.`;
      case "VALIDATION_SIGNEE":
        return `[BUNEC] Félicitations ! Votre acte ${params.trackingId} a été validé et signé électroniquement par l'Officier.`;
      case "PRET_DELIVRANCE":
        return `[BUNEC] Votre acte ${params.trackingId} est DISPONIBLE AU GUICHET. Rendez-vous muni de votre récépissé ${params.convocation ? `le ${params.convocation}` : ""}.`;
      case "REJETE_BLOQUE":
        return `[BUNEC-ATTENTION] Dossier ${params.trackingId} bloqué : ${params.motifRejet || "Pièce non conforme"}. Veuillez vous rapprocher de votre centre.`;
      default:
        return `[BUNEC] Votre dossier ${params.trackingId} a été enregistré avec succès.`;
    }
  }
}
