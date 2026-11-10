import { h } from '../lib/elements.js';
import { renderPaletteStrip } from './series-tiles.js';
import { FAMILY_LABELS } from './works.js';
import { gistOf } from '../color/gist.js';

const FAMILY_COLORS = { warm: '#e2674a', green: '#4f9a56', cool: '#3f7fc4', violet: '#8b5cc4' };

const hueBar = (series) => h('div', { class: 'ov-hues', role: 'img', 'aria-label': `Share of each hue family in ${series.label}` },
  Object.keys(FAMILY_COLORS).map((key) => h('i', {
    style: { '--color': FAMILY_COLORS[key], '--share': series.stats[key] },
    'data-tip': series.label, 'data-name': FAMILY_LABELS[key], 'data-meta': `${series.stats[key]}% of the series`,
  })));

/**
 * The series side by side, warmest first: its main colors, how its hues divide, and in a line what its colors do.
 */
export const renderSeriesRows = (seriesData, worksBySeries) => {
  const warmest = [...seriesData].sort((a, b) => b.stats.warm - a.stats.warm);
  return h('div', { class: 'ov-rows' },
    h('div', { class: 'ov-row ov-row-head', 'aria-hidden': 'true' }, h('span'), h('span', null, 'Main colors'), h('span', null, 'Hue families'), h('span', null, 'What the colors do')),
    warmest.map((series) => h('div', { class: 'ov-row' },
      h('a', { href: series.path }, series.label),
      renderPaletteStrip(series),
      hueBar(series),
      h('span', { class: 'ov-gist' }, gistOf(worksBySeries[series.slug] || [])))),
    h('ul', { class: 'ov-key' }, Object.keys(FAMILY_COLORS).map((key) => h('li', { style: { '--color': FAMILY_COLORS[key] } }, FAMILY_LABELS[key]))));
};
