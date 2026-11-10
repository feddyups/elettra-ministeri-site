import { rgbToOklab, oklabToRgb, chroma, hue } from '../../src/lib/color-science.js';

/**
 * Chooses the background ("ground") of every series, and of the page that gathers them all, from the colors they are made of.
 * One judgment applies to every one of them: the same weights, the same hue spacing, the same lightness and chroma rule.
 *
 * A ground is a deep, muted color of one hue. For each entity, every hue that could serve is a candidate: the hue of each of its palette colors
 * (a tonal ground: it sits on a deeper version of its own color) and the opposite of each (a complementary ground: its colors stand out against it).
 *
 * How much a palette color counts. A color counts for how far its hue family rises above the same family in the whole body of work (the reference):
 * sand and ochre are in every series, so they count for little, while a series' own reds or greens count for a lot. The reference itself has nothing
 * to rise above, so its colors count at their plain share.
 *
 * A candidate hue G is then judged on five things, all read from those weighted colors:
 *
 *   family     how much of the entity lives in G's hue family (a ground that belongs to it, as Sicily's ochre does)
 *   opposites  how much vivid color sits opposite G, which the ground makes stand out (Sicily's blues and teals against ochre)
 *   warmth     whether G agrees with the entity's overall temperature (a warm series on a warm ground, a cool one on a cool ground)
 *   anchor     how salient the palette color that names G is (weight times chroma), discounted when G is only its opposite
 *   lead       whether G is the hue of the entity's heaviest color, the color that sets its key
 *
 * All entities are assigned a hue together: the assignment with the best total, among those that keep every pair at least `minGap` degrees apart
 * (the first of `gaps` that can be met), so the site's colors keep working as a map. The ground itself is its hue at a fixed lightness and a chroma
 * taken from how colorful the entity is, with the lightness lowered until the text color reads on it.
 *
 * @param {Record<string, [string, string, number][]>} palettes  entity slug to its palette rows `[hex, name, share]`
 * @param {[string, string, number][]} reference  the palette rows of the whole body of work
 * @param {string[]} referenceSlugs  slugs of `palettes` that are the reference itself (weighted at plain share)
 * @param {{ ink: number[], lightness: number, minChroma: number, maxChroma: number, chromaShare: number, minContrast: number, gaps: number[], weights: object }} settings
 * @returns {Record<string, { rgb: number[], hue: number, why: string, score: number, minGap: number }>}
 */

const CHROMATIC = 0.045;
const FAMILY_SPAN = 32;
const OPPOSITE_SPAN = 40;
const VIVID = 0.12;

const gapBetween = (a, b) => { const d = Math.abs(a - b) % 360; return Math.min(d, 360 - d); };
const warmth = (h) => 0.5 + 0.5 * Math.cos((h - 45) * Math.PI / 180);
const channel = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const luminance = (c) => 0.2126 * channel(c[0]) + 0.7152 * channel(c[1]) + 0.0722 * channel(c[2]);
export const contrastOf = (a, b) => { const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };

const readPalette = (rows) => rows.map(([hex, name, share]) => {
  const lab = rgbToOklab(...[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)));
  return { name, share, weight: share, chroma: chroma(lab), hue: hue(lab) };
});

const chromaticOf = (colors) => colors.filter((c) => c.chroma >= CHROMATIC);
const familyOf = (colors, g, key = 'share') => chromaticOf(colors).filter((c) => gapBetween(c.hue, g) <= FAMILY_SPAN).reduce((s, c) => s + c[key], 0);

/** Weights each color by how far its hue family rises above the same family in the reference. */
const weighFromReference = (colors, reference) => {
  for (const c of colors) {
    const own = familyOf(colors, c.hue);
    const base = familyOf(reference, c.hue);
    c.weight = c.chroma >= CHROMATIC && own > 0 ? c.share * Math.max(0, 1 - base / own) : c.share;
  }
};

const candidatesOf = (colors, weights) => {
  const chromatic = chromaticOf(colors);
  const total = chromatic.reduce((sum, c) => sum + c.weight * c.chroma, 0);
  if (!chromatic.length || total === 0) return [];
  const temperature = chromatic.reduce((sum, c) => sum + c.weight * c.chroma * warmth(c.hue), 0) / total;
  const peak = Math.max(...chromatic.map((c) => c.weight * c.chroma));
  const lead = chromatic.reduce((a, b) => (b.weight > a.weight ? b : a));
  const seen = new Set();
  const out = [];
  for (const source of chromatic) {
    for (const opposite of [false, true]) {
      const g = (source.hue + (opposite ? 180 : 0)) % 360;
      const key = Math.round(g / 5);
      if (seen.has(key)) continue;
      seen.add(key);
      const family = familyOf(colors, g, 'weight');
      const against = chromatic.filter((c) => gapBetween(c.hue, (g + 180) % 360) <= OPPOSITE_SPAN);
      const opposites = against.reduce((s, c) => s + c.weight * Math.min(1, c.chroma / VIVID), 0);
      const agreement = 1 - Math.abs(warmth(g) - temperature);
      const anchor = (source.weight * source.chroma / peak) * (opposite ? 0.8 : 1);
      const leads = gapBetween(lead.hue, g) <= FAMILY_SPAN ? 1 : 0;
      const score = weights.family * family + weights.opposites * opposites + weights.warmth * agreement + weights.anchor * anchor + weights.lead * leads;
      out.push({ hue: g, score, why: `${opposite ? `opposite of ${source.name}` : `deep ${source.name}`}${against.length ? `, sets off ${against.map((c) => c.name).join(' and ')}` : ''}` });
    }
  }
  return out;
};

const groundColor = (g, colors, settings) => {
  const chromatic = chromaticOf(colors);
  const mean = chromatic.reduce((s, c) => s + c.share * c.chroma, 0) / chromatic.reduce((s, c) => s + c.share, 0);
  const c = Math.min(settings.maxChroma, Math.max(settings.minChroma, mean * settings.chromaShare));
  let lightness = settings.lightness;
  let rgb;
  do {
    const lab = [lightness, c * Math.cos(g * Math.PI / 180), c * Math.sin(g * Math.PI / 180)];
    rgb = oklabToRgb(lab).map((v) => Math.min(255, Math.max(0, Math.round(v))));
    lightness -= 0.01;
  } while (contrastOf(rgb, settings.ink) < settings.minContrast && lightness > 0.1);
  return rgb;
};

export const deriveGrounds = (palettes, reference, referenceSlugs, settings) => {
  const slugs = Object.keys(palettes);
  const refColors = readPalette(reference);
  const colors = Object.fromEntries(slugs.map((slug) => [slug, readPalette(palettes[slug])]));
  for (const slug of slugs) if (!referenceSlugs.includes(slug)) weighFromReference(colors[slug], refColors);
  const options = Object.fromEntries(slugs.map((slug) => [slug, candidatesOf(colors[slug], settings.weights)]));

  let best = null;
  for (const minGap of settings.gaps) {
    const pick = [];
    const walk = (i, total) => {
      if (i === slugs.length) { if (!best || total > best.total) best = { total, pick: pick.slice() }; return; }
      for (const option of options[slugs[i]]) {
        if (pick.some((p) => gapBetween(p.hue, option.hue) < minGap)) continue;
        pick.push(option); walk(i + 1, total + option.score); pick.pop();
      }
    };
    walk(0, 0);
    if (best) { best.minGap = minGap; break; }
  }
  if (!best) throw new Error('No assignment keeps the series apart; lower the gaps in TONE_SETTINGS.ground');
  return Object.fromEntries(slugs.map((slug, i) => {
    const choice = best.pick[i];
    return [slug, { rgb: groundColor(choice.hue, colors[slug], settings), hue: Math.round(choice.hue), why: choice.why, score: choice.score, minGap: best.minGap }];
  }));
};
