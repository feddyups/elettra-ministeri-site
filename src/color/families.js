import { rgbToOklab, oklabToRgb, toHex, chroma, hue, distance, nearestName } from '../lib/color-science.js';

/*
 * The colors of a body of work gathered into families of similar colors. A family is a stretch of the hue wheel (neutrals are the colors with
 * too little chroma to have a hue); every main color of every painting belongs to exactly one, so the families add up to the whole.
 */
const NEUTRAL_CHROMA = 0.045;
const SAME_SHADE = 0.06;
const ENOUGH = 0.05;
const SHADES_SHOWN = 4;

export const FAMILIES = [
  { id: 'red', label: 'Reds and pinks', from: 345, to: 40 },
  { id: 'orange', label: 'Oranges and browns', from: 40, to: 80 },
  { id: 'yellow', label: 'Yellows', from: 80, to: 115 },
  { id: 'green', label: 'Greens', from: 115, to: 175 },
  { id: 'blue', label: 'Blues', from: 175, to: 300 },
  { id: 'violet', label: 'Violets', from: 300, to: 345 },
  { id: 'neutral', label: 'Neutrals' },
];

const lab = (hex) => rgbToOklab(...[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)));
const within = (h, from, to) => (from < to ? h >= from && h < to : h >= from || h < to);

/** The family a color belongs to. */
export const familyOf = (hex) => {
  const point = lab(hex);
  if (chroma(point) < NEUTRAL_CHROMA) return 'neutral';
  const h = hue(point);
  return FAMILIES.find((family) => family.to !== undefined && within(h, family.from, family.to)).id;
};

/** The shades of a family: its colors across the works, those close to each other merged into one, as `[hex, name, share]` (the mean share of a painting), the widest first. */
const shadesOf = (members, count) => {
  const groups = [];
  [...members].sort((a, b) => b.share - a.share).forEach((member) => {
    const near = groups.find((group) => distance(group.center, member.point) < SAME_SHADE);
    if (near) near.share += member.share; else groups.push({ center: member.point, share: member.share });
  });
  return groups.sort((a, b) => b.share - a.share).slice(0, SHADES_SHOWN).map((group) => [toHex(oklabToRgb(group.center)), nearestName(group.center), group.share / count]);
};

/** The one color a family is shown as: all of its colors across the works blended, each in proportion to the share of a painting it covers (averaged in OKLab, so the blend looks like what the eye would mix). */
const tintOf = (members) => {
  const total = members.reduce((sum, member) => sum + member.share, 0);
  return toHex(oklabToRgb([0, 1, 2].map((axis) => members.reduce((sum, member) => sum + member.point[axis] * member.share, 0) / total)));
};

/**
 * The families of a scope, the widest first: `{ id, label, share, tint, shades, carriers }`. `share` is how much of an average painting of the scope
 * is of the family; `carriers` are the works with at least ENOUGH of it.
 */
export const colorFamilies = (scope) => {
  const count = scope.works.length;
  return FAMILIES.map((family) => {
    const members = [];
    const carriers = [];
    scope.works.forEach((work) => {
      let own = 0;
      work.palette.forEach(([hex, , share]) => { if (familyOf(hex) === family.id) { own += share; members.push({ point: lab(hex), share }); } });
      if (own >= ENOUGH) carriers.push(work);
    });
    const share = members.reduce((sum, member) => sum + member.share, 0) / count;
    return { id: family.id, label: family.label, share, tint: tintOf(members), shades: shadesOf(members, count), carriers };
  }).filter((family) => family.share > 0).sort((a, b) => b.share - a.share);
};
