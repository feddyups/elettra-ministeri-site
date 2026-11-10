import { hueFamily } from '../lib/color-science.js';
import { readPalette, hueGap } from '../lib/color-harmony.js';

const FAMILY_WORDS = { warm: 'warm', green: 'green', cool: 'cool', violet: 'violet' };

/**
 * The most common way an opposite accent sits on a main color across a set of works, for example "a cool accent on a warm mass":
 * the works that do it, a typical dominant color and accent from among them (those of the work whose dominant hue is in the middle
 * of the group), and the pattern's words.
 *
 * @returns {{ dominantFamily: string, accentFamily: string, works: object[], dominant: object, accent: object, accented: number } | null}
 */
export const findAccentPattern = (works) => {
  const groups = {};
  works.forEach((work) => {
    const reading = readPalette(work.palette);
    if (!reading.accent) return;
    const key = `${hueFamily(reading.dominant.h)}>${hueFamily(reading.accent.h)}`;
    (groups[key] ||= []).push({ work, reading });
  });
  const keys = Object.keys(groups);
  if (!keys.length) return null;
  const accented = keys.reduce((sum, key) => sum + groups[key].length, 0);
  const best = groups[keys.sort((a, b) => groups[b].length - groups[a].length)[0]];
  const ordered = [...best].sort((a, b) => a.reading.dominant.h - b.reading.dominant.h);
  const middle = ordered[Math.floor(ordered.length / 2)].reading;
  const [dominantFamily, accentFamily] = [hueFamily(middle.dominant.h), hueFamily(middle.accent.h)];
  return {
    dominantFamily: FAMILY_WORDS[dominantFamily], accentFamily: FAMILY_WORDS[accentFamily],
    works: best.map((entry) => entry.work), dominant: middle.dominant, accent: middle.accent, accented,
  };
};

export { hueGap };
