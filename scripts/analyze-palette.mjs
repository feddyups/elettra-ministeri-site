/**
 * Analyses the colors of the whole body of work (scripts/palette/works.config.mjs):
 * a palette for every painting, a fingerprint for every series, and one signature palette
 * across all of it, found with k-means clustering in OKLab.
 *
 * Usage: npm run analyze:palette -- --catalogue "/path/to/catalogue" [--out report.json] [--k 5]
 */
import { writeFileSync } from 'node:fs';
import { WORKS } from './palette/works.config.mjs';
import { loadWorkPixels } from './palette/image.mjs';
import { analyzeWork, poolPalette, summarize, complementaryPair } from './palette/analyze.mjs';

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
};
const catalogueDir = arg('catalogue', process.env.CATALOGUE_DIR);
const out = arg('out', 'palette-report.json');
const k = Number(arg('k', 5));

const results = [];
for (const work of WORKS) {
  const pixels = await loadWorkPixels(work, catalogueDir);
  const analysis = analyzeWork(pixels, { k });
  results.push({ ...work, source: work.catalogue ? `catalogue: ${work.catalogue}` : work.url, ...analysis });
  console.log(`${work.title.padEnd(30)} ${analysis.palette.map((c) => `${c.name} ${Math.round(c.share * 100)}%`).join(', ')}`);
}

const seriesIds = [...new Set(results.map((r) => r.series).filter(Boolean))];
const series = Object.fromEntries(seriesIds.map((id) => {
  const group = results.filter((r) => r.series === id);
  return [id, { ...summarize(group), palette: poolPalette(group, 5) }];
}));
const signature = poolPalette(results, 10);
const accents = poolPalette(results, 8, { vivid: true });
const overall = { ...summarize(results), signature, accents, complementary: complementaryPair(accents) };

const strip = (r) => { const { samples, ...rest } = r; return rest; };
writeFileSync(out, JSON.stringify({ k, works: results.map(strip), series, overall }, null, 2));
console.log(`\nWrote ${out}`);
