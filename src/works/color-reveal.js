import { loadImage, sampleImage } from '../lib/image.js';
import { rgbToOklab, distance } from '../lib/color-science.js';

const WIDTH = 320;
const DIM = [20, 17, 15, 215];
const parse = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

/**
 * Lets a visitor point at one of a painting's colors and see where it lives in the picture: every pixel is
 * assigned its nearest palette color, and showing a color dims all the others on `canvas` (which sits over the image).
 * Resolves quietly to a no-op if the image's pixels cannot be read.
 */
export const createColorReveal = (canvas, url, hexes) => {
  const centers = hexes.map((hex) => rgbToOklab(...parse(hex)));
  let owner = null;
  const ready = loadImage(new Image(), url).then((img) => {
    const data = sampleImage(img, WIDTH);
    const height = data.length / 4 / WIDTH;
    canvas.width = WIDTH;
    canvas.height = height;
    owner = new Uint8Array(WIDTH * height);
    for (let i = 0; i < owner.length; i++) {
      const lab = rgbToOklab(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]);
      let best = 0; let bestDistance = Infinity;
      centers.forEach((center, c) => { const d = distance(lab, center); if (d < bestDistance) { bestDistance = d; best = c; } });
      owner[i] = best;
    }
  }).catch(() => {});

  return async (index) => {
    await ready;
    if (!owner) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (index == null) return;
    const out = ctx.createImageData(canvas.width, canvas.height);
    for (let i = 0; i < owner.length; i++) {
      if (owner[i] === index) continue;
      out.data.set(DIM, i * 4);
    }
    ctx.putImageData(out, 0, 0);
  };
};
