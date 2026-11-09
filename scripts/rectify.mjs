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

 * (width / height) when the real proportions are known. `--refine` snaps each side of the quadrilateral to the strongest
 * edge near it (the outer edge of the frame against the bed sheet), fits a straight line through those edge points
 * and takes the new corners from where the lines cross, so rough corners are enough. `--inset` is how far inside the found edge the crop sits, as a fraction (default 0.004; use more for a ragged deckle edge). `--round <#rrggbb>` is for round objects (a wheel): everything
 * outside the circle that fills the rectangle is painted that color.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import jpeg from 'jpeg-js';

const [input, output, cornerArg, ...flags] = process.argv.slice(2);
const flag = (name) => { const i = flags.indexOf(`--${name}`); return i > -1 ? flags[i + 1] : undefined; };
if (!input || !output || !cornerArg) { console.error('usage: rectify.mjs <photo> <out> <corners> [--width n] [--ratio r] [--round #hex] [--refine] [--inset 0.004] [--outline]'); process.exit(1); }

const photo = jpeg.decode(readFileSync(input), { useTArray: true, maxMemoryUsageInMB: 4096 });
const nums = cornerArg.split(',').map(Number);
const corners = [0, 1, 2, 3].map((i) => [nums[i * 2] * photo.width, nums[i * 2 + 1] * photo.height]);
const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);

const luma = (x, y) => {
  const xx = Math.max(0, Math.min(photo.width - 1, Math.round(x))); const yy = Math.max(0, Math.min(photo.height - 1, Math.round(y)));
  const i = (yy * photo.width + xx) * 4;
  return [photo.data[i], photo.data[i + 1], photo.data[i + 2]];
};
/** Color of the photo averaged over a small patch, so grain and paint texture do not decide where an edge is. */
const patch = (x, y, r = 3) => {
  const sum = [0, 0, 0]; let n = 0;
  for (let dy = -r; dy <= r; dy += 2) for (let dx = -r; dx <= r; dx += 2) { const c = luma(x + dx, y + dy); sum[0] += c[0]; sum[1] += c[1]; sum[2] += c[2]; n++; }
  return sum.map((v) => v / n);
};

/** Each side, moved onto the strongest edge near it and straightened; returns the corners where the new sides cross. */
const refineCorners = (guess) => {
  const reach = Math.min(photo.width, photo.height) * 0.03;  // how far from the guess an edge is looked for, outside
  const grace = Math.min(photo.width, photo.height) * 0.012; // and inside
  const centre = guess.reduce((a, c) => [a[0] + c[0] / 4, a[1] + c[1] / 4], [0, 0]);
  const lines = [0, 1, 2, 3].map((e) => {
    const p = guess[e]; const q = guess[(e + 1) % 4];
    const len = dist(p, q); const d = [(q[0] - p[0]) / len, (q[1] - p[1]) / len];
    let n = [-d[1], d[0]]; // outward normal
    const mid = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    if ((mid[0] - centre[0]) * n[0] + (mid[1] - centre[1]) * n[1] < 0) n = [-n[0], -n[1]];
    const points = [];
    for (let k = 0; k < 80; k++) {
      const t = 0.12 + 0.76 * k / 79;
      const base = [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
      let best = null;
      for (let o = -grace; o <= reach; o += 1) {
        const at = (off) => patch(base[0] + n[0] * (o + off), base[1] + n[1] * (o + off));
        const outer = at(4); const inner = at(-4);
        const g = Math.hypot(outer[0] - inner[0], outer[1] - inner[1], outer[2] - inner[2]);
        if (!best || g > best.g) best = { g, o };
      }
      points.push([base[0] + n[0] * best.o, base[1] + n[1] * best.o, best.o]);
    }
    // discard points that sit far from the middle of the others (a pattern edge, a shadow), then fit a line through the rest
    const offsets = points.map((pt) => pt[2]).sort((a, b) => a - b);
    const median = offsets[Math.floor(offsets.length / 2)];
    const kept = points.filter((pt) => Math.abs(pt[2] - median) < Math.min(photo.width, photo.height) * 0.006);
    const mx = kept.reduce((a, pt) => a + pt[0], 0) / kept.length; const my = kept.reduce((a, pt) => a + pt[1], 0) / kept.length;
    let sxx = 0; let sxy = 0; let syy = 0;
    kept.forEach((pt) => { sxx += (pt[0] - mx) ** 2; sxy += (pt[0] - mx) * (pt[1] - my); syy += (pt[1] - my) ** 2; });
    const angle = 0.5 * Math.atan2(2 * sxy, sxx - syy);
    console.error(`side ${e}: ${kept.length}/${points.length} edge points, moved ${median.toFixed(1)}px`);
    return { point: [mx, my], dir: [Math.cos(angle), Math.sin(angle)] };
  });
  const cross = (a, b) => {
    const det = a.dir[0] * -b.dir[1] + a.dir[1] * b.dir[0];
    const t = ((b.point[0] - a.point[0]) * -b.dir[1] + (b.point[1] - a.point[1]) * b.dir[0]) / det;
    return [a.point[0] + a.dir[0] * t, a.point[1] + a.dir[1] * t];
  };
  return [cross(lines[3], lines[0]), cross(lines[0], lines[1]), cross(lines[1], lines[2]), cross(lines[2], lines[3])];
};
const inset = Number(flag('inset') || 0.004);
if (flags.includes('--refine')) {
  const refined = refineCorners(corners);
  // a hair inside the edge it found, so no thread of the sheet survives at the border
  const centre = refined.reduce((a, c) => [a[0] + c[0] / 4, a[1] + c[1] / 4], [0, 0]);
  refined.forEach((c, i) => { refined[i] = [c[0] + (centre[0] - c[0]) * inset, c[1] + (centre[1] - c[1]) * inset]; });
  refined.forEach((c, i) => { corners[i] = c; });
  console.error('corners:', refined.map((c) => `${(c[0] / photo.width).toFixed(4)},${(c[1] / photo.height).toFixed(4)}`).join(','));
}

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
