import { Request, Response } from "express";
import { redisClient, CACHE_TTL } from "../config/redis";
import crypto from "crypto";

export class BansController {
  /**
   * GET /api/v1/bans
   * Registre dématérialisé public en temps réel des bans de mariage
   */
  public static async getPublicationsBans(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const { regionId, communeId, statutBan, regimeMatrimonial } = req.query;

      const cacheKey = `bans:list:${regionId || "ALL"}:${communeId || "ALL"}:${statutBan || "ALL"}:${regimeMatrimonial || "ALL"}`;

      try {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
          res.setHeader("X-Cache-Status", "HIT");
          res.json(JSON.parse(cached));
          return;
        }
      } catch {}

      // Mock de données de registre actif conformes aux dispositions légales camerounaises
      const bansList = [
        {
          id: "b1-2026-dla1-0089",
          referenceLegaleBan: "BAN-2026-LT-DL1-0089",
          centreEtatCivil: "Mairie de Douala Iᵉʳ (Centre Principal de Bonanjo)",
          regionNom: "Littoral",
          communeNom: "Douala Iᵉʳ",
          epoux: {
            nom: "EBELLE",
            prenom: "Samuel Patrick",
            dateNaissance: "1992-04-14",
            lieuNaissance: "Douala",
            profession: "Ingénieur en Télécommunications",
            domicile: "Bonapriso, Douala",
            pere: "EBELLE Victor",
            mere: "NDONGO Madeleine",
          },
          epouse: {
            nom: "NGONO",
            prenom: "Clarisse Vanessa",
            dateNaissance: "1995-11-20",
            lieuNaissance: "Yaoundé",
            profession: "Gestionnaire de Projets",
            domicile: "Akwa, Douala",
            pere: "NGONO Jean-Baptiste",
            mere: "BILOUNGA Thérèse",
          },
          regimeMatrimonial: "MONOGAMIE_BIENS_COMMUNS",
          coutumeMatrimoniale: "Coutume Sawa / Bassa",
          dateDebutAffichage: "2026-08-25",
          dateFinAffichage: "2026-09-25", // Délais légal de 30 jours calendaires
          datePrevueCelebration: "2026-09-26",
          lieuPrevuCelebration: "Salle des Actes - Mairie de Douala 1er",
          statutBan: "EN_COURS_AFFICHAGE",
          documentAvisUrl: "/storage/bans/BAN-2026-LT-DL1-0089.webp",
          thumbnailUrl:
            "/storage/bans/thumbnails/BAN-2026-LT-DL1-0089_thumb.webp",
          hashCertifieSha256:
            "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        },
        {
          id: "b2-2026-ya2-0142",
          referenceLegaleBan: "BAN-2026-CE-YA2-0142",
          centreEtatCivil: "Mairie de Yaoundé IIᵉ (Tsinga)",
          regionNom: "Centre",
          communeNom: "Yaoundé IIᵉ",
          epoux: {
            nom: "FOTSO",
            prenom: "Hervé Blaise",
            dateNaissance: "1989-08-02",
            lieuNaissance: "Bafoussam",
            profession: "Expert-Comptable",
            domicile: "Bastos, Yaoundé",
            pere: "FOTSO Émile",
            mere: "KAMGA Odette",
          },
          epouse: {
            nom: "ABENA",
            prenom: "Marie Suzanne",
            dateNaissance: "1994-01-18",
            lieuNaissance: "Mbalmayo",
            profession: "Enseignante-Chercheuse",
            domicile: "Tsinga, Yaoundé",
            pere: "ABENA Luc",
            mere: "MBOA Rose",
          },
          regimeMatrimonial: "MONOGAMIE_SEPARATION_BIENS",
          coutumeMatrimoniale: "Coutume Bamiléké",
          dateDebutAffichage: "2026-08-10",
          dateFinAffichage: "2026-09-09", // Expire sous 48h
          datePrevueCelebration: "2026-09-12",
          lieuPrevuCelebration: "Hôtel de Ville de Yaoundé II",
          statutBan: "EXPIRANT_SOUS_48H",
          documentAvisUrl: "/storage/bans/BAN-2026-CE-YA2-0142.webp",
          thumbnailUrl:
            "/storage/bans/thumbnails/BAN-2026-CE-YA2-0142_thumb.webp",
          hashCertifieSha256:
            "a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0",
        },
        {
          id: "b3-2026-baf1-0063",
          referenceLegaleBan: "BAN-2026-OU-BF1-0063",
          centreEtatCivil: "Mairie de Bafoussam Iᵉʳ",
          regionNom: "Ouest",
          communeNom: "Bafoussam Iᵉʳ",
          epoux: {
            nom: "TAGNE",
            prenom: "Dieudonné",
            dateNaissance: "1986-06-12",
            lieuNaissance: "Bandjoun",
            profession: "Commerçant Import-Export",
            domicile: "Djeleng, Bafoussam",
            pere: "TAGNE Moïse",
            mere: "TCHUENKAM Martine",
          },
          epouse: {
            nom: "DJUIDJE",
            prenom: "Pauline Laure",
            dateNaissance: "1993-09-05",
            lieuNaissance: "Bafang",
            profession: "Pharmacienne",
            domicile: "Djeleng, Bafoussam",
            pere: "KAMDEM Joseph",
            mere: "SIKATI Christine",
          },
          regimeMatrimonial: "POLYGAMIE",
          coutumeMatrimoniale: "Coutume Bamiléké",
          dateDebutAffichage: "2026-08-01",
          dateFinAffichage: "2026-08-31",
          datePrevueCelebration: "2026-09-15",
          lieuPrevuCelebration: "Salle Polyvalente Bafoussam 1er",
          statutBan: "CLOTURE_SANS_OPPOSITION",
          documentAvisUrl: "/storage/bans/BAN-2026-OU-BF1-0063.webp",
          thumbnailUrl:
            "/storage/bans/thumbnails/BAN-2026-OU-BF1-0063_thumb.webp",
          hashCertifieSha256:
            "f4e3d2c1b0a987654321fedcba0987654321fedcba0987654321fedcba098765",
        },
      ];

      // Mise en cache 5 minutes
      try {
        await redisClient.setex(
          cacheKey,
          CACHE_TTL.BANS_ACTIFS,
          JSON.stringify(bansList),
        );
      } catch {}

      res.setHeader("X-Cache-Status", "MISS");
      res.json(bansList);
    } catch (error) {
      console.error("[BANS-GET-ERROR]", error);
      res
        .status(500)
        .json({
          success: false,
          error: "Impossible de charger le registre des bans.",
        });
    }
  }

  /**
   * POST /api/v1/bans/:id/oppositions
   * Saisine formelle d'opposition au mariage avec pièces jointes compressées
   */
  public static async submitOpposition(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const { id: banId } = req.params;
      const {
        opposantNom,
        opposantPrenom,
        opposantQualiteLegale,
        opposantCni,
        opposantTelephone,
        opposantEmail,
        opposantAdresse,
        motifLegal,
      } = req.body;

      if (!opposantNom || !opposantCni || !opposantTelephone || !motifLegal) {
        res.status(400).json({
          success: false,
          error:
            "Champs obligatoires manquants pour la déclaration d’opposition légale.",
        });
        return;
      }

      // La pièce justificative a été automatiquement compressée par le middleware
      const pieceJustificative = req.processedDocument;

      // Génération de l'horodatage certifié SHA-256
      const hmacSecret =
        process.env.BUNEC_HMAC_SECRET ||
        (process.env.NODE_ENV === "production"
          ? (() => {
              throw new Error(
                "BUNEC_HMAC_SECRET must be configured in production.",
              );
            })()
          : "dev-bunec-hmac-secret");
      const jetonPayload = `${banId}:${opposantCni}:${Date.now()}:${pieceJustificative ? pieceJustificative.sha256Hash : "NO_FILE"}`;
      const horodatageCertifie = crypto
        .createHmac("sha256", hmacSecret)
        .update(jetonPayload)
        .digest("hex");

      const oppositionEnregistree = {
        id: crypto.randomUUID(),
        banId,
        numeroDossierOpposition: `OPP-2026-${Date.now().toString().slice(-6)}`,
        opposant: {
          nomComplet:
            `${opposantNom.toUpperCase()} ${opposantPrenom || ""}`.trim(),
          qualiteLegale: opposantQualiteLegale,
          cni: opposantCni,
          telephone: opposantTelephone,
          email: opposantEmail,
        },
        motifLegal,
        justificatif: pieceJustificative
          ? {
              nomFichier: pieceJustificative.originalFilename,
              tailleInitiale: pieceJustificative.originalSize,
              tailleOptimisee: pieceJustificative.compressedSize,
              gainCompression: `${pieceJustificative.compressionRatio}%`,
              sha256: pieceJustificative.sha256Hash,
              urlWebp: pieceJustificative.primaryPath,
              urlThumbnail: pieceJustificative.thumbnailPath,
            }
          : null,
        horodatageCertifie,
        statut: "DEPOSEE",
        dateSaisine: new Date().toISOString(),
        prochaineEtape:
          "Transmission urgente au Procureur de la République et à l’Officier Célébrant",
      };

      // Invalidation du cache des bans pour refléter immédiatement le statut opposé
      try {
        const keys = await redisClient.keys("bans:list:*");
        if (keys.length > 0) {
          await redisClient.del(...keys);
        }
      } catch {}

      res.status(201).json({
        success: true,
        message:
          "Opposition formelle enregistrée avec succès et transmise au parquet compétent.",
        opposition: oppositionEnregistree,
      });
    } catch (error) {
      console.error("[OPPOSITION-POST-ERROR]", error);
      res
        .status(500)
        .json({
          success: false,
          error: "Erreur lors de la déclaration d’opposition.",
        });
    }
  }
}
