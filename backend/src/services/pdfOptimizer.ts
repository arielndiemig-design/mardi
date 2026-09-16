import { exec } from 'child_process';
import util from 'util';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';

const execAsync = util.promisify(exec);

export interface OptimizedPdfResult {
  originalFilename: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  sha256Hash: string;
  pdfPath: string;
  thumbnailPath: string;
  mimeType: string;
}

export class PdfOptimizerService {
  private static UPLOAD_DIR = process.env.STORAGE_PATH || path.join(process.cwd(), 'storage/justificatifs');
  private static THUMBNAILS_DIR = path.join(PdfOptimizerService.UPLOAD_DIR, 'thumbnails');
  private static TEMP_DIR = path.join(process.cwd(), 'storage/temp');

  public static async initDirectories(): Promise<void> {
    await fs.mkdir(this.UPLOAD_DIR, { recursive: true });
    await fs.mkdir(this.THUMBNAILS_DIR, { recursive: true });
    await fs.mkdir(this.TEMP_DIR, { recursive: true });
  }

  /**
   * Compresse et linéarise un fichier PDF numérisé via Ghostscript
   * Applique le profil /ebook (150 DPI, compression Flate/JPEG optimisée, Fast Web View).
   * Réduit couramment les scans administratifs de 10-20 Mo à moins de 1-2 Mo.
   */
  public static async processPdf(
    buffer: Buffer,
    originalName: string,
    documentId: string
  ): Promise<OptimizedPdfResult> {
    await this.initDirectories();

    const originalSize = buffer.length;
    const sha256Hash = crypto.createHash('sha256').update(buffer).digest('hex');

    const cleanBaseName = `${documentId}_${Date.now()}`;
    const tempInputPath = path.join(this.TEMP_DIR, `${cleanBaseName}_raw.pdf`);
    const outputPdfFilename = `${cleanBaseName}_optimized.pdf`;
    const finalPdfPath = path.join(this.UPLOAD_DIR, outputPdfFilename);
    const thumbFilename = `${cleanBaseName}_pdf_thumb.webp`;
    const finalThumbPath = path.join(this.THUMBNAILS_DIR, thumbFilename);

    try {
      await fs.writeFile(tempInputPath, buffer);

      // Exécution de Ghostscript avec optimisation sans perte de lisibilité
      // gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH
      const gsCommand = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dFastWebView=true -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${finalPdfPath}" "${tempInputPath}"`;
      
      try {
        await execAsync(gsCommand);
      } catch (execErr) {
        // En cas d'absence de binaire Ghostscript sur l'hôte, fallback sur le fichier brut copié
        console.warn('[PDF-OPTIMIZER] Ghostscript non disponible, bascule directe:', (execErr as Error).message);
        await fs.copyFile(tempInputPath, finalPdfPath);
      }

      const compressedStats = await fs.stat(finalPdfPath);
      const compressedSize = compressedStats.size;

      // Génération de la première page en vignette via pdftoppm ou Sharp
      try {
        const tempThumbPng = path.join(this.TEMP_DIR, `${cleanBaseName}_page-1.png`);
        await execAsync(`pdftoppm -png -f 1 -l 1 -r 72 "${finalPdfPath}" "${path.join(this.TEMP_DIR, cleanBaseName)}"`);
        
        if (await fs.stat(tempThumbPng).catch(() => null)) {
          const pngBuffer = await fs.readFile(tempThumbPng);
          const thumbWebpBuffer = await sharp(pngBuffer)
            .resize(320, 420, { fit: 'inside' })
            .webp({ quality: 65 })
            .toBuffer();
          await fs.writeFile(finalThumbPath, thumbWebpBuffer);
          await fs.unlink(tempThumbPng).catch(() => {});
        } else {
          await this.generatePlaceholderThumbnail(finalThumbPath);
        }
      } catch {
        await this.generatePlaceholderThumbnail(finalThumbPath);
      }

      // Nettoyage temporaire
      await fs.unlink(tempInputPath).catch(() => {});

      const compressionRatio = Number(
        (((originalSize - compressedSize) / originalSize) * 100).toFixed(2)
      );

      return {
        originalFilename: originalName,
        originalSize,
        compressedSize,
        compressionRatio,
        sha256Hash,
        pdfPath: `/storage/justificatifs/${outputPdfFilename}`,
        thumbnailPath: `/storage/justificatifs/thumbnails/${thumbFilename}`,
        mimeType: 'application/pdf'
      };
    } catch (error) {
      await fs.unlink(tempInputPath).catch(() => {});
      throw error;
    }
  }

  private static async generatePlaceholderThumbnail(outputPath: string): Promise<void> {
    const svgIcon = `
      <svg width="320" height="420" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f1f5f9"/>
        <rect x="20" y="20" width="280" height="380" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
        <text x="50%" y="45%" text-anchor="middle" fill="#dc2626" font-family="sans-serif" font-size="28" font-weight="bold">PDF BUNEC</text>
        <text x="50%" y="55%" text-anchor="middle" fill="#64748b" font-family="sans-serif" font-size="16">Justificatif Officiel</text>
      </svg>
    `;
    await sharp(Buffer.from(svgIcon))
      .webp({ quality: 80 })
      .toFile(outputPath);
  }
}
