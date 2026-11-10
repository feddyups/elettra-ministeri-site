import { rgbToOklab, oklabToRgb, chroma, hue } from '../../src/lib/color-science.js';

/**
 * Chooses the background ("ground") of every series from the colors the series is made of.
 *
 * A ground is a deep, muted color of one hue. For each series, every hue that could serve is a candidate: the hue of each of its palette colors
 * (a tonal ground: the series sits on a deeper version of its own color) and the opposite of each (a complementary ground: the series' colors
 * stand out against it). A candidate hue G is judged on four things, all read from the series' pooled palette:
 *
 *   family     how much of the series lives in G's hue family (a ground that belongs to the series, as Sicily's ochre does)
 *   opposites  how much vivid color sits opposite G, which the ground makes stand out (Sicily's blues and teals against ochre)
 *   warmth     whether G agrees with the series' overall temperature (a warm series on a warm ground, a cool one on a cool ground)
 *   anchor     how salient the palette color that names G is (share times chroma), discounted when G is only its opposite
 *
 * The series are then assigned a hue together, so that the best total is reached while every pair stays at least `minGap` degrees apart
 * (the site's colors keep working as a map: no two series look alike). The ground itself is the hue at a fixed lightness and a chroma taken
 * from how colorful the series is, lowered until the text color reads on it.
 *
 * @param {Record<string, [string, string, number][]>} palettes  series slug to its palette rows `[hex, name, share]`
 * @param {{ ink: [number, number, number], lightness: number, minChroma: number, maxChroma: number, chromaShare: number, minContrast: number, gaps: number[], weights: object }} settings
 * @returns {Record<string, { rgb: number[], hue: number, why: string, score: number }>}
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
  return { name, share, chroma: chroma(lab), hue: hue(lab), lab };
});

const candidatesOf = (colors, weights) => {
  const chromatic = colors.filter((c) => c.chroma >= CHROMATIC);
  if (!chromatic.length) return [];
  const total = chromatic.reduce((sum, c) => sum + c.share * c.chroma, 0);
  const temperature = chromatic.reduce((sum, c) => sum + c.share * c.chroma * warmth(c.hue), 0) / total;
  const peak = Math.max(...chromatic.map((c) => c.share * c.chroma));
  const seen = new Set();
  const out = [];
  for (const source of chromatic) {
    for (const opposite of [false, true]) {
      const g = (source.hue + (opposite ? 180 : 0)) % 360;
      const key = Math.round(g / 5);
      if (seen.has(key)) continue;
      seen.add(key);
      const family = chromatic.filter((c) => gapBetween(c.hue, g) <= FAMILY_SPAN).reduce((s, c) => s + c.share, 0);
      const opposites = chromatic.filter((c) => gapBetween(c.hue, (g + 180) % 360) <= OPPOSITE_SPAN)
        .reduce((s, c) => s + c.share * Math.min(1, c.chroma / VIVID), 0);
      const agreement = 1 - Math.abs(warmth(g) - temperature);
      const anchor = (source.share * source.chroma / peak) * (opposite ? 0.8 : 1);
      const score = weights.family * family + weights.opposites * opposites + weights.warmth * agreement + weights.anchor * anchor;
      const standsOut = chromatic.filter((c) => gapBetween(c.hue, (g + 180) % 360) <= OPPOSITE_SPAN).map((c) => c.name);
      out.push({ hue: g, score, why: `${opposite ? `opposite of ${source.name}` : `deep ${source.name}`}${standsOut.length ? `, sets off ${standsOut.join(' and ')}` : ''}` });
    }
  }
  return out;
};

const groundColor = (g, colors, settings) => {
  const chromatic = colors.filter((c) => c.chroma >= CHROMATIC);
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

export const deriveGrounds = (palettes, settings) => {
  const slugs = Object.keys(palettes);
  const colors = Object.fromEntries(slugs.map((slug) => [slug, readPalette(palettes[slug])]));
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

/**
 * The ground of the page that gathers every work (the All paintings index): chosen by the same judgment from the palette of the whole body of
 * work, among the hues that stay at least the first of `minGaps` that can be met (degrees) from every series' ground, so it reads as the umbrella above them and not as one of them.
 */
export const deriveUmbrellaGround = (rows, settings, avoidHues, minGaps) => {
  const colors = readPalette(rows);
  const all = candidatesOf(colors, settings.weights);
  const gap = minGaps.find((g) => all.some((o) => avoidHues.every((h) => gapBetween(h, o.hue) >= g)));
  if (gap === undefined) throw new Error('No hue is left for the page of all works; lower the umbrella gaps');
  const options = all.filter((o) => avoidHues.every((h) => gapBetween(h, o.hue) >= gap));
  const choice = options.reduce((a, b) => (b.score > a.score ? b : a));
  return { rgb: groundColor(choice.hue, colors, settings), hue: Math.round(choice.hue), why: choice.why, score: choice.score };
};
