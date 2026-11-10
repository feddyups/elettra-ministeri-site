import { oklabToRgb } from '../../src/lib/color-science.js';

/**
 * Chooses the background ("ground") of every series, and of the page that gathers them all, from the colors they are made of.
 * One rule applies to every one of them.
 *
 * Every sampled color of every painting is a point in a three-dimensional space (lightness and the two color axes of OKLab). The cast of a group of
 * works is the centre of mass of those points: how far, and in which direction, the colors as a whole lean away from neutral. Chevreul's and Itten's
 * principle is that a harmonious set of colors mixes to neutral, so the ground that complements the set is the opposite of its cast: the hue turned
 * half a circle, which makes the colors lean back toward balance and, by simultaneous contrast, stand out. A set whose colors already cancel each other
 * has a faint cast and takes a faint complement.
 *
 * The ground is that opposite hue at a fixed lightness, and a chroma taken from how colorful the colors are (the same share of their mean chroma for
 * every group, within one range), with the lightness lowered until the text color reads on it.
 *
 * @param {Record<string, { cast: number[], meanChroma: number }>} groups  slug to the cast `[L, a, b]` and mean chroma of its colors
 * @param {{ ink: number[], lightness: number, minChroma: number, maxChroma: number, chromaShare: number, minContrast: number }} settings
 * @returns {Record<string, { rgb: number[], hue: number, why: string }>}
 */

const channel = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const luminance = (c) => 0.2126 * channel(c[0]) + 0.7152 * channel(c[1]) + 0.0722 * channel(c[2]);
export const contrastOf = (a, b) => { const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };

const degrees = (radians) => (radians * 180 / Math.PI + 360) % 360;

export const deriveGrounds = (groups, settings) => Object.fromEntries(Object.entries(groups).map(([slug, { cast, meanChroma }]) => {
  const castHue = degrees(Math.atan2(cast[2], cast[1]));
  const hue = (castHue + 180) % 360;
  const chroma = Math.min(settings.maxChroma, Math.max(settings.minChroma, meanChroma * settings.chromaShare));
  let lightness = settings.lightness;
  let rgb;
  do {
    const lab = [lightness, chroma * Math.cos(hue * Math.PI / 180), chroma * Math.sin(hue * Math.PI / 180)];
    rgb = oklabToRgb(lab).map((v) => Math.min(255, Math.max(0, Math.round(v))));
    lightness -= 0.01;
  } while (contrastOf(rgb, settings.ink) < settings.minContrast && lightness > 0.1);
  const lean = Math.hypot(cast[1], cast[2]);
  return [slug, { rgb, hue: Math.round(hue), why: `opposite of a cast of ${lean.toFixed(3)} toward ${Math.round(castHue)} degrees` }];
}));
