import { drawMark, TRIAD } from './mark.js';
import { findWork, seriesColors } from '../color/scope.js';

/**
 * The browser tab and the browser's own bar take their colors from the page.
 *  - Tab icon: the mark's three arms wear the colors of the painting on the page (its three most distinct, bright colors),
 *    or of the series on a series page; everywhere else the static icons from the header apply (the default three).
 *    The live icon is a canvas PNG, so every browser shows it, Safari included.
 *  - Bar color (`theme-color`, used by mobile browsers): the page's own background, followed when the visitor changes a series' background.
 */
const SERIES_PAGE = /^\/(mediterranean|maternity|sicily|human-figure|archive)$/;
const WORK_PAGE = /^\/(?:paintings|textiles|textile-works|print|postcards)\/([a-z0-9-]+)$/;
const SEPARATE = 90;

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const distance = (a, b) => Math.hypot(...rgb(a).map((v, i) => v - rgb(b)[i]));
const brightness = (hex) => { const [r, g, b] = rgb(hex); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };

/** Up to three distinct colors that show on a dark tile, in the order given, topped up from the default three. */
export const pickArms = (hexes) => {
  const chosen = [];
  hexes.forEach((hex) => {
    if (chosen.length < 3 && brightness(hex) > 70 && chosen.every((c) => distance(c, hex) > SEPARATE)) chosen.push(hex);
  });
  TRIAD.forEach((hex) => { if (chosen.length < 3 && chosen.every((c) => distance(c, hex) > SEPARATE)) chosen.push(hex); });
  return chosen.concat(TRIAD).slice(0, 3);
};

const coloursOnPage = () => {
  const path = location.pathname.replace(/\/$/, '');
  const series = path.match(SERIES_PAGE);
  if (series) return (seriesColors(series[1]) || []).map((c) => c.hex);
  const work = path.match(WORK_PAGE);
  const found = work && findWork(work[1]);
  return found ? found.palette.map(([hex]) => hex) : null;
};

const setTabIcon = (arms) => {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  if (!canvas.getContext('2d') || !canvas.getContext('2d').roundRect) return;
  drawMark(canvas.getContext('2d'), 64, arms);
  document.querySelectorAll('link[rel~="icon"]').forEach((link) => link.remove());
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/png';
  link.sizes = '64x64';
  link.href = canvas.toDataURL('image/png');
  document.head.append(link);
};

const followBackground = () => {
  const meta = document.querySelector('meta[name="theme-color"]') || Object.assign(document.createElement('meta'), { name: 'theme-color' });
  if (!meta.isConnected) document.head.append(meta);
  const paint = () => {
    const color = [document.body, document.documentElement].map((el) => getComputedStyle(el).backgroundColor).find((c) => c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent');
    if (color) meta.content = color;
  };
  paint();
  new MutationObserver(paint).observe(document.documentElement, { attributes: true, attributeFilter: ['data-tone', 'data-series'] });
};

try {
  const colours = coloursOnPage();
  if (colours && colours.length) setTabIcon(pickArms(colours));
  followBackground();
} catch (error) { /* the static icons and the header's bar color stay */ }
