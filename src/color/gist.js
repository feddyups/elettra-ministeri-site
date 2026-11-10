import { readPalette } from '../lib/color-harmony.js';

/** How vivid a painting or a series is, in a word (the numbers are the share of strongly saturated color). */
export const vividWord = (vivid) => (vivid >= 25 ? 'vivid' : vivid >= 12 ? 'lively' : 'quiet');

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
