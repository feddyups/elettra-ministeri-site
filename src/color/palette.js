import { rgbToOklab, oklabToRgb, toHex, distance, nameColors } from '../lib/color-science.js';

const parse = (hex) => rgbToOklab(...[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)));

/**
 * Merges palette colors that are closer than `threshold` (perceptual distance, see focus-config.js) into one,
 * so two swatches never select the same part of a painting. The heavier color absorbs the lighter one: the
 * merged color is their average weighted by share, and the shares add up. Names are re-chosen for the merged set.
 *
 * @param {[string, string, number][]} palette [hex, name, share] rows, in any order
 * @returns {[string, string, number][]} the merged rows, largest share first
 */
export const mergeCloseColors = (palette, threshold) => {
  if (!threshold || palette.length < 2) return palette;
  const groups = [];
  [...palette].sort((a, b) => b[2] - a[2]).forEach(([hex, , share]) => {
    const lab = parse(hex);
    const near = groups.find((g) => distance(g.lab, lab) < threshold);
    if (!near) { groups.push({ lab, share }); return; }
    const total = near.share + share;
    near.lab = near.lab.map((v, i) => (v * near.share + lab[i] * share) / total);
    near.share = total;
  });
  if (groups.length === palette.length) return palette;
  const names = nameColors(groups.map((g) => g.lab));
  return groups.map((g, i) => [toHex(oklabToRgb(g.lab)), names[i], +g.share.toFixed(3)]);
};
