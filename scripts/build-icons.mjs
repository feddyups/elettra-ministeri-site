/**
 * Writes the site's icons into src/brand/icons/ from the mark in src/brand/mark.js:
 *   favicon.svg          vector, adapts to dark tabs
 *   favicon.ico          16, 32 and 48 px (PNG inside), for browsers that look for /favicon.ico
 *   favicon-32.png       32 px
 *   favicon-96.png       96 px, a multiple of 48 as Google asks for its search results
 *   apple-touch-icon.png 180 px, full-bleed (iOS rounds the corners itself)
 *   icon-512.png         512 px, rounded; the file to upload as the Squarespace Browser Icon
 * Run: npm run build:icons
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { PNG } from 'pngjs';
import { ARMS, CREAM, GRID, INK, STEM, TILE_RADIUS, TRIAD, markSvg } from '../src/brand/mark.js';

const OUT = new URL('../src/brand/icons/', import.meta.url);
const SAMPLES = 6;

const hex = (value) => [1, 3, 5].map((i) => parseInt(value.slice(i, i + 2), 16));
const inside = ({ x, y, w, h }, px, py) => px >= x && px < x + w && py >= y && py < y + h;
const inTile = (px, py) => {
  const r = TILE_RADIUS;
  const cx = Math.min(Math.max(px, r), GRID - r);
  const cy = Math.min(Math.max(py, r), GRID - r);
  return Math.hypot(px - cx, py - cy) <= r;
};

/** Colour of the mark at a point of the 64-unit grid, or null where nothing is drawn. */
const shade = (px, py, rounded) => {
  if (rounded && !inTile(px, py)) return null;
  if (inside(STEM, px, py)) return hex(CREAM);
  const arm = ARMS.findIndex((a) => inside(a, px, py));
  return hex(arm >= 0 ? TRIAD[arm] : INK);
};

const render = (size, { rounded }) => {
  const png = new PNG({ width: size, height: size });
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      let r = 0; let g = 0; let b = 0; let n = 0;
      for (let sy = 0; sy < SAMPLES; sy += 1) {
        for (let sx = 0; sx < SAMPLES; sx += 1) {
          const c = shade(((x + (sx + 0.5) / SAMPLES) / size) * GRID, ((y + (sy + 0.5) / SAMPLES) / size) * GRID, rounded);
          if (c) { r += c[0]; g += c[1]; b += c[2]; n += 1; }
        }
      }
      const i = (y * size + x) * 4;
      png.data[i] = n ? Math.round(r / n) : 0;
      png.data[i + 1] = n ? Math.round(g / n) : 0;
      png.data[i + 2] = n ? Math.round(b / n) : 0;
      png.data[i + 3] = Math.round((n / (SAMPLES * SAMPLES)) * 255);
    }
  }
  return PNG.sync.write(png);
};

const ico = (sizes) => {
  const images = sizes.map((s) => render(s, { rounded: true }));
  const head = Buffer.alloc(6 + 16 * sizes.length);
  head.writeUInt16LE(1, 2);
  head.writeUInt16LE(sizes.length, 4);
  let offset = head.length;
  sizes.forEach((s, i) => {
    const at = 6 + 16 * i;
    head[at] = s; head[at + 1] = s;
    head.writeUInt16LE(1, at + 4);
    head.writeUInt16LE(32, at + 6);
    head.writeUInt32LE(images[i].length, at + 8);
    head.writeUInt32LE(offset, at + 12);
    offset += images[i].length;
  });
  return Buffer.concat([head, ...images]);
};

mkdirSync(OUT, { recursive: true });
const write = (name, data) => { writeFileSync(new URL(name, OUT), data); console.log('wrote', name, data.length, 'bytes'); };
write('favicon.svg', markSvg(TRIAD, { adaptive: true }));
write('favicon.ico', ico([16, 32, 48]));
write('favicon-32.png', render(32, { rounded: true }));
write('favicon-96.png', render(96, { rounded: true }));
write('apple-touch-icon.png', render(180, { rounded: false }));
write('icon-512.png', render(512, { rounded: true }));
