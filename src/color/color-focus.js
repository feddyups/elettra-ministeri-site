import { loadImage } from '../lib/image.js';
import { rgbToOklab } from '../lib/color-science.js';
import { FOCUS } from './focus-config.js';

const parse = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const smoothstep = (x) => x * x * (3 - 2 * x);

/** One pass of a 3 x 3 average over `values` (W x H), in place via `scratch`. */
const smooth = (values, scratch, W, H) => {
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let sum = 0; let n = 0;
      for (let dy = -1; dy <= 1; dy++) {
        const yy = y + dy;
        if (yy < 0 || yy >= H) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx;
          if (xx < 0 || xx >= W) continue;
          sum += values[yy * W + xx]; n++;
        }
      }
      scratch[y * W + x] = sum / n;
    }
  }
  values.set(scratch);
};

/**
 * Lets a visitor point at one of a painting's colors and see where it lives in the picture. Pixels close to
 * that color keep their color, pixels a little further keep part of it, and everything else turns black and
 * white, so the selection is organic rather than pixel-exact. `canvas` sits over the picture (see
 * `canvas.em-focus` in swatch.css). If the picture's pixels cannot be read it quietly does nothing.
 *
 * How wide the selection reaches and how soft its edge is come from focus-config.js; any of those names
 * can be passed here to change one use.
 *
 * @param {{ canvas: HTMLCanvasElement, source: HTMLImageElement | string, hexes: string[], height?: number, cover?: boolean, reach?: number, core?: number, smoothing?: number, grayLevel?: number, width?: number }} options
 *   `source` is an image whose pixels are readable, or a URL to load as one. `height` defaults to the image's
 *   proportions; with `cover`, the picture is cropped to fill the canvas the way `object-fit: cover` does.
 * @returns {{ show: (index: number) => Promise<void>, hide: () => void }}
 */
export const createColorFocus = ({ canvas, source, hexes, height, cover = false, ...overrides }) => {
  const { reach, core, smoothing, grayLevel, width } = { ...FOCUS, ...overrides };
  const centers = hexes.map((hex) => rgbToOklab(...parse(hex)));
  let W = 0; let H = 0;
  let labs = null;
  let gray = null;
  let fade = null;
  let scratch = null;

  const ready = (typeof source === 'string' ? loadImage(new Image(), source) : Promise.resolve(source)).then((img) => {
    W = width;
    H = height || Math.round(W * img.naturalHeight / img.naturalWidth);
    const scale = cover ? Math.max(W / img.naturalWidth, H / img.naturalHeight) : 1;
    const drawW = cover ? img.naturalWidth * scale : W;
    const drawH = cover ? img.naturalHeight * scale : H;
    const work = document.createElement('canvas');
    work.width = W;
    work.height = H;
    const ctx = work.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, (W - drawW) / 2, (H - drawH) / 2, drawW, drawH);
    const data = ctx.getImageData(0, 0, W, H).data;
    canvas.width = W;
    canvas.height = H;
    labs = new Float32Array(W * H * 3);
    gray = new Uint8Array(W * H);
    fade = new Float32Array(W * H);
    scratch = new Float32Array(W * H);
    for (let i = 0; i < W * H; i++) {
      const r = data[i * 4]; const g = data[i * 4 + 1]; const b = data[i * 4 + 2];
      const lab = rgbToOklab(r, g, b);
      labs[i * 3] = lab[0]; labs[i * 3 + 1] = lab[1]; labs[i * 3 + 2] = lab[2];
      gray[i] = (0.299 * r + 0.587 * g + 0.114 * b) * grayLevel;
    }
  }).catch(() => {});

  return {
    show: async (index) => {
      await ready;
      if (!labs) return;
      const [cL, cA, cB] = centers[index];
      const inner = reach * core;
      for (let i = 0; i < fade.length; i++) {
        const d = Math.hypot(labs[i * 3] - cL, labs[i * 3 + 1] - cA, labs[i * 3 + 2] - cB);
        fade[i] = d <= inner ? 1 : d >= reach ? 0 : 1 - smoothstep((d - inner) / (reach - inner));
      }
      for (let pass = 0; pass < smoothing; pass++) smooth(fade, scratch, W, H);
      const ctx = canvas.getContext('2d');
      const out = ctx.createImageData(W, H);
      for (let i = 0; i < fade.length; i++) {
        out.data[i * 4] = gray[i]; out.data[i * 4 + 1] = gray[i]; out.data[i * 4 + 2] = gray[i];
        out.data[i * 4 + 3] = Math.round(255 * (1 - fade[i]));
      }
      ctx.putImageData(out, 0, 0);
      canvas.classList.add('is-on');
    },
    hide: () => canvas.classList.remove('is-on'),
  };
};
