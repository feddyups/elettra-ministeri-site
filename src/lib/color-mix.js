import { rgbToOklab, oklabToRgb } from './color-science.js';

const canvas = document.createElement('canvas').getContext('2d');
const parsed = new Map();

/** Any CSS color (hex, rgb(), a name) as [r, g, b], 0-255. */
export const parseColor = (css) => {
  if (!parsed.has(css)) {
    canvas.fillStyle = '#000';
    canvas.fillStyle = css;
    const hex = canvas.fillStyle;
    parsed.set(css, [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)));
  }
  return parsed.get(css);
};

/** The color a fraction `t` (0 to 1) of the way from `from` to `to`, mixed the way the eye does (OKLab), as an rgb() string. */
export const mixColors = (from, to, t) => {
  if (t <= 0) return from;
  if (t >= 1) return to;
  const a = rgbToOklab(...parseColor(from));
  const b = rgbToOklab(...parseColor(to));
  const rgb = oklabToRgb(a.map((v, i) => v + (b[i] - v) * t)).map((v) => Math.round(Math.min(255, Math.max(0, v))));
  return `rgb(${rgb.join(',')})`;
};
