/**
 * Rebuilds everything that is generated from the catalogue and the images, in one command:
 *
 *   npm run sync -- --catalogue "/path/to/catalogue"      (or set CATALOGUE_DIR once)
 *
 * It runs the color map (src/themes/tones.generated.*) and the color analysis of every work (src/color/atlas.generated.js,
 * src/themes/series-attr.js), so the infographics, the series colors, every "N works" count that reads the data and the
 * hero all follow the images. Then commit, tag, and run `npm run check:site` once the release is live.
 */
import { spawnSync } from 'node:child_process';

const i = process.argv.indexOf('--catalogue');
const catalogue = i > -1 ? process.argv[i + 1] : process.env.CATALOGUE_DIR;
if (!catalogue) { console.error('Give the catalogue folder: npm run sync -- --catalogue "/path/to/catalogue"'); process.exit(1); }

const run = (script, args = []) => {
  const result = spawnSync('node', ['--use-system-ca', script, ...args], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
};
// the series backgrounds are worked out from the color analysis, and the analysis' accents from the backgrounds: analysis, tones, analysis
run('scripts/build-atlas.mjs', ['--catalogue', catalogue]);
run('scripts/build-tones.mjs');
run('scripts/build-atlas.mjs', ['--catalogue', catalogue]);
console.log('\nGenerated files are up to date. Next: commit, tag, publish the release, then `npm run check:site`.');
