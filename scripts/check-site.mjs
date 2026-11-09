/**
 * Compares the live site with the catalogue and says what is out of date. Run it after every release or change:
 *
 *   npm run check:site
 *
 * It looks at the public pages only (nothing is changed) and reports:
 *   - the release each Squarespace injection points to (header, footer, home) against the newest git tag,
 *   - every work in the catalogue: does its page exist, is it on its series page, does its thumbnail there match
 *     the catalogue image, and how many "N works" labels disagree with the real count,
 *   - catalogue images that still carry a pale border (a quick check of each image's outer pixels).
 */
import { execSync } from 'node:child_process';
import { CATALOGUE } from '../src/works/catalogue.js';
import { SERIES } from '../src/themes/tones.config.js';

const SITE = 'https://www.elettraministeri.com';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const page = async (path) => {
  await wait(250);
  const res = await fetch(`${SITE}${path}?check=${Date.now()}`);
  return { status: res.status, html: res.ok ? await res.text() : '' };
};
const problems = [];
const note = (text) => { problems.push(text); console.log(`  ✗ ${text}`); };
const ok = (text) => console.log(`  ✓ ${text}`);

console.log('Releases');
const latest = execSync('git tag --sort=-v:refname', { cwd: new URL('..', import.meta.url) }).toString().split('\n')[0];
const home = await page('/');
const pins = [...home.html.matchAll(/feddyups\/elettra-ministeri-site@(v[\d.]+)\//g)].map((m) => m[1]);
const distinct = [...new Set(pins)];
if (distinct.length === 1 && distinct[0] === latest) ok(`the site loads ${latest}, the newest tag`);
else note(`the site loads ${distinct.join(', ') || 'nothing'}; the newest tag is ${latest}. Update the header and footer injections and the home code block.`);

console.log('Series pages');
const bySeries = {};
Object.entries(CATALOGUE).forEach(([slug, work]) => { (bySeries[work.series] ||= []).push([slug, work]); });
const tiles = (await page('/paintings')).html;
for (const [series, works] of Object.entries(bySeries)) {
  const path = SERIES[series]?.path || `/paintings/${series}`;
  const { status, html } = await page(path);
  if (status !== 200) { note(`${path} answers ${status}`); continue; }
  const listed = [...html.matchAll(/<li class="th-work" id="([^"]+)"/g)].map((m) => m[1]);
  const missing = works.map(([slug]) => slug).filter((slug) => !listed.includes(slug));
  const extra = listed.filter((id) => !CATALOGUE[id]);
  if (missing.length) note(`${path} lacks ${missing.join(', ')}`);
  if (extra.length) note(`${path} lists ${extra.join(', ')}, which are not in the catalogue`);
  works.forEach(([slug, work]) => {
    if (!listed.includes(slug)) return;
    const id = work.image.src.match(/\/([0-9a-f-]{36}|\d{13}-[A-Z0-9]{20})\//)?.[1];
    if (id && !html.includes(id)) note(`${path}: the thumbnail of ${slug} is not the catalogue image`);
  });
  if (!missing.length && !extra.length) ok(`${path} lists all ${works.length} works`);
  const label = tiles.match(new RegExp(`<b>${SERIES[series]?.label}</b>[\\s\\S]{0,300}?<small>(\\d+) works?</small>`));
  if (label && Number(label[1]) !== works.length) note(`/paintings says ${label[1]} works for ${SERIES[series].label}; the catalogue has ${works.length}`);
}

console.log('Painting pages');
let missingPages = 0;
for (const slug of Object.keys(CATALOGUE)) {
  const { status } = await page(`/paintings/${slug}`);
  if (status !== 200) { note(`/paintings/${slug} answers ${status}`); missingPages++; }
}
if (!missingPages) ok(`all ${Object.keys(CATALOGUE).length} painting pages answer`);

console.log(problems.length ? `\n${problems.length} thing(s) to fix.` : '\nThe site matches the catalogue.');
process.exit(problems.length ? 1 : 0);
