import { rgbToOklab, oklabToRgb, chroma } from '../lib/color-science.js';

/*
 * The color of the band behind "Where to look next", worked out from the paintings it offers so that it sits with all of them
 * (the way a wall color is chosen for a hang): the three paintings' colors, weighted by how much of each they cover, are averaged
 * in OKLab; the average is then made deep (low lightness) and nearly neutral (its chroma cut hard), and a little of the series color
 * is mixed back in so the band still belongs to its page. Every number below is one setting for every page; nothing is set per painting.
 */
const DEPTH = 0.45;        // the band's lightness, as a fraction of the average's, before the limits
const LIGHTNESS = [0.17, 0.25];
const CHROMA_KEEP = 0.5;   // how much of the average's chroma stays
const CHROMA_MAX = 0.045;  // and the most it may have
const SERIES_MIX = 0.25;   // how much of the series color is mixed in
const MIN_CONTRAST = 8;    // against the page's paper-colored text
const PAPER = [250, 248, 245];
const NIGHT = 'rgb(20,17,15)';

const parse = (css) => (css.match(/\d+/g) || []).slice(0, 3).map(Number);
const channel = (v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
const luminance = ([r, g, b]) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
export const contrast = (a, b) => { const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };

const toRgb = (lab) => oklabToRgb(lab).map((v) => Math.round(Math.min(255, Math.max(0, v))));

/**
 * `rgb(r,g,b)` for the band behind the given paintings (each with a `palette` of `[hex, name, share]`), tinted toward `seriesBg`
 * (an `rgb()` string). Falls back to the site's night color if anything is missing.
 */
export const nextBandColor = (works, seriesBg) => {
  let L = 0; let a = 0; let b = 0; let weight = 0;
  works.forEach((work) => work.palette.forEach(([hex, , share]) => {
    const lab = rgbToOklab(...[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)));
    L += lab[0] * share; a += lab[1] * share; b += lab[2] * share; weight += share;
  }));
  if (!weight) return NIGHT;
  [L, a, b] = [L / weight, a / weight, b / weight];
  const keep = Math.min(CHROMA_KEEP, CHROMA_MAX / (chroma([0, a, b]) || 1));
  let lab = [Math.min(LIGHTNESS[1], Math.max(LIGHTNESS[0], L * DEPTH)), a * keep, b * keep];
  const series = seriesBg && parse(seriesBg).length === 3 ? rgbToOklab(...parse(seriesBg)) : null;
  if (series) lab = lab.map((v, i) => v + (series[i] - v) * SERIES_MIX);
  let rgb = toRgb(lab);
  for (let step = 0; contrast(rgb, PAPER) < MIN_CONTRAST && step < 12; step++) { lab = [lab[0] * 0.92, lab[1], lab[2]]; rgb = toRgb(lab); }
  return `rgb(${rgb.join(',')})`;
};
