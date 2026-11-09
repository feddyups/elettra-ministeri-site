/** Sets `url` as the image source (CORS-enabled so its pixels can be read) and resolves once it has loaded. */
export const loadImage = (img, url) => new Promise((resolve) => {
  img.crossOrigin = 'anonymous';
  img.onload = () => resolve(img);
  img.src = url;
});

/** Returns the RGBA pixels of `img` scaled down to `width` pixels wide. */
export const sampleImage = (img, width = 64) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = Math.max(1, Math.round(width * img.naturalHeight / img.naturalWidth));
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return ctx.getImageData(0, 0, canvas.width, canvas.height).data;
};
