import { readFile } from 'node:fs/promises';
import jpeg from 'jpeg-js';
import { PNG } from 'pngjs';

const MAX_SIDE = 240;

const decode = (buffer) => {
  if (buffer[0] === 0x89 && buffer[1] === 0x50) {
    const png = PNG.sync.read(buffer);
    return { data: png.data, width: png.width, height: png.height };
  }
  return jpeg.decode(buffer, { useTArray: true, maxMemoryUsageInMB: 2048 });
};

/** Shrinks an RGBA image (optionally to a crop) to at most MAX_SIDE on its long side, averaging the pixels each new pixel covers. */
const shrink = ({ data, width, height }, crop = [0, 0, 1, 1]) => {
  const x0 = Math.round(crop[0] * width); const y0 = Math.round(crop[1] * height);
  const x1 = Math.round(crop[2] * width); const y1 = Math.round(crop[3] * height);
  const cw = x1 - x0; const ch = y1 - y0;
  const scale = Math.min(1, MAX_SIDE / Math.max(cw, ch));
  const w = Math.max(1, Math.round(cw * scale)); const h = Math.max(1, Math.round(ch * scale));
  const out = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) {
    const sy0 = y0 + Math.floor(y * ch / h); const sy1 = Math.max(sy0 + 1, y0 + Math.floor((y + 1) * ch / h));
    for (let x = 0; x < w; x++) {
      const sx0 = x0 + Math.floor(x * cw / w); const sx1 = Math.max(sx0 + 1, x0 + Math.floor((x + 1) * cw / w));
      let r = 0; let g = 0; let b = 0; let n = 0;
      for (let sy = sy0; sy < sy1; sy++) {
        for (let sx = sx0; sx < sx1; sx++) {
          const i = (sy * width + sx) * 4;
          r += data[i]; g += data[i + 1]; b += data[i + 2]; n++;
        }
      }
      const o = (y * w + x) * 4;
      out[o] = r / n; out[o + 1] = g / n; out[o + 2] = b / n; out[o + 3] = 255;
    }
  }
  return { data: out, width: w, height: h };
};

const isNearWhite = (d, i) => d[i] > 235 && d[i + 1] > 235 && d[i + 2] > 235;

/** Removes a mat or scan margin: outer rows and columns that are almost entirely near-white (at most 10% per side). */
const trimWhiteMargin = ({ data, width, height }) => {
  const share = (line, count, at) => { let n = 0; for (let k = 0; k < count; k++) if (isNearWhite(data, at(line, k))) n++; return n / count; };
  const row = (y) => share(y, width, (yy, x) => (yy * width + x) * 4);
  const col = (x) => share(x, height, (xx, y) => (y * width + xx) * 4);
  const maxX = Math.floor(width * 0.1); const maxY = Math.floor(height * 0.1);
  let top = 0; let bottom = height - 1; let left = 0; let right = width - 1;
  while (top < maxY && row(top) > 0.97) top++;
  while (height - 1 - bottom < maxY && row(bottom) > 0.97) bottom--;
  while (left < maxX && col(left) > 0.97) left++;
  while (width - 1 - right < maxX && col(right) > 0.97) right--;
  const w = right - left + 1; const h = bottom - top + 1;
  const out = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const s = ((y + top) * width + (x + left)) * 4; const o = (y * w + x) * 4;
    out[o] = data[s]; out[o + 1] = data[s + 1]; out[o + 2] = data[s + 2]; out[o + 3] = 255;
  }
  return { data: out, width: w, height: h };
};

/** Loads a work's image from the catalogue folder or the site, cropped, trimmed and small enough to analyse. */
export const loadWorkPixels = async (work, catalogueDir) => {
  let buffer;
  if (work.catalogue) {
    if (!catalogueDir) throw new Error(`No catalogue folder given, needed for "${work.title}"`);
    buffer = await readFile(`${catalogueDir}/${work.catalogue}`);
  } else {
    const res = await fetch(work.url);
    if (!res.ok) throw new Error(`${res.status} for ${work.url}`);
    buffer = Buffer.from(await res.arrayBuffer());
  }
  return trimWhiteMargin(shrink(decode(buffer), work.crop));
};
