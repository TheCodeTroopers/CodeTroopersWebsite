/**
 * Shrink a photo in the browser before uploading.
 *
 * Phone/camera photos are often 3-8 MB. Resizing to at most 1600 px on the long side and
 * re-encoding as WebP typically gives 150-300 KB with no visible loss on a website, which
 * keeps free storage tiers going for thousands of photos and keeps the gallery fast.
 */
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // server limit (Vercel request bodies cap at ~4.5 MB)

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

export async function compressImage(file, { maxDimension = 1600, quality = 0.82 } = {}) {
  if (!file || !file.type || !file.type.startsWith('image/')) {
    throw new Error(`"${file?.name || 'File'}" is not an image`);
  }

  // Keep GIFs untouched (re-encoding would drop the animation).
  if (file.type === 'image/gif') {
    if (file.size > MAX_UPLOAD_BYTES) throw new Error(`"${file.name}" is too large (max 4 MB for GIFs)`);
    return file;
  }

  let bitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    throw new Error(`"${file.name}" could not be read as an image`);
  }

  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d').drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  // WebP where supported (all current browsers); the browser silently falls back to PNG
  // if it cannot encode WebP, so detect that and use JPEG instead.
  let blob = await canvasToBlob(canvas, 'image/webp', quality);
  if (!blob || blob.type !== 'image/webp') blob = await canvasToBlob(canvas, 'image/jpeg', quality);
  if (blob && blob.size > MAX_UPLOAD_BYTES) blob = await canvasToBlob(canvas, blob.type, 0.6);

  if (!blob) throw new Error(`"${file.name}" could not be compressed`);

  // If the original was already small and not resized, keep it rather than re-encoding.
  if (scale === 1 && file.size <= blob.size && file.size <= MAX_UPLOAD_BYTES) return file;

  if (blob.size > MAX_UPLOAD_BYTES) throw new Error(`"${file.name}" is still too large after compression`);

  const extension = blob.type === 'image/webp' ? 'webp' : 'jpg';
  const baseName = file.name.replace(/\.[^.]+$/, '') || 'image';
  return new File([blob], `${baseName}.${extension}`, { type: blob.type });
}
