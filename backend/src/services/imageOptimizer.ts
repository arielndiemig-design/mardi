import sharp from 'sharp';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs/promises';

export interface OptimizedImageResult {
  originalFilename: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  sha256Hash: string;
  webpPath: string;
  thumbnailPath: string;
  mimeType: string;
}

export class ImageOptimizerService {
  private static UPLOAD_DIR = process.env.STORAGE_PATH || path.join(process.cwd(), 'storage/justificatifs');
  private static THUMBNAILS_DIR = path.join(ImageOptimizerService.UPLOAD_DIR, 'thumbnails');

  /**
   * Initialise les répertoires de stockage
   */
  public static async initDirectories(): Promise<void> {
    await fs.mkdir(this.UPLOAD_DIR, { recursive: true });
    await fs.mkdir(this.THUMBNAILS_DIR, { recursive: true });
  }

  /**
   * Pipeline d'optimisation sans perte sémantique
   * Transforme toute photo haute résolution de smartphone (> 5-15 Mo)
   * en WebP institutionnel standardisé (< 400 Ko) et génère une vignette (15-25 Ko).
   */
  public static async processImage(
    buffer: Buffer,
    originalName: string,
    documentId: string
  ): Promise<OptimizedImageResult> {
    await this.initDirectories();

    const originalSize = buffer.length;

    // Empreinte cryptographique d'origine pour traçabilité BUNEC
    const sha256Hash = crypto.createHash('sha256').update(buffer).digest('hex');

    const cleanBaseName = `${documentId}_${Date.now()}`;
    const webpFilename = `${cleanBaseName}.webp`;
    const thumbFilename = `${cleanBaseName}_thumb.webp`;

    const fullWebpPath = path.join(this.UPLOAD_DIR, webpFilename);
    const fullThumbPath = path.join(this.THUMBNAILS_DIR, thumbFilename);

    // 1. Pipeline Image Principale : Max 2048px de côté, WebP Q80, strip EXIF
    const optimizedBuffer = await sharp(buffer)
      .rotate() // Respect de l'orientation EXIF avant suppression
      .resize({
        width: 2048,
        height: 2048,
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({
        quality: 80,
        effort: 5,
        smartSubsample: true
      })
      .toBuffer();

    await fs.writeFile(fullWebpPath, optimizedBuffer);
    const compressedSize = optimizedBuffer.length;

    // 2. Pipeline Vignette Rapide (Thumbnail) : Max 320x320, WebP Q65 (Cible 15-25 Ko)
    const thumbnailBuffer = await sharp(optimizedBuffer)
      .resize({
        width: 320,
        height: 320,
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({
        quality: 65,
        effort: 4
      })
      .toBuffer();

    await fs.writeFile(fullThumbPath, thumbnailBuffer);

    const compressionRatio = Number(
      (((originalSize - compressedSize) / originalSize) * 100).toFixed(2)
    );

    return {
      originalFilename: originalName,
      originalSize,
      compressedSize,
      compressionRatio,
      sha256Hash,
      webpPath: `/storage/justificatifs/${webpFilename}`,
      thumbnailPath: `/storage/justificatifs/thumbnails/${thumbFilename}`,
      mimeType: 'image/webp'
    };
  }
}
