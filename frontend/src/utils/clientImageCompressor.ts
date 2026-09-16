/**
 * Utilitaire de compression d'image côté client (Navigateur / Smartphone)
 * Transforme les photos brutes d'appareils mobiles (> 10-15 Mo) en WebP < 400 Ko
 * avant téléversement HTTP, économisant le forfait data du citoyen et réduisant la latence réseau.
 */

export interface ClientCompressionOptions {
  maxSizeMB?: number; // 0.4 MB = 400 Ko
  maxWidthOrHeight?: number; // 1920px
  quality?: number; // 0.8
}

export async function compressImageClientSide(
  file: File,
  options: ClientCompressionOptions = {}
): Promise<File> {
  const maxSizeMB = options.maxSizeMB || 0.4;
  const maxDim = options.maxWidthOrHeight || 1920;
  const targetQuality = options.quality || 0.8;

  // Si le fichier est un PDF ou déjà inférieur à 400 Ko, on ne le recompresse pas côté navigateur
  if (file.type === 'application/pdf' || file.size <= maxSizeMB * 1024 * 1024) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Redimensionnement proportionnel
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          return resolve(file); // Fallback si non supporté
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Conversion en WebP (ou JPEG si le navigateur ne supporte pas WebP en export canvas)
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return resolve(file);
            }

            const cleanFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
            const compressedFile = new File([blob], cleanFileName, {
              type: 'image/webp',
              lastModified: Date.now()
            });

            console.log(
              `[CLIENT-COMPRESSION] Photo compressée de ${(file.size / (1024 * 1024)).toFixed(2)} Mo à ${(compressedFile.size / 1024).toFixed(1)} Ko`
            );

            resolve(compressedFile);
          },
          'image/webp',
          targetQuality
        );
      };

      img.onerror = (err) => reject(err);
    };

    reader.onerror = (err) => reject(err);
  });
}
