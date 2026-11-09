/**
 * Gives a phone photograph of a painting the tonal range of a good reproduction.
 *
 *   node scripts/tone-photo.mjs <in.jpg> <out.jpg> [--clip 0.4] [--target 0.5] [--vibrance 0.2] [--contrast 0.25]  [--sharpen 0.4]  [--white-ref photo.jpg] [--wb 0.65]
 *
 * With `--white-ref <the original photo>` the first step is a white balance: the bed sheet around the painting is white, so
 * the lightest pixels in the outer 7% of that photo set what neutral is, and the cast of the room light is removed.
 * In order:
 *   1. levels: the darkest `--clip` percent and the lightest `--clip` percent of the light values go to black and
 *      white, the same stretch for all three channels, so hues do not shift;
 *   2. midtones: a gamma moves the median brightness a third of the way (at most) toward `--target` (0 to 1);
 *   3. contrast: a gentle S-curve, blended in by `--contrast` (0 to 1);
 *   4. vibrance: raises the saturation of dull colors more than of strong ones, by up to `--vibrance` (0 to 1);
 *   5. sharpening: an unsharp mask of the brightness, by `--sharpen` (0 to 1.5).
 * It prints the before and after statistics (1st, 50th and 99th percentile of brightness, mean saturation).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import jpeg from 'jpeg-js';

const [input, output, ...flags] = process.argv.slice(2);
const flag = (name, fallback) => { const i = flags.indexOf(`--${name}`); return i > -1 ? Number(flags[i + 1]) : fallback; };
const clip = flag('clip', 0.4) / 100;
const target = flag('target', 0.5);
const vibrance = flag('vibrance', 0.2);
const contrast = flag('contrast', 0.25);
const sharpen = flag('sharpen', 0.4);
const refIndex = flags.indexOf('--white-ref');
const whiteRef = refIndex > -1 ? flags[refIndex + 1] : null;
const wbStrength = flag('wb', 0.65); // 1 would make the sheet exactly neutral; less keeps some of the warmth of real paper

const image = jpeg.decode(readFileSync(input), { useTArray: true, maxMemoryUsageInMB: 4096 });
const { data, width, height } = image;
const count = width * height;
const luma = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

const measure = (pixels) => {
  const hist = new Uint32Array(256); let sat = 0; let n = 0;
  for (let i = 0; i < pixels.length; i += 16) {
    const r = pixels[i]; const g = pixels[i + 1]; const b = pixels[i + 2];
    hist[Math.round(luma(r, g, b))]++; n++;
    const mx = Math.max(r, g, b); const mn = Math.min(r, g, b); sat += mx ? (mx - mn) / mx : 0;
  }
  const at = (p) => { let a = 0; for (let v = 0; v < 256; v++) { a += hist[v]; if (a >= n * p) return v; } return 255; };
  return { p1: at(0.01), p50: at(0.5), p99: at(0.99), sat: +(sat / n).toFixed(2), at };
};
let gains = [1, 1, 1];
if (whiteRef) {
  const photo = jpeg.decode(readFileSync(whiteRef), { useTArray: true, maxMemoryUsageInMB: 4096 });
  const band = Math.round(Math.min(photo.width, photo.height) * 0.07);
  const samples = [];
  for (let y = 0; y < photo.height; y += 3) for (let x = 0; x < photo.width; x += 3) {
    if (x > band && x < photo.width - band && y > band && y < photo.height - band) continue;
    const i = (y * photo.width + x) * 4; samples.push([photo.data[i], photo.data[i + 1], photo.data[i + 2]]);
  }
  samples.sort((a, b) => luma(...b) - luma(...a));
  const top = samples.slice(0, Math.max(50, Math.round(samples.length * 0.25)));
  const ref = [0, 1, 2].map((c) => top.reduce((a, p) => a + p[c], 0) / top.length);
  const mean = (ref[0] + ref[1] + ref[2]) / 3;
  gains = ref.map((v) => 1 + (Math.min(1.3, Math.max(0.78, mean / v)) - 1) * wbStrength);
  console.log(`  sheet is rgb(${ref.map((v) => Math.round(v)).join(', ')}); gains ${gains.map((g) => g.toFixed(2)).join(', ')}`);
  for (let i = 0; i < data.length; i += 4) { data[i] = Math.min(255, data[i] * gains[0]); data[i + 1] = Math.min(255, data[i + 1] * gains[1]); data[i + 2] = Math.min(255, data[i + 2] * gains[2]); }
}
const before = measure(data);
const lo = before.at(clip); const hi = before.at(1 - clip);
const scale = 255 / Math.max(1, hi - lo);

// median after levels, to choose the gamma
const medianAfter = Math.min(1, Math.max(0.01, (before.p50 - lo) * scale / 255));
const wanted = Math.log(target) / Math.log(medianAfter); // gamma exponent that would land exactly on the target
const exponent = 1 + (Math.min(1.35, Math.max(0.75, wanted)) - 1) / 3;

const smooth = (x) => x * x * (3 - 2 * x);
const out = new Uint8ClampedArray(data.length);
const lum = new Float32Array(count);
for (let p = 0, i = 0; p < count; p++, i += 4) {
  let r = (data[i] - lo) * scale / 255; let g = (data[i + 1] - lo) * scale / 255; let b = (data[i + 2] - lo) * scale / 255;
  r = Math.min(1, Math.max(0, r)); g = Math.min(1, Math.max(0, g)); b = Math.min(1, Math.max(0, b));
  r **= exponent; g **= exponent; b **= exponent;
  if (contrast > 0) { r += (smooth(r) - r) * contrast; g += (smooth(g) - g) * contrast; b += (smooth(b) - b) * contrast; }
  if (vibrance > 0) {
    const mx = Math.max(r, g, b); const mn = Math.min(r, g, b); const s = mx ? (mx - mn) / mx : 0;
    const k = 1 + vibrance * (1 - s) * (1 - s) * 1.6; // strong colors barely change, dull ones gain the most
    const l = luma(r, g, b);
    r = l + (r - l) * k; g = l + (g - l) * k; b = l + (b - l) * k;
  }
  out[i] = r * 255; out[i + 1] = g * 255; out[i + 2] = b * 255; out[i + 3] = 255;
  lum[p] = luma(out[i], out[i + 1], out[i + 2]);
}

if (sharpen > 0) {
  // unsharp mask of the brightness: a separable 5 pixel box blur is the soft copy
  const tmp = new Float32Array(count); const blur = new Float32Array(count); const R = 2;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    let s = 0; for (let d = -R; d <= R; d++) s += lum[y * width + Math.min(width - 1, Math.max(0, x + d))];
    tmp[y * width + x] = s / (2 * R + 1);
  }
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    let s = 0; for (let d = -R; d <= R; d++) s += tmp[Math.min(height - 1, Math.max(0, y + d)) * width + x];
    blur[y * width + x] = s / (2 * R + 1);
  }
  for (let p = 0, i = 0; p < count; p++, i += 4) {
    const delta = (lum[p] - blur[p]) * sharpen;
    out[i] += delta; out[i + 1] += delta; out[i + 2] += delta;
  }
}

writeFileSync(output, jpeg.encode({ data: Buffer.from(out.buffer), width, height }, 93).data);
const after = measure(out);
const show = (m) => `p1 ${m.p1}  p50 ${m.p50}  p99 ${m.p99}  sat ${m.sat}`;
console.log(`${output}\n  before: ${show(before)}\n  after:  ${show(after)}`);
