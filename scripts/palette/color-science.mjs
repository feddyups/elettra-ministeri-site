/**
 * Color math for the palette analysis. Everything is done in OKLab / OKLCH, where
 * distances match how different two colors look, so clusters and hue bins are meaningful.
 */

const toLinear = (v) => {
  v /= 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const toSrgb = (v) => {
  const c = Math.max(0, Math.min(1, v));
  return Math.round(255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055));
};

/** sRGB 0-255 to [L, a, b]. */
export const rgbToOklab = (r, g, b) => {
  const lr = toLinear(r); const lg = toLinear(g); const lb = toLinear(b);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
};

/** [L, a, b] to sRGB 0-255 (clamped to the sRGB gamut). */
export const oklabToRgb = ([L, a, b]) => {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    toSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    toSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    toSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
};

export const toHex = (rgb) => `#${rgb.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
export const chroma = ([, a, b]) => Math.hypot(a, b);
/** Hue angle in degrees, 0 to 360 (OKLCH: red about 30, yellow 100, green 145, cyan 195, blue 265, magenta 340). */
export const hue = ([, a, b]) => (Math.atan2(b, a) * 180 / Math.PI + 360) % 360;
export const distance = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);

/** warm = reds, oranges and yellows; green; cool = cyans and blues; violet = purples and magentas. */
export const hueFamily = (h) => {
  if (h >= 330 || h < 110) return 'warm';
  if (h < 175) return 'green';
  if (h < 300) return 'cool';
  return 'violet';
};

/** Pigment-like names, matched to the nearest color in OKLab, so palettes can be talked about in an artist's words. */
const NAMED = [
  ['vermilion', '#e34234'], ['crimson', '#a4161a'], ['carmine', '#960018'], ['rust', '#8b3a1a'], ['terracotta', '#b5543a'],
  ['burnt orange', '#cc5500'], ['tangerine', '#f28500'], ['marigold', '#f6a800'], ['sunflower', '#f5d000'], ['lemon', '#f1e55a'],
  ['ochre', '#b8860b'], ['sand', '#d8c39a'], ['cream', '#f2e6cf'], ['peach', '#f6b99a'], ['salmon', '#f08a7a'],
  ['coral', '#ee6a5a'], ['rose', '#e86a92'], ['fuchsia', '#c2187a'], ['magenta', '#a1166b'], ['plum', '#5a1d4a'],
  ['lilac', '#a98bd6'], ['violet', '#6a3fb5'], ['indigo', '#2b2a8a'], ['ultramarine', '#1f3bc4'], ['cobalt', '#0b5cd5'],
  ['cerulean', '#2f90d8'], ['sky', '#8ac4ec'], ['turquoise', '#16a6a6'], ['teal', '#1b6b72'], ['petrol', '#0d3f52'],
  ['navy', '#0f1f4a'], ['emerald', '#0f9d58'], ['kelly green', '#2e9a2e'], ['leaf', '#6fae3b'], ['olive', '#7a8a1f'],
  ['forest', '#1d5a2c'], ['bottle green', '#1f402d'], ['sage', '#9bb08a'], ['chocolate', '#5a3320'], ['umber', '#7a4a2a'], ['oxblood', '#5c1a1b'],
  ['mahogany', '#6b2f1f'], ['ink blue', '#16264f'], ['graphite', '#3a3a40'],
];
const NAMED_LAB = NAMED.map(([name, hex]) => [name, rgbToOklab(...[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)))]);

/** Hue and chroma count for more than lightness here, so a dark green is not mistaken for a grey. */
const nameDistance = (p, q) => Math.hypot(0.55 * (p[0] - q[0]), p[1] - q[1], p[2] - q[2]);

export const nearestName = (lab) => {
  let best = NAMED_LAB[0]; let bestD = Infinity;
  for (const entry of NAMED_LAB) {
    const d = nameDistance(lab, entry[1]);
    if (d < bestD) { bestD = d; best = entry; }
  }
  return best[0];
};
