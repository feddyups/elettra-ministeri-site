import { rgbToOklab, chroma, hue } from './color-science.js';

/*
 * How a painting's colors relate to each other, in the vocabulary of color theory, worked out from its palette
 * (`[hex, name, share]`, the main colors with the share of the picture each covers). Every definition is a number here,
 * so every chart and sentence on the site means the same thing by it.
 *
 *   chromatic   a color with chroma of at least MIN_CHROMA (below that it is a neutral: black, white, grey, paper)
 *   dominant    the chromatic color that covers the most
 *   gathered    the painting's hues sit close together (their share-weighted spread is tight): an analogous scheme
 *   accent      a chromatic color covering at most ACCENT_MAX_SHARE of the picture whose hue lies ACCENT_ANGLE or more
 *               away from the dominant one: a small opposite held against a larger mass
 *   partner     a chromatic color covering more than ACCENT_MAX_SHARE whose hue lies ACCENT_ANGLE or more away from the dominant one:
 *               an opposite that is a full partner, not an accent (a painting with a partner has no accent)
 *   carried     the dominant color alone covers CARRIED_SHARE or more of the picture
 *
 * Hue is OKLCH hue in degrees. These are readings of five clustered colors per
 * painting, not of the painter's intent.
 */
export const MIN_CHROMA = 0.05;
export const ACCENT_MAX_SHARE = 0.2;
export const ACCENT_ANGLE = 120;
export const GATHERED = 0.7;
export const CARRIED_SHARE = 0.4;

/** The angle between two hues, 0 to 180. */
export const hueGap = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };

const colorOf = ([hex, name, share]) => {
  const lab = rgbToOklab(...[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)));
  return { hex, name, share, L: lab[0], C: chroma(lab), h: hue(lab) };
};

/** A painting read for harmony: `{ dominant, accent, gathered, carried, dominantShare, lightRange, colors }`. */
export const readPalette = (palette) => {
  const colors = palette.map(colorOf);
  const total = colors.reduce((sum, c) => sum + c.share, 0) || 1;
  const chromatic = colors.filter((c) => c.C >= MIN_CHROMA);
  const dominant = [...chromatic].sort((a, b) => b.share - a.share)[0] || null;
  const partner = dominant ? chromatic.filter((c) => c !== dominant && c.share / total > ACCENT_MAX_SHARE && hueGap(c.h, dominant.h) >= ACCENT_ANGLE).sort((a, b) => b.share - a.share)[0] || null : null;
  const accents = dominant && !partner ? chromatic.filter((c) => c.share / total <= ACCENT_MAX_SHARE && hueGap(c.h, dominant.h) >= ACCENT_ANGLE) : [];
  const accent = accents.sort((a, b) => b.C - a.C)[0] || null;
  let x = 0; let y = 0; let weight = 0;
  chromatic.forEach((c) => { x += Math.cos(c.h * Math.PI / 180) * c.share; y += Math.sin(c.h * Math.PI / 180) * c.share; weight += c.share; });
  const lights = colors.map((c) => c.L);
  return {
    colors, chromatic, dominant, accent, partner,
    dominantShare: dominant ? dominant.share / total : 0,
    gathered: weight > 0 && Math.hypot(x, y) / weight >= GATHERED,
    carried: dominant ? dominant.share / total >= CARRIED_SHARE : false,
    lightRange: Math.max(...lights) - Math.min(...lights),
  };
};

/** The ways of building a painting, as the keys the index and the charts use. */
export const BUILDS = [
  { key: 'gathered', label: 'Neighboring hues', test: (r) => r.gathered },
  { key: 'accent', label: 'Opposite accent', test: (r) => Boolean(r.accent) },
  { key: 'partner', label: 'Opposite partner', test: (r) => Boolean(r.partner) },
  { key: 'carried', label: 'One color carries it', test: (r) => r.carried },
];
export const buildsOf = (reading) => BUILDS.filter((b) => b.test(reading)).map((b) => b.key);
