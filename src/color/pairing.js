import { rgbToOklab, chroma, hue } from '../lib/color-science.js';

const MIN_CHROMA = 0.08; // a color with less chroma is a neutral, not a hue
const MIN_SHARE = 0.04;  // and one that covers less of the painting is an accent too small to count
const BANDS = [
  ['red', 345, 20], ['orange', 20, 70], ['yellow', 70, 110], ['green', 110, 175], ['blue', 200, 280], ['violet', 280, 345],
];
/** Pairs of families on opposite sides of the color wheel. */
const OPPOSITES = [['orange', 'blue'], ['red', 'green'], ['yellow', 'violet']];

const inBand = (h, [, from, to]) => (from < to ? h >= from && h < to : h >= from || h < to);
const hueOf = (hex) => {
  const lab = rgbToOklab(...[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)));
  return chroma(lab) < MIN_CHROMA ? null : hue(lab);
};
const familyOf = (hex) => {
  const h = hueOf(hex);
  const band = h === null ? null : BANDS.find((b) => inBand(h, b));
  return band ? band[0] : null;
};

/** The strong colors of a work, by family: `{ orange: [hex, name, share], ... }`, the biggest color of each family. */
const familiesOf = (work) => {
  const found = {};
  work.palette.filter(([, , share]) => share >= MIN_SHARE).forEach((color) => {
    const family = familyOf(color[0]);
    if (family && (!found[family] || color[2] > found[family][2])) found[family] = color;
  });
  return found;
};

/**
 * The pairing of opposite color families that meets in the most works: the two families, the works that hold both,
 * and a representative color for each (the biggest color among the middle third of that family's hues in those works,
 * so an orange is not shown as a red).
 *
 * @returns {{ names: [string, string], works: object[], colors: [string[], string[]] } | null}
 */
export const findPairing = (works) => {
  const profiles = works.map((work) => ({ work, families: familiesOf(work) }));
  const best = OPPOSITES
    .map(([a, b]) => ({ names: [a, b], held: profiles.filter((p) => p.families[a] && p.families[b]) }))
    .sort((x, y) => y.held.length - x.held.length)[0];
  if (!best || !best.held.length) return null;
  const typical = (family) => {
    const colors = best.held.map((p) => p.families[family]).sort((x, y) => hueOf(x[0]) - hueOf(y[0]));
    const third = Math.floor(colors.length / 3);
    return colors.slice(third, colors.length - third).sort((x, y) => y[2] - x[2])[0];
  };
  return { names: best.names, works: best.held.map((p) => p.work), colors: best.names.map(typical) };
};
