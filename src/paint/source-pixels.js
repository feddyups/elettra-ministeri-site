/**
 * Draws `img` cover-fitted onto an off-screen canvas of W x H and exposes
 * read access to its pixels.
 */
export const createSourcePixels = (img, W, H) => {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight);
  const drawW = img.naturalWidth * scale;
  const drawH = img.naturalHeight * scale;
  ctx.drawImage(img, (W - drawW) / 2, (H - drawH) / 2, drawW, drawH);
  const data = ctx.getImageData(0, 0, W, H).data;

  const pixel = (x, y) => {
    const cx = Math.max(0, Math.min(W - 1, x | 0));
    const cy = Math.max(0, Math.min(H - 1, y | 0));
    const i = (cy * W + cx) * 4;
    return [data[i], data[i + 1], data[i + 2]];
  };
  const luminance = (x, y) => {
    const p = pixel(x, y);
    return 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2];
  };
  /** Average of the centre pixel and its four neighbours at distance r. */
  const mean = (x, y, r) => {
    const samples = [pixel(x, y), pixel(x - r, y), pixel(x + r, y), pixel(x, y - r), pixel(x, y + r)];
    return [0, 1, 2].map((ch) => samples.reduce((sum, s) => sum + s[ch], 0) / 5);
  };
  /** Average colour of the whole picture, from random samples. */
  const averageColour = (samples = 300) => {
    const sum = [0, 0, 0];
    for (let i = 0; i < samples; i++) {
      const p = pixel(Math.random() * W, Math.random() * H);
      sum[0] += p[0];
      sum[1] += p[1];
      sum[2] += p[2];
    }
    return sum.map((v) => v / samples);
  };

  return { canvas, pixel, luminance, mean, averageColour };
};
