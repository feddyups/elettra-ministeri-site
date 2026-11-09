/**
 * Cuts the pale border (white mat, scanner margin) off a picture of a painting.
 *
 *   node scripts/trim-border.mjs <in.jpg|png> <out.jpg> [--inset 3] [--pale 232] [--chroma 28] [--full 0.9] [--bluish 50]
 *
 * From each side it walks inward until a row (or column) is mostly painted, meaning most of its pixels are darker or
 * more colorful (`--chroma`) than `--pale` allows (`--bluish` also rejects pale paper under a blue light), and cuts there, plus `--inset` pixels so no thread of the border survives.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import jpeg from 'jpeg-js';
import { PNG } from 'pngjs';

const [input, output, ...flags] = process.argv.slice(2);
const flag = (name, fallback) => { const i = flags.indexOf(`--${name}`); return i > -1 ? Number(flags[i + 1]) : fallback; };
const inset = flag('inset', 3);
const pale = flag('pale', 232);
const chromaMin = flag('chroma', 28);
const bluish = flag('bluish', 0); // when set, a pixel much bluer than red is paper lit by a cool light, not paint

const buffer = readFileSync(input);
const image = buffer[0] === 0x89 ? (() => { const p = PNG.sync.read(buffer); return { data: p.data, width: p.width, height: p.height }; })()
  : jpeg.decode(buffer, { useTArray: true, maxMemoryUsageInMB: 4096 });
const { data, width, height } = image;

const painted = (x, y) => {
  const i = (y * width + x) * 4;
  const max = Math.max(data[i], data[i + 1], data[i + 2]); const min = Math.min(data[i], data[i + 1], data[i + 2]);
  if (bluish && data[i + 2] - data[i] > bluish) return false;
  return min < pale || max - min > chromaMin;
};
const rowShare = (y) => { let n = 0; for (let x = 0; x < width; x += 2) if (painted(x, y)) n++; return n / (width / 2); };
const colShare = (x) => { let n = 0; for (let y = 0; y < height; y += 2) if (painted(x, y)) n++; return n / (height / 2); };
const FULL = flag('full', 0.9);
let top = 0; while (top < height / 4 && rowShare(top) < FULL) top++;
let bottom = height - 1; while (bottom > height * 0.75 && rowShare(bottom) < FULL) bottom--;
let left = 0; while (left < width / 4 && colShare(left) < FULL) left++;
let right = width - 1; while (right > width * 0.75 && colShare(right) < FULL) right--;
top += inset; left += inset; bottom -= inset; right -= inset;
const w = right - left + 1; const h = bottom - top + 1;
const out = Buffer.alloc(w * h * 4);
for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
  const si = ((top + y) * width + left + x) * 4; const di = (y * w + x) * 4;
  out[di] = data[si]; out[di + 1] = data[si + 1]; out[di + 2] = data[si + 2]; out[di + 3] = 255;
}
writeFileSync(output, jpeg.encode({ data: out, width: w, height: h }, 92).data);
console.log(`${input}: cut ${left}px left, ${top}px top, ${width - 1 - right}px right, ${height - 1 - bottom}px bottom -> ${w} x ${h}`);
