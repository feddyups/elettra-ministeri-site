import { rgbToOklab, oklabToRgb, toHex, chroma, hue, hueFamily, nearestName } from './color-science.mjs';
import { kmeans } from './cluster.mjs';

const HUE_BINS = 24;
const SAMPLES_PER_WORK = 3000;

/** What a pixel is: black ink, white paper, a grey, or a real color. */
const classify = (lab) => {
  const C = chroma(lab);
  if (lab[0] < 0.22 && C < 0.06) return 'ink';
  if (lab[0] > 0.92 && C < 0.05) return 'paper';
  if (C < 0.04) return 'neutral';
  return 'chromatic';
};

const round = (v, d = 3) => +v.toFixed(d);
/** Two clusters can land on the same name; the lighter one becomes "light <name>" and the darker "deep <name>". */
const uniqueNames = (palette) => {
  const byName = {};
  palette.forEach((c) => { (byName[c.name] = byName[c.name] || []).push(c); });
  Object.values(byName).forEach((group) => {
    if (group.length < 2) return;
    group.sort((a, b) => b.L - a.L);
    group[0].name = `light ${group[0].name}`;
    group[group.length - 1].name = `deep ${group[group.length - 1].name}`;
  });
  return palette;
};

const describe = (cluster) => {
  const [L] = cluster.center;
  return { hex: toHex(oklabToRgb(cluster.center)), name: nearestName(cluster.center), share: round(cluster.share), L: round(L), C: round(chroma(cluster.center)), h: Math.round(hue(cluster.center)) };
};

/** Evenly spaced subset, so pooling many works stays fast and deterministic. */
const evenly = (items, count) => {
  if (items.length <= count) return items;
  const step = items.length / count;
  return Array.from({ length: count }, (_, i) => items[Math.floor(i * step)]);
};

/** Analyses one work's pixels. `samples` (its real colors) are kept for the series and overall palettes. */
export const analyzeWork = ({ data, width, height }, { k }) => {
  const counts = { ink: 0, paper: 0, neutral: 0, chromatic: 0 };
  const colors = [];
  for (let i = 0; i < data.length; i += 4) {
    const lab = rgbToOklab(data[i], data[i + 1], data[i + 2]);
    const kind = classify(lab);
    counts[kind]++;
    if (kind === 'chromatic') colors.push(lab);
  }
  const total = width * height;
  const shares = Object.fromEntries(Object.entries(counts).map(([name, n]) => [name, round(n / total)]));

  const samples = evenly(colors, SAMPLES_PER_WORK);
  const palette = uniqueNames(kmeans(samples, samples.map(() => 1), k).map(describe));

  const hueBins = new Array(HUE_BINS).fill(0);
  const family = { warm: 0, green: 0, cool: 0, violet: 0 };
  let chromaSum = 0; let lightSum = 0; let vivid = 0;
  for (const lab of colors) {
    const C = chroma(lab); const h = hue(lab);
    hueBins[Math.floor(h / (360 / HUE_BINS)) % HUE_BINS] += C;
    family[hueFamily(h)]++;
    chromaSum += C; lightSum += lab[0];
    if (C > 0.15) vivid++;
  }
  const hueTotal = hueBins.reduce((a, b) => a + b, 0) || 1;
  const n = colors.length || 1;
  return {
    size: [width, height],
    shares,
    palette,
    stats: {
      meanChroma: round(chromaSum / n), meanLightness: round(lightSum / n), vibrancy: round(vivid / n),
      warm: round(family.warm / n), green: round(family.green / n), cool: round(family.cool / n), violet: round(family.violet / n),
    },
    hueBins: hueBins.map((v) => round(v / hueTotal, 4)),
    samples,
  };
};

/**
 * A palette for a group of works, giving every work the same say however many colors it has.
 * With `vivid`, strong colors count more, so large flat backgrounds stop drowning out the accents.
 */
export const poolPalette = (results, k, { vivid = false } = {}) => {
  const points = []; const weights = [];
  for (const r of results) {
    const w = 1 / (r.samples.length || 1);
    for (const s of r.samples) { points.push(s); weights.push(vivid ? w * chroma(s) ** 2 : w); }
  }
  return uniqueNames(kmeans(points, weights, k).map(describe));
};

const average = (results, pick) => round(results.reduce((sum, r) => sum + pick(r), 0) / results.length);

/** Summary numbers for a group of works. */
export const summarize = (results) => ({
  works: results.length,
  meanChroma: average(results, (r) => r.stats.meanChroma),
  vibrancy: average(results, (r) => r.stats.vibrancy),
  meanLightness: average(results, (r) => r.stats.meanLightness),
  warm: average(results, (r) => r.stats.warm),
  green: average(results, (r) => r.stats.green),
  cool: average(results, (r) => r.stats.cool),
  violet: average(results, (r) => r.stats.violet),
  ink: average(results, (r) => r.shares.ink),
  paper: average(results, (r) => r.shares.paper),
  hueBins: Array.from({ length: HUE_BINS }, (_, i) => average(results, (r) => r.hueBins[i])),
});

/** The pair of strong palette colors closest to opposite on the hue wheel, weighted by how much of the work they cover. */
export const complementaryPair = (palette) => {
  let best = null;
  const strong = palette.filter((c) => c.C > 0.08);
  for (let i = 0; i < strong.length; i++) for (let j = i + 1; j < strong.length; j++) {
    const apart = Math.abs(((strong[i].h - strong[j].h + 540) % 360) - 180); // angle between the two hues, 0 to 180
    const offBy = 180 - apart; // how far from exactly opposite
    if (offBy > 45) continue;
    const score = strong[i].share * strong[j].share * (1 - offBy / 45);
    if (!best || score > best.score) best = { score, a: strong[i], b: strong[j], offBy: Math.round(offBy) };
  }
  return best && { a: best.a, b: best.b, offBy: best.offBy };
};
