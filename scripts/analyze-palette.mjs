/**
 * Prints and saves the full color analysis of the body of work (scripts/palette/works.config.mjs).
 *
 * Usage: npm run analyze:palette -- --catalogue "/path/to/catalogue" [--out report.json] [--k 5]
 */
import { writeFileSync } from 'node:fs';
import { runAnalysis } from './palette/run.mjs';

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
};
const out = arg('out', 'palette-report.json');

const report = await runAnalysis({
  catalogueDir: arg('catalogue', process.env.CATALOGUE_DIR),
  k: Number(arg('k', 5)),
  onWork: (work, analysis) => console.log(`${work.title.padEnd(30)} ${analysis.palette.map((c) => `${c.name} ${Math.round(c.share * 100)}%`).join(', ')}`),
});
writeFileSync(out, JSON.stringify(report, null, 2));
console.log(`\nWrote ${out}`);
