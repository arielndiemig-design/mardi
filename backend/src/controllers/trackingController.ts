import { Request, Response } from 'express';
import { redisClient, CACHE_TTL } from '../config/redis';

// Mock DB ou pool PostgreSQL réel
export class TrackingController {
  /**
   * GET /api/v1/dossiers/suivi
   * Recherche par critères en cascade ou par numéro direct / QR Code
   */
  public static async getSuiviDossier(req: Request, res: Response): Promise<void> {
    try {
      const {
        bunecTrackingId,
        numeroRecepisse,
        qrCode,
        regionId,
        communeId,
        centreId,
        annee,
        typeActe,
        numeroSequentiel
      } = req.query;

      const cacheKey = bunecTrackingId
        ? `suivi:${bunecTrackingId}`
        : numeroRecepisse
        ? `suivi:${numeroRecepisse}`
        : `suivi:${regionId}:${communeId}:${centreId}:${annee}:${typeActe}:${numeroSequentiel}`;

      // 1. Vérification dans le cache Redis
      try {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
          res.setHeader('X-Cache-Status', 'HIT');
          res.json(JSON.parse(cached));
          return;
        }
      } catch (cacheErr) {
        // En cas de panne Redis, bascule transparente sur SQL
      }

      // 2. Construction de la réponse normalisée BUNEC
      // Dans un déploiement réel avec PostgreSQL actif, exécuter la requête SELECT indexée
      const dossierMock = {
        id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
        bunecTrackingId: (bunecTrackingId as string) || 'CE-YA1-00-2026-AN-001249',
        numeroRecepisse: (numeroRecepisse as string) || 'REC-2026-YA1-1249-BUNEC',
        typeActe: (typeActe as string) || 'ACTE_NAISSANCE',
        localisation: {
          region: 'Centre',
          regionId: (regionId as string) || 'CE',
          commune: 'Yaoundé Iᵉʳ',
          communeId: (communeId as string) || 'CE-YA1',
          centre: 'Centre Principal d’État Civil de la Mairie de Yaoundé 1er',
          annee: Number(annee) || 2026,
          numeroSequentiel: Number(numeroSequentiel) || 1249
        },
        demandeur: {
          nom: 'MBIDA',
          prenom: 'Armand Christian',
          telephoneMasque: '+237 699 *** 210'
        },
        cycleDeVie: {
          etapeCourante: 3,
          codeCouleur: 'amber', // 'green' | 'amber' | 'red'
          statutActuel: 'VALIDATION_SIGNEE',
          libelleStatut: 'Signature Électronique de l’Officier Apposée',
          motifBlocage: null,
          etapes: [
            {
              numero: 1,
              nom: 'Dossier déposé & enregistré',
              statut: 'COMPLETED',
              horodatage: '2026-08-25T08:30:00Z',
              description: 'Enregistrement au guichet n°02. Identifiant BUNEC unique généré.',
              acteur: 'Agent de Guichet N° 14'
            },
            {
              numero: 2,
              nom: 'Instruction & Vérification juridique',
              statut: 'COMPLETED',
              horodatage: '2026-08-27T11:15:00Z',
              description: 'Vérification de concordance du certificat d’accouchement et CNI des témoins.',
              acteur: 'Juriste Instructeur Mairie'
            },
            {
              numero: 3,
              nom: 'Validation & Signature de l’Officier',
              statut: 'CURRENT',
              horodatage: '2026-09-02T14:45:00Z',
              description: 'Signature numérique qualifiée apposée. Numérotation au registre officiel BUNEC.',
              acteur: 'M. le Maire / Officier d’État Civil'
            },
            {
              numero: 4,
              nom: 'Disponible au guichet / Retrait',
              statut: 'PENDING',
              horodatage: null,
              description: 'Prêt pour délivrance physique contre remise du récépissé original.',
              convocation: 'Rendez-vous prévu le 10/09/2026 entre 09h00 et 12h00 au Guichet 3',
              dateLimiteConservation: '2026-12-31T17:00:00Z'
            }
          ]
        },
        derniereMiseAJour: '2026-09-02T14:45:00Z'
      };

      // Mise en cache 60 secondes
      try {
        await redisClient.setex(cacheKey, CACHE_TTL.DOSSIER_SUIVI, JSON.stringify(dossierMock));
      } catch {}

      res.setHeader('X-Cache-Status', 'MISS');
      res.json(dossierMock);
    } catch (error) {
      console.error('[SUIVI-DOSSIER-ERROR]', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne lors de la consultation du dossier d’état civil.'
      });
    }
  }
}
