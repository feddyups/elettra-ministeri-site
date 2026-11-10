import { readPalette, harmonyOf } from '../lib/color-harmony.js';
import { depictsPeople } from '../overview/subjects.js';
import { findAccentPattern } from './accent-pattern.js';
import { joinNames } from './text.js';

/*
 * The key to reading the paintings (la chiave di lettura): what the measurements of color mean, said in words. The numbers
 * stay as a small piece of evidence under each reading; the reading itself is the point. Every reading is only written
 * when the paintings it describes are numerous enough to say it, so a series with two works does not get a sweeping claim.
 *
 * What the site claims here, and on what basis:
 *   - People are not painted in skin colors: among the paintings whose subject is a person or a body (read from the
 *     catalogue), a skin color (light to mid orange-pink-brown of modest chroma) is not among the main colors.
 *   - Warm against cool: a painting that is neither mostly warm nor mostly cool sets the two against each other.
 *   - A family of hues and a small answer: see lib/color-harmony.js (gathered hues, opposite accent, opposite partner).
 *   - Light and dark stay close: the lightest and darkest main colors of a painting are never far apart.
 */

const SKIN = { hue: [20, 80], light: [0.55, 0.92], chroma: [0.03, 0.13] };
const SKIN_COVERAGE = 0.15;

const isSkin = (c) => c.h >= SKIN.hue[0] && c.h <= SKIN.hue[1] && c.L >= SKIN.light[0] && c.L <= SKIN.light[1] && c.C >= SKIN.chroma[0] && c.C <= SKIN.chroma[1];
export const hasSkinColor = (reading) => {
  const total = reading.colors.reduce((sum, c) => sum + c.share, 0) || 1;
  return reading.colors.filter(isSkin).reduce((sum, c) => sum + c.share, 0) / total >= SKIN_COVERAGE;
};

/** How vivid a painting or a series is, in a word (the numbers are the share of strongly saturated color). */
export const vividWord = (vivid) => (vivid >= 25 ? 'vivid' : vivid >= 12 ? 'lively' : 'quiet');

const temperatureOf = (work) => (work.warm >= 70 ? 'warm' : work.warm <= 30 ? 'cool' : 'against');

const unique = (names) => [...new Set(names)];

/** The readings that hold for a set of works: `[{ key, title, text, evidence, works }]`. */
export const readingsFor = (works) => {
  const entries = works.map((work) => ({ work, reading: readPalette(work.palette), people: depictsPeople(work.slug) }));
  const found = [];

  const people = entries.filter((e) => e.people);
  const unreal = people.filter((e) => !hasSkinColor(e.reading));
  if (people.length >= 2 && unreal.length / people.length >= 0.5) {
    const names = unique(unreal.map((e) => e.reading.dominant && e.reading.dominant.name.replace(/^(light|deep|dark) /, '')).filter(Boolean)).slice(0, 4);
    found.push({
      key: 'not-real', title: 'Color is not description',
      text: `When a painting is of people, I rarely reach for skin color. These pictures are built from colors such as ${joinNames(names)}, chosen for what they do in the picture, not for what the thing looks like.`,
      evidence: `${unreal.length} of ${people.length} paintings of people have no skin color among their main colors`,
      works: unreal.map((e) => e.work),
    });
  }

  const against = entries.filter((e) => temperatureOf(e.work) === 'against');
  const warm = entries.filter((e) => temperatureOf(e.work) === 'warm').length;
  const cool = entries.length - against.length - warm;
  if (against.length >= 2 && against.length / entries.length >= 0.3) {
    found.push({
      key: 'temperature', title: 'Warm answers cool',
      text: `${against.length / entries.length >= 0.5 ? 'Half or more' : 'A good part'} of these paintings set a warm mass against a cool one, so the eye keeps moving between the two. ${warm ? `${warm} stay warm throughout` : ''}${warm && cool ? ' and ' : ''}${cool ? `${cool} stay cool` : ''}${warm || cool ? '.' : ''}`.trim(),
      evidence: `${against.length} of ${entries.length} are neither mostly warm nor mostly cool`,
      works: against.map((e) => e.work),
    });
  }

  const pattern = findAccentPattern(works);
  if (pattern && pattern.works.length >= 2) {
    const harmony = harmonyOf(works, 200);
    found.push({
      key: 'answer', title: 'A family of hues, and one small answer',
      text: `My color usually comes as a family of neighboring hues, and the opposite side of the wheel appears as a small answer, most often a ${pattern.accentFamily} accent on a ${pattern.dominantFamily} mass. I rarely set opposites against each other as equals.`,
      evidence: `neighboring hues make up ${Math.round(harmony.adjacent * 100)}% of the color placed side by side, against ${Math.round(harmony.chanceAdjacent * 100)}% by chance; opposites ${Math.round(harmony.opposite * 100)}%, as chance would give`,
      works: pattern.works,
    });
  }

  const ranges = entries.map((e) => e.reading.lightRange);
  const widest = Math.max(...ranges);
  if (entries.length >= 3 && widest < 0.55) {
    found.push({
      key: 'value', title: 'Light and dark stay close',
      text: 'I do not lean on strong shadows. In every painting the lightest and darkest of the main colors stay close, so shapes read through their hue and temperature more than through modeling.',
      evidence: `the widest gap between a painting's lightest and darkest main color is ${Math.round(widest * 100)}% of the scale`,
      works: [...entries].sort((a, b) => a.reading.lightRange - b.reading.lightRange).slice(0, 6).map((e) => e.work),
    });
  }
  return found;
};

/** One line on what a set of works does with color, from its measurements. */
export const gistOf = (works) => {
  if (!works.length) return '';
  const mean = (key) => works.reduce((sum, w) => sum + w[key], 0) / works.length;
  const warm = mean('warm');
  const temperature = warm >= 65 ? 'Warm throughout' : warm <= 35 ? 'Cool and green' : 'Warm set against cool';
  const readings = works.map((w) => readPalette(w.palette));
  const answered = readings.filter((r) => r.accent || r.partner).length / works.length;
  const parts = [temperature, vividWord(mean('vivid'))];
  if (answered >= 0.6) parts.push('with a small opposite answering');
  return `${parts[0]}, ${parts[1]}${parts[2] ? `, ${parts[2]}` : ''}.`;
};
