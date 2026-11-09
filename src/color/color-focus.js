import { loadImage } from '../lib/image.js';
import { rgbToOklab, distance } from '../lib/color-science.js';

const DEFAULT_WIDTH = 360;
const GRAY_LEVEL = 0.92;
const parse = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

/**
 * Lets a visitor point at one of a painting's colors and see where it lives in the picture: every pixel
 * is given to its nearest palette color, and showing a color turns all the other pixels black and white,
 * leaving only that color's cluster in color. `canvas` sits over the picture (see `canvas.em-focus` in swatch.css).
 * If the picture's pixels cannot be read it quietly does nothing.
 *
 * @param {{ canvas: HTMLCanvasElement, source: HTMLImageElement | string, hexes: string[], width?: number, height?: number, cover?: boolean }} options
 *   `source` is an image whose pixels are readable, or a URL to load as one. `height` defaults to the image's
 *   proportions; with `cover`, the picture is cropped to fill the canvas the way `object-fit: cover` does.
 * @returns {{ show: (index: number) => Promise<void>, hide: () => void }}
 */
export const createColorFocus = ({ canvas, source, hexes, width = DEFAULT_WIDTH, height, cover = false }) => {
  const centers = hexes.map((hex) => rgbToOklab(...parse(hex)));
  let owner = null;
  let gray = null;

  const ready = (typeof source === 'string' ? loadImage(new Image(), source) : Promise.resolve(source)).then((img) => {
    const W = width;
    const H = height || Math.round(W * img.naturalHeight / img.naturalWidth);
    const scale = cover ? Math.max(W / img.naturalWidth, H / img.naturalHeight) : 1;
    const drawW = cover ? img.naturalWidth * scale : W;
    const drawH = cover ? img.naturalHeight * scale : H;
    const scratch = document.createElement('canvas');
    scratch.width = W;
    scratch.height = H;
    const ctx = scratch.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, (W - drawW) / 2, (H - drawH) / 2, drawW, drawH);
    const data = ctx.getImageData(0, 0, W, H).data;
    canvas.width = W;
    canvas.height = H;
    owner = new Uint8Array(W * H);
    gray = new Uint8Array(W * H);
    for (let i = 0; i < owner.length; i++) {
      const r = data[i * 4]; const g = data[i * 4 + 1]; const b = data[i * 4 + 2];
      gray[i] = (0.299 * r + 0.587 * g + 0.114 * b) * GRAY_LEVEL;
      const lab = rgbToOklab(r, g, b);
      let best = 0; let bestDistance = Infinity;
      centers.forEach((center, c) => { const d = distance(lab, center); if (d < bestDistance) { bestDistance = d; best = c; } });
      owner[i] = best;
    }
  }).catch(() => {});

  return {
    show: async (index) => {
      await ready;
      if (!owner) return;
      const out = canvas.getContext('2d').createImageData(canvas.width, canvas.height);
      for (let i = 0; i < owner.length; i++) {
        if (owner[i] === index) continue;
        out.data[i * 4] = gray[i]; out.data[i * 4 + 1] = gray[i]; out.data[i * 4 + 2] = gray[i]; out.data[i * 4 + 3] = 255;
      }
      canvas.getContext('2d').putImageData(out, 0, 0);
      canvas.classList.add('is-on');
    },
    hide: () => canvas.classList.remove('is-on'),
  };
};
