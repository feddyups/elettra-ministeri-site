import { rgbToOklab } from '../lib/color-science.js';
import { LIVE } from './config.js';
import { fitWorkSize } from './fit.js';

const smoothstep = (x) => x * x * (3 - 2 * x);
const parse = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

/** One pass of a 3 x 3 average over `values` (W x H), in place via `scratch`. */
const smooth = (values, scratch, W, H) => {
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let sum = 0;
      let n = 0;
      for (let dy = -1; dy <= 1; dy++) {
        const yy = y + dy;
        if (yy < 0 || yy >= H) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx;
          if (xx < 0 || xx >= W) continue;
          sum += values[yy * W + xx];
          n++;
        }
      }
      scratch[y * W + x] = sum / n;
    }
  }
  values.set(scratch);
};

/**
 * Where each of a painting's colors lives in the picture, measured as the color focus does (color-focus.js) but kept for the painting to use:
 * for every color a soft mask (a white canvas whose opacity is how much each pixel belongs to the color) and the places strokes of that color can start from.
 *
 * @param {HTMLCanvasElement} picture the picture, cover-fitted to the canvas (source-pixels.js's `canvas`)
 * @param {string[]} hexes the painting's colors
 * @returns {{ width: number, height: number, masks: HTMLCanvasElement[], places: { x: number, y: number, total: number, cumulative: Float32Array, points: number[][] }[], areas: number[] }}
 */
export const createZones = (picture, hexes) => {
  const { W, H } = fitWorkSize(picture.width, picture.height, LIVE.zoneWidth, LIVE.zonePixels);
  const work = document.createElement('canvas');
  work.width = W;
  work.height = H;
  const wctx = work.getContext('2d', { willReadFrequently: true });
  wctx.drawImage(picture, 0, 0, W, H);
  const data = wctx.getImageData(0, 0, W, H).data;
  const labs = new Float32Array(W * H * 3);
  for (let i = 0; i < W * H; i++) labs.set(rgbToOklab(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]), i * 3);
  const scratch = new Float32Array(W * H);
  const inner = LIVE.reach * LIVE.core;

  const masks = [];
  const places = [];
  hexes.forEach((hex) => {
    const [cL, cA, cB] = rgbToOklab(...parse(hex));
    const fade = new Float32Array(W * H);
    for (let i = 0; i < fade.length; i++) {
      const d = Math.hypot(labs[i * 3] - cL, labs[i * 3 + 1] - cA, labs[i * 3 + 2] - cB);
      fade[i] = d <= inner ? 1 : d >= LIVE.reach ? 0 : 1 - smoothstep((d - inner) / (LIVE.reach - inner));
    }
    for (let pass = 0; pass < LIVE.smoothing; pass++) smooth(fade, scratch, W, H);

    const mask = document.createElement('canvas');
    mask.width = W;
    mask.height = H;
    const mctx = mask.getContext('2d');
    const out = mctx.createImageData(W, H);
    const points = [];
    const cumulative = [];
    let total = 0;
    for (let i = 0; i < fade.length; i++) {
      out.data[i * 4] = 255; out.data[i * 4 + 1] = 255; out.data[i * 4 + 2] = 255;
      out.data[i * 4 + 3] = Math.round(255 * fade[i]);
      const x = i % W;
      const y = (i / W) | 0;
      if (fade[i] > 0.25 && x % 2 === 0 && y % 2 === 0) { points.push([x, y]); total += fade[i]; cumulative.push(total); }
    }
    mctx.putImageData(out, 0, 0);
    masks.push(mask);
    places.push({ total, cumulative: Float32Array.from(cumulative), points });
  });
  return { width: W, height: H, masks, places, areas: places.map((p) => p.total) };
};

/** A random place inside a zone, more likely where the color is stronger, as [x, y] in the zone's own pixels; null if the zone has no place (a color the picture does not hold). */
export const placeIn = ({ total, cumulative, points }) => {
  if (!points.length) return null;
  const target = Math.random() * total;
  let lo = 0;
  let hi = cumulative.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (cumulative[mid] < target) lo = mid + 1; else hi = mid;
  }
  return points[lo];
};
