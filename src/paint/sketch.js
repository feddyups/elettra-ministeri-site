import { LIVE } from './config.js';
import { fitWorkSize } from './fit.js';

/** Two passes of a box blur of radius r over `src` (W x H), edges held. */
const boxBlur = (src, W, H, r) => {
  const a = Float32Array.from(src);
  const b = new Float32Array(W * H);
  for (let pass = 0; pass < 2; pass++) {
    for (let y = 0; y < H; y++) {
      const row = y * W;
      let sum = 0;
      for (let x = -r; x <= r; x++) sum += a[row + Math.min(W - 1, Math.max(0, x))];
      for (let x = 0; x < W; x++) {
        b[row + x] = sum / (2 * r + 1);
        sum += a[row + Math.min(W - 1, x + r + 1)] - a[row + Math.max(0, x - r)];
      }
    }
    for (let x = 0; x < W; x++) {
      let sum = 0;
      for (let y = -r; y <= r; y++) sum += b[Math.min(H - 1, Math.max(0, y)) * W + x];
      for (let y = 0; y < H; y++) {
        a[y * W + x] = sum / (2 * r + 1);
        sum += b[Math.min(H - 1, y + r + 1) * W + x] - b[Math.max(0, y - r) * W + x];
      }
    }
  }
  return a;
};

/**
 * The picture as a pencil drawing on paper: fine contour lines in ink, found by dividing the picture's brightness by a blurred
 * copy of its negative (the dodge a pencil-sketch filter uses). Drawn at a reduced size (LIVE.sketchWidth, sketchPixels); scale it up to the canvas.
 *
 * @param {HTMLCanvasElement} picture the picture, cover-fitted to the canvas (source-pixels.js's `canvas`)
 * @returns {HTMLCanvasElement}
 */
export const createSketch = (picture) => {
  const { W, H } = fitWorkSize(picture.width, picture.height, LIVE.sketchWidth, LIVE.sketchPixels);
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(picture, 0, 0, W, H);
  const image = ctx.getImageData(0, 0, W, H);
  const d = image.data;
  const light = new Float32Array(W * H);
  const negative = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) {
    light[i] = 0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2];
    negative[i] = 255 - light[i];
  }
  const blurred = boxBlur(negative, W, H, Math.max(2, Math.round(8 * W / 480)));
  const { ink, paper, pencil } = LIVE;
  for (let i = 0; i < W * H; i++) {
    const t = Math.pow(Math.min(255, light[i] * 255 / Math.max(1, 255 - blurred[i])) / 255, pencil);
    for (let c = 0; c < 3; c++) d[i * 4 + c] = ink[c] + (paper[c] - ink[c]) * t;
    d[i * 4 + 3] = 255;
  }
  ctx.putImageData(image, 0, 0);
  return canvas;
};
