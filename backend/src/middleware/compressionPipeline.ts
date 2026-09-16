import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ImageOptimizerService, OptimizedImageResult } from '../services/imageOptimizer';
import { PdfOptimizerService, OptimizedPdfResult } from '../services/pdfOptimizer';

// Configuration Multer en mémoire vive (pas d'écriture disque avant compression)
const storage = multer.memoryStorage();

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024 // Limite brute de 25 Mo acceptée en entrée smartphone
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/heic',
      'application/pdf'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Format non supporté: ${file.mimetype}. Formats acceptés: JPEG, PNG, WEBP, HEIC, PDF`));
    }
  }
});

export interface ProcessedDocument {
  id: string;
  originalFilename: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  sha256Hash: string;
  primaryPath: string;
  thumbnailPath: string;
  mimeType: string;
}

declare global {
  namespace Express {
    interface Request {
      processedDocument?: ProcessedDocument;
    }
  }
}

/**
 * Middleware d'interception et compression automatique
 * Exécute l'optimisation en mémoire avant stockage définitif.
 */
export async function autoCompressPipeline(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (!req.file) {
    return next();
  }

  const documentId = uuidv4();
  const file = req.file;

  try {
    let result: OptimizedImageResult | OptimizedPdfResult;

    if (file.mimetype === 'application/pdf') {
      result = await PdfOptimizerService.processPdf(file.buffer, file.originalname, documentId);
      req.processedDocument = {
        id: documentId,
        originalFilename: result.originalFilename,
        originalSize: result.originalSize,
        compressedSize: result.compressedSize,
        compressionRatio: result.compressionRatio,
        sha256Hash: result.sha256Hash,
        primaryPath: (result as OptimizedPdfResult).pdfPath,
        thumbnailPath: result.thumbnailPath,
        mimeType: result.mimeType
      };
    } else {
      // Toutes les images sont converties en WebP optimisé
      result = await ImageOptimizerService.processImage(file.buffer, file.originalname, documentId);
      req.processedDocument = {
        id: documentId,
        originalFilename: result.originalFilename,
        originalSize: result.originalSize,
        compressedSize: result.compressedSize,
        compressionRatio: result.compressionRatio,
        sha256Hash: result.sha256Hash,
        primaryPath: (result as OptimizedImageResult).webpPath,
        thumbnailPath: result.thumbnailPath,
        mimeType: result.mimeType
      };
    }

    console.log(
      `[AUTO-COMPRESS] Document ${documentId} optimisé: ${req.processedDocument.originalSize}o -> ${req.processedDocument.compressedSize}o (Gain: ${req.processedDocument.compressionRatio}%)`
    );

    next();
  } catch (error) {
    console.error('[AUTO-COMPRESS-ERROR]', error);
    res.status(500).json({
      success: false,
      error: 'Échec du traitement et de la compression de la pièce justificative.'
    });
  }
}
