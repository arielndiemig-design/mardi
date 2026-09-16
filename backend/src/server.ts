import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';

import { uploadMiddleware, autoCompressPipeline } from './middleware/compressionPipeline';
import { TrackingController } from './controllers/trackingController';
import { BansController } from './controllers/bansController';
import { BunecSyncService } from './services/bunecSyncService';

const app = express();
const PORT = process.env.PORT || 4000;

// 1. Sécurité HTTP Institutionnelle
app.use(
  helmet({
    contentSecurityPolicy: false, // Adaptable selon intégration front-end
    crossOriginEmbedderPolicy: false
  })
);

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Bunec-Signature']
  })
);

// 2. Compression HTTP Native Brotli & Gzip sur tous les flux JSON et textuels
app.use(
  compression({
    level: 6,
    threshold: 1024, // Compresse tout payload supérieur à 1 Ko
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    }
  })
);

// 3. Limiteur de Débit (Protection DDoS et Scrapers sur les registres publics)
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Trop de requêtes citoyennes soumises. Veuillez patienter quelques minutes.'
  }
});

app.use('/api/', publicLimiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Exposition statique des justificatifs et vignettes compressés
app.use('/storage', express.static(path.join(process.cwd(), 'storage')));

// ----------------------------------------------------------------------------
// ROUTES OFFICIELLES BUNEC
// ----------------------------------------------------------------------------

/**
 * Référentiel territorial hiérarchique (10 régions & communes du Cameroun)
 */
app.get('/api/v1/referentiel/cameroun', (_req, res) => {
  const referentielPath = path.join(
    process.cwd(),
    'database/seeds/bunec_referentiel_territorial.json'
  );
  if (fs.existsSync(referentielPath)) {
    const data = JSON.parse(fs.readFileSync(referentielPath, 'utf-8'));
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache HTTP 24h
    res.json(data);
  } else {
    res.status(404).json({ error: 'Référentiel territorial non initialisé.' });
  }
});

/**
 * Moteur de Suivi de Dossier d'État Civil
 */
app.get('/api/v1/dossiers/suivi', TrackingController.getSuiviDossier);

/**
 * Registre Dématérialisé des Publications de Bans de Mariage
 */
app.get('/api/v1/bans', BansController.getPublicationsBans);

/**
 * Saisine d'Opposition Formelle avec Pipeline d'Auto-Compression
 */
app.post(
  '/api/v1/bans/:id/oppositions',
  uploadMiddleware.single('justificatif'),
  autoCompressPipeline,
  BansController.submitOpposition
);

/**
 * Microservice d'ingestion générique de pièces d'état civil (CNI, Actes, Jugements)
 */
app.post(
  '/api/v1/documents/compress-upload',
  uploadMiddleware.single('document'),
  autoCompressPipeline,
  (req, res) => {
    if (!req.processedDocument) {
      res.status(400).json({ success: false, error: 'Aucun document téléversé.' });
      return;
    }
    res.status(201).json({
      success: true,
      document: req.processedDocument
    });
  }
);

/**
 * Webhook Sécurisé de Transition d'État BUNEC (Interconnexion Système Central)
 */
app.post('/api/v1/bunec/webhook-transition', async (req, res) => {
  const signature = req.headers['x-bunec-signature'] as string;
  const rawBody = JSON.stringify(req.body);

  if (!signature || !BunecSyncService.verifyWebhookSignature(rawBody, signature)) {
    res.status(401).json({ success: false, error: 'Signature HMAC BUNEC invalide.' });
    return;
  }

  const { trackingId, nouveauStatut, etape, telephoneDemandeur, convocation } = req.body;

  // Déclenchement des notifications citoyennes automatiques
  await BunecSyncService.dispatchMultichannelNotification({
    trackingId,
    nouveauStatut,
    etape,
    telephone: telephoneDemandeur,
    convocation
  });

  res.json({ success: true, message: 'Transition d’état répercutée et notifications dispatchées.' });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(`[BUNEC] Serveur Institutionnel État Civil actif sur le port ${PORT}`);
  console.log(`Compression Brotli/Gzip activée | Sharp WebP/AVIF opérationnel`);
  console.log(`================================================================`);
});

export default app;
