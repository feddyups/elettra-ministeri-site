/**
 * Straightens a photograph of a painting: the four corners of the work (its outer edge, frame included) are mapped
 * onto a perfect rectangle, so the picture is flat-on and cropped exactly at its border, and everything around it
 * (bed sheet, wall, floor) is dropped.
 *
 *   node scripts/rectify.mjs <photo.jpg> <out.jpg> <tlx,tly,trx,try,brx,bry,blx,bly> [--width 2400] [--ratio 1.33]
 *   node scripts/rectify.mjs <photo.jpg> <out.jpg> <corners> --outline     (draws the quadrilateral on a small copy instead)
 *
 * Corners are fractions of the photograph's width and height (0 to 1), clockwise from the top left.
 * The width of the result defaults to 2400 pixels; its height follows the shape the corners describe, or `--ratio`
 * (width / height) when the real proportions are known. `--round <#rrggbb>` is for round objects (a wheel): everything
 * outside the circle that fills the rectangle is painted that color.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import jpeg from 'jpeg-js';

const [input, output, cornerArg, ...flags] = process.argv.slice(2);
const flag = (name) => { const i = flags.indexOf(`--${name}`); return i > -1 ? flags[i + 1] : undefined; };
if (!input || !output || !cornerArg) { console.error('usage: rectify.mjs <photo> <out> <corners> [--width n] [--ratio r] [--round #hex] [--outline]'); process.exit(1); }

const photo = jpeg.decode(readFileSync(input), { useTArray: true, maxMemoryUsageInMB: 4096 });
const nums = cornerArg.split(',').map(Number);
const corners = [0, 1, 2, 3].map((i) => [nums[i * 2] * photo.width, nums[i * 2 + 1] * photo.height]);
const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);

/** Solves the 8 unknowns of the homography that sends the unit square's corners to `corners` (Gaussian elimination). */
const homography = (dst) => {
  const src = [[0, 0], [1, 0], [1, 1], [0, 1]];
  const A = []; const b = [];
  src.forEach(([x, y], i) => {
    const [u, v] = dst[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v);
  });
  for (let c = 0; c < 8; c++) {
    let p = c; for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]]; [b[c], b[p]] = [b[p], b[c]];
    for (let r = 0; r < 8; r++) {
      if (r === c) continue;
      const f = A[r][c] / A[c][c];
      for (let k = c; k < 8; k++) A[r][k] -= f * A[c][k];
      b[r] -= f * b[c];
    }
  }
  return b.map((v, i) => v / A[i][i]);
};

const bilinear = (x, y) => {
  const { data, width, height } = photo;
  const x0 = Math.max(0, Math.min(width - 2, Math.floor(x))); const y0 = Math.max(0, Math.min(height - 2, Math.floor(y)));
  const fx = Math.min(1, Math.max(0, x - x0)); const fy = Math.min(1, Math.max(0, y - y0));
  const px = (xx, yy, c) => data[(yy * width + xx) * 4 + c];
  return [0, 1, 2].map((c) => (px(x0, y0, c) * (1 - fx) + px(x0 + 1, y0, c) * fx) * (1 - fy) + (px(x0, y0 + 1, c) * (1 - fx) + px(x0 + 1, y0 + 1, c) * fx) * fy);
};

if (flags.includes('--outline')) {
  const scale = 900 / Math.max(photo.width, photo.height);
  const W = Math.round(photo.width * scale); const H = Math.round(photo.height * scale);
  const out = Buffer.alloc(W * H * 4);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const c = bilinear(x / scale, y / scale); const i = (y * W + x) * 4;
    out[i] = c[0]; out[i + 1] = c[1]; out[i + 2] = c[2]; out[i + 3] = 255;
  }
  for (let e = 0; e < 4; e++) {
    const [p, q] = [corners[e], corners[(e + 1) % 4]];
    const steps = Math.ceil(dist(p, q) * scale);
    for (let s = 0; s <= steps; s++) {
      const x = Math.round((p[0] + (q[0] - p[0]) * s / steps) * scale); const y = Math.round((p[1] + (q[1] - p[1]) * s / steps) * scale);
      for (let d = -1; d <= 1; d++) for (const [dx, dy] of [[d, 0], [0, d]]) {
        const i = ((y + dy) * W + (x + dx)) * 4; if (i >= 0 && i < out.length) { out[i] = 255; out[i + 1] = 0; out[i + 2] = 255; }
      }
    }
  }
  writeFileSync(output, jpeg.encode({ data: out, width: W, height: H }, 90).data);
  process.exit(0);
}

const width = Number(flag('width') || 2400);
const shape = ((dist(corners[0], corners[1]) + dist(corners[3], corners[2])) / 2) / ((dist(corners[0], corners[3]) + dist(corners[1], corners[2])) / 2);
const ratio = Number(flag('ratio') || shape);
const height = Math.round(width / ratio);
const [a, b, c, d, e, f, g, h] = homography(corners);
const round = flag('round');
const fill = round && [1, 3, 5].map((i) => parseInt(round.slice(i, i + 2), 16));
const out = Buffer.alloc(width * height * 4);
for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
  const s = x / (width - 1); const t = y / (height - 1);
  const w = g * s + h * t + 1;
  const outside = round && Math.hypot(s - 0.5, t - 0.5) > 0.5 / Math.max(1, 1) * (1 + 0.0);
  const px = outside ? fill : bilinear((a * s + b * t + c) / w, (d * s + e * t + f) / w);
  const i = (y * width + x) * 4;
  out[i] = px[0]; out[i + 1] = px[1]; out[i + 2] = px[2]; out[i + 3] = 255;
}
writeFileSync(output, jpeg.encode({ data: out, width, height }, 92).data);
console.log(`${output}: ${width} x ${height} (shape ${shape.toFixed(3)})`);
