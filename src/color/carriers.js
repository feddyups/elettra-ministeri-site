import { rgbToOklab, distance } from '../lib/color-science.js';

/*
 * Which paintings carry a color: those with a main color of their own that is close to it (within CLOSE in OKLab) and that covers
 * at least ENOUGH of the picture. A series' or the whole work's palette is pooled from many paintings, so a color in it is
 * rarely one painting's property; this says how widely it is shared.
 */
const CLOSE = 0.09;
const ENOUGH = 0.05;

const lab = (hex) => rgbToOklab(...[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)));

/** The works of `scope` that carry `hex`, the one with most of it first. */
export const carriersOf = (scope, hex) => {
  const target = lab(hex);
  return scope.works
    .map((work) => ({ work, share: work.palette.filter(([other, , share]) => share >= ENOUGH && distance(target, lab(other)) < CLOSE).reduce((sum, [, , share]) => sum + share, 0) }))
    .filter((x) => x.share > 0)
    .sort((a, b) => b.share - a.share)
    .map((x) => x.work);
};
