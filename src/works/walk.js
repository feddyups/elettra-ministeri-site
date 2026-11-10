import { rgbToOklab, distance } from '../lib/color-science.js';
import { joinNames } from '../color/text.js';

/*
 * Where to look next. The distance between two paintings is how far apart their colors are (each color matched to the nearest color of
 * the other, weighted by how much of the picture it covers, in OKLab so equal steps look equal). From that the walk offers three
 * paintings, each with a reason in neutral words:
 *   nearest       the painting closest in color
 *   counterpart   a painting of similar strength of color turned the other way, warm for cool or cool for warm
 *   a step        a painting a little warmer (or a little cooler) that is still close
 * The walk stays inside the series unless a painting from another series is clearly closer (CROSS_SERIES_RATIO), and it leaves
 * out paintings already seen on this visit, so each step leads somewhere new.
 */
const CROSS_SERIES_RATIO = 0.75;
const SAME_STRENGTH = 0.04;   // chroma difference that still counts as the same strength of color
const COUNTERPART_LEAN = 30;  // how much further toward the other temperature a counterpart must lean
const STEP = [10, 45];        // how much warmer or cooler a step is
const SEEN_KEY = 'em-walk';

const lab = (hex) => rgbToOklab(...[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)));
const labs = new WeakMap();
const labsOf = (work) => { if (!labs.has(work)) labs.set(work, work.palette.map(([hex, name, share]) => ({ name, share, lab: lab(hex) }))); return labs.get(work); };

const reach = (from, to) => labsOf(from).reduce((sum, c) => sum + c.share * Math.min(...labsOf(to).map((o) => distance(c.lab, o.lab))), 0);
export const colorDistance = (a, b) => reach(a, b) + reach(b, a);

/** A color's name without its shade, so light and deep vermilion count as one. */
const plain = (name) => name.replace(/^(light|deep|dark) /, '');

const lean = (work) => work.warm - work.cool - work.violet;

/** Paintings this visit has already looked at (kept for the visit only). */
export const seenWorks = () => { try { return JSON.parse(sessionStorage.getItem(SEEN_KEY) || '[]'); } catch (e) { return []; } };
export const markSeen = (slug) => {
  try { const seen = seenWorks(); if (!seen.includes(slug)) sessionStorage.setItem(SEEN_KEY, JSON.stringify([...seen, slug].slice(-40))); } catch (e) { /* the walk still works without memory */ }
};

/** The colors two paintings have in common, by name (the first work's colors that the second has something close to). */
const sharedNames = (a, b) => {
  const shared = labsOf(a).filter((c) => c.share >= 0.06 && labsOf(b).some((o) => distance(c.lab, o.lab) < 0.12)).map((c) => plain(c.name));
  return [...new Set(shared)].slice(0, 2);
};
const mainNames = (work, count = 2) => [...new Set(labsOf(work).map((c) => plain(c.name)))].slice(0, count);

/**
 * `{ work, kind, reason, crossSeries }` for up to three paintings to look at after `work`.
 * `universe` is every painting; `seen` the slugs already looked at this visit.
 */
export const nextWorks = (work, universe, seen = []) => {
  let pool = universe.filter((o) => o.slug && o.slug !== work.slug && o.series !== 'textiles');
  const fresh = pool.filter((o) => !seen.includes(o.slug));
  if (fresh.length >= 3) pool = fresh;
  const near = new Map(pool.map((o) => [o, colorDistance(work, o)]));
  const chosen = [];
  const cross = (o) => o.series !== work.series;

  /** The best of `candidates` by `score` (lower is better), staying in the series unless another is clearly better. */
  const pick = (candidates, score) => {
    const open = candidates.filter((o) => !chosen.some((c) => c.work === o));
    const sameSeries = open.filter((o) => !cross(o)).sort((a, b) => score(a) - score(b))[0];
    const other = open.filter(cross).sort((a, b) => score(a) - score(b))[0];
    if (!sameSeries) return other || null;
    return other && score(other) < score(sameSeries) * CROSS_SERIES_RATIO ? other : sameSeries;
  };
  const add = (o, kind, reason) => { if (o) chosen.push({ work: o, kind, reason, crossSeries: cross(o) }); };

  const nearest = pick(pool, (o) => near.get(o));
  if (nearest) {
    const names = sharedNames(work, nearest);
    add(nearest, 'nearest', names.length ? `Shares ${joinNames(names)}.` : 'Close in color overall.');
  }

  const warmer = lean(work) < 20;
  const turned = pick(pool.filter((o) => Math.abs(o.chroma - work.chroma) <= SAME_STRENGTH && (warmer ? lean(o) - lean(work) : lean(work) - lean(o)) >= COUNTERPART_LEAN), (o) => near.get(o));
  if (turned) add(turned, 'counterpart', `Similar strength of color, turned ${warmer ? 'warmer' : 'cooler'}.`);

  const step = pick(pool.filter((o) => { const d = warmer ? lean(o) - lean(work) : lean(work) - lean(o); return d >= STEP[0] && d <= STEP[1]; }), (o) => near.get(o));
  if (step) add(step, 'step', `A step ${warmer ? 'warmer' : 'cooler'}, with ${joinNames(mainNames(step))}.`);

  // fewer than three found: fill with the next nearest so the walk always has somewhere to go
  while (chosen.length < 3) {
    const extra = pick(pool, (o) => near.get(o));
    if (!extra) break;
    add(extra, 'nearest', `Close in color: ${joinNames(mainNames(extra))}.`);
  }
  return chosen;
};
