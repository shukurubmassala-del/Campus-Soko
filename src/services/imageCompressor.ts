/**
 * Client-side image compression for low-bandwidth Tanzanian mobile data environments.
 * Scales large phone camera photos down to max 1200px and compresses to quality 0.8 JPEG/WebP,
 * reducing a 4MB-8MB mobile upload to <150KB.
 */

export interface CompressionResult {
  dataUrl: string;
  originalSize: number; // in bytes
  compressedSize: number; // in bytes
  savedPercentage: number; // e.g. 88
  fileName: string;
  formattedOriginalSize: string;
  formattedCompressedSize: string;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export async function compressImageWithDetails(
  file: File,
  maxDimension = 1200,
  quality = 0.8
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    const originalSize = file.size;
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          const raw = event.target?.result as string;
          const compressedSize = Math.round((raw.length * 3) / 4);
          const savedPercentage = Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100));
          resolve({
            dataUrl: raw,
            originalSize,
            compressedSize,
            savedPercentage,
            fileName: file.name,
            formattedOriginalSize: formatBytes(originalSize),
            formattedCompressedSize: formatBytes(compressedSize),
          });
          return;
        }

        // Fill white background in case of transparent PNGs
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        let finalData = '';
        // Try webp first, fallback to jpeg
        try {
          const webpData = canvas.toDataURL('image/webp', quality);
          if (webpData.startsWith('data:image/webp')) {
            finalData = webpData;
          }
        } catch {
          // fallback
        }

        if (!finalData) {
          finalData = canvas.toDataURL('image/jpeg', quality);
        }

        const compressedSize = Math.round((finalData.length * 3) / 4);
        const savedPercentage = Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100));

        resolve({
          dataUrl: finalData,
          originalSize,
          compressedSize,
          savedPercentage,
          fileName: file.name,
          formattedOriginalSize: formatBytes(originalSize),
          formattedCompressedSize: formatBytes(compressedSize),
        });
      };

      img.onerror = () => {
        reject(new Error('Failed to load image for compression'));
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

export async function compressImage(file: File, maxDimension = 1200, quality = 0.8): Promise<string> {
  const result = await compressImageWithDetails(file, maxDimension, quality);
  return result.dataUrl;
}
