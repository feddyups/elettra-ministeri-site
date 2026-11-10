import { h } from '../lib/elements.js';
import { workPath } from '../works/work-path.js';
import { passes } from './filter-state.js';
import { rgbToOklab, chroma, hue } from '../lib/color-science.js';

/*
 * Every main color of every painting as one mosaic. A tile is one of a painting's main colors; it links to that painting and names it
 * when pointed at. Tiles run through the hues from red round to violet, light to dark within each stretch of hue, with the near-neutrals
 * (greys, paper, black) at the end. A color that covers a large part of its picture gets a tile four times the size of the others.
 * The mosaic follows the choices made elsewhere on the page: works outside them fade back.
 */
const NEUTRAL = 0.045;   // OKLab chroma below which a color counts as a neutral
const RED = 20;          // the hue (degrees) where the run begins
const STRETCH = 20;      // degrees of hue that are sorted by lightness together
const LARGE = 0.28;      // share of the picture from which a tile is large

const tileOf = (work, [hex, name, share]) => {
  const lab = rgbToOklab(...[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)));
  return { work, hex, name, share, lightness: lab[0], neutral: chroma(lab) < NEUTRAL, hue: (hue(lab) - RED + 360) % 360 };
};

const inOrder = (tiles) => [
  ...tiles.filter((t) => !t.neutral).sort((a, b) => Math.floor(a.hue / STRETCH) - Math.floor(b.hue / STRETCH) || b.lightness - a.lightness),
  ...tiles.filter((t) => t.neutral).sort((a, b) => a.lightness - b.lightness),
];

export const renderColorMosaic = (works, filter) => {
  const tiles = inOrder(works.flatMap((work) => work.palette.map((color) => tileOf(work, color))));
  const nodes = tiles.map((tile) => h('a', {
    class: tile.share >= LARGE ? 'ov-tile-color ov-tile-color--large' : 'ov-tile-color',
    href: workPath(tile.work.slug),
    style: { '--color': tile.hex },
    'data-tip': tile.work.title, 'data-series': tile.work.seriesLabel, 'data-name': tile.name, 'data-meta': `${Math.round(tile.share * 100)}% of the picture`,
    'aria-label': `${tile.name} in ${tile.work.title}`,
  }));
  filter.subscribe((state) => nodes.forEach((node, i) => node.classList.toggle('is-faded', !passes(state, tiles[i].work))));
  return h('div', { class: 'ov-mosaic' }, nodes);
};
