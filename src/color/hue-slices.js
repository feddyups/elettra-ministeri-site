import { readPalette, MIN_CHROMA } from '../lib/color-harmony.js';
import { joinNames } from './text.js';

/*
 * What a slice of the hue wheel means for a set of paintings (the wheel has 24 slices of 15 degrees of OKLCH hue, starting at 0):
 * which paintings hold that hue, whether it is their main color, a small accent or support, which named colors fall in it, and what
 * lies opposite. A painting "holds" a hue when colors in the slice cover at least HOLDS of its picture.
 */
export const SLICES = 24;
const HOLDS = 0.03;

const WORDS = [[20, 'pink'], [45, 'red'], [75, 'orange'], [105, 'yellow'], [135, 'yellow-green'], [165, 'green'], [200, 'teal'], [235, 'sky blue'], [265, 'blue'], [295, 'indigo'], [335, 'violet'], [360, 'magenta']];

/** The plain name of a slice's hue. */
export const hueWord = (index) => {
  const mid = (index + 0.5) * 360 / SLICES;
  return WORDS.find(([limit]) => mid < limit)[1];
};

const inSlice = (color, index) => color.C >= MIN_CHROMA && Math.floor(color.h / (360 / SLICES)) % SLICES === index;
const plain = (name) => name.replace(/^(light|deep|dark) /, '');
const count = (n) => (n === 1 ? 'one painting' : `${n} paintings`);

/** Each work's reading, worked out once per set of works. */
const readings = (works) => works.map((work) => ({ work, reading: readPalette(work.palette) }));

/**
 * What the slice `index` holds in `scope`'s paintings: `{ word, held, total, works, mains, accents, names, opposite, text }`.
 * `works` are the paintings that hold it, the one holding most first.
 */
export const readSlice = (scope, index) => {
  const all = readings(scope.works);
  const total = all.length;
  const coverage = (entry, slice) => {
    const sum = entry.reading.colors.reduce((s, c) => s + c.share, 0) || 1;
    return entry.reading.colors.filter((c) => inSlice(c, slice)).reduce((s, c) => s + c.share, 0) / sum;
  };
  const holders = (slice) => all.map((entry) => ({ entry, cover: coverage(entry, slice) })).filter((x) => x.cover >= HOLDS).sort((a, b) => b.cover - a.cover);
  const held = holders(index);
  const mains = held.filter((x) => x.entry.reading.dominant && inSlice(x.entry.reading.dominant, index));
  const accents = held.filter((x) => x.entry.reading.accent && inSlice(x.entry.reading.accent, index));
  const names = [...new Set(held.flatMap((x) => x.entry.reading.colors.filter((c) => inSlice(c, index)).map((c) => plain(c.name))))].slice(0, 3);
  const oppositeIndex = (index + SLICES / 2) % SLICES;
  const opposite = { word: hueWord(oppositeIndex), held: holders(oppositeIndex).length };
  const word = hueWord(index);

  let text;
  if (!held.length) {
    text = `No painting in ${scope.label} holds this ${word}.`;
  } else {
    const parts = [`${word[0].toUpperCase()}${word.slice(1)} is in ${held.length} of the ${total} paintings in ${scope.label}.`];
    if (mains.length) parts.push(`In ${count(mains.length)} it is the main color.`);
    if (accents.length) parts.push(`In ${count(accents.length)} it is the small answer set against the main color.`);
    if (names.length) parts.push(`The colors here: ${joinNames(names)}.`);
    parts.push(opposite.held ? `Opposite it, ${opposite.word} is in ${count(opposite.held)}.` : `Nothing opposite it, no ${opposite.word}, appears.`);
    text = parts.join(' ');
  }
  return { word, held: held.length, total, works: held.map((x) => x.entry.work), mains: mains.map((x) => x.entry.work), accents: accents.map((x) => x.entry.work), names, opposite, text };
};
