import { h } from '../lib/elements.js';
import { resolveScope } from '../color/scope.js';
import { renderHueWheel } from '../color/blocks/hue-wheel.js';
import { renderWarmthMap } from '../color/blocks/warmth-map.js';
import { renderPaletteStrip } from './series-tiles.js';
import { FAMILY_LABELS } from './works.js';

const FAMILY_COLORS = { warm: '#e2674a', green: '#4f9a56', cool: '#3f7fc4', violet: '#8b5cc4' };

const hueBar = (series) => h('div', { class: 'ov-hues', role: 'img', 'aria-label': `Share of each hue family in ${series.label}` },
  Object.keys(FAMILY_COLORS).map((key) => h('i', {
    style: { '--color': FAMILY_COLORS[key], '--share': series.stats[key] },
    'data-tip': series.label, 'data-name': FAMILY_LABELS[key], 'data-meta': `${series.stats[key]}% of the series`,
  })));

/** The series side by side: for each one its main colors, the share of each hue family and how vivid it is, warmest first. */
export const renderSeriesRows = (seriesData) => {
  const warmest = [...seriesData].sort((a, b) => b.stats.warm - a.stats.warm);
  return h('div', { class: 'ov-rows' },
    h('div', { class: 'ov-row ov-row-head', 'aria-hidden': 'true' }, h('span'), h('span', null, 'Main colors'), h('span', null, 'Hue families'), h('span', null, 'Vivid')),
    warmest.map((series) => h('div', { class: 'ov-row' },
      h('a', { href: series.path }, series.label),
      renderPaletteStrip(series),
      hueBar(series),
      h('span', { class: 'ov-vivid' }, h('b', null, `${series.stats.vivid}%`)))),
    h('ul', { class: 'ov-key' }, Object.keys(FAMILY_COLORS).map((key) => h('li', { style: { '--color': FAMILY_COLORS[key] } }, FAMILY_LABELS[key]))));
};

/** A small wheel of hues for every series, so their shapes can be compared at a glance. */
export const renderWheels = (seriesData) => h('div', { class: 'ov-wheels' }, seriesData.map((series) => h('figure', { class: 'ov-wheel' },
  renderHueWheel(resolveScope(`series:${series.slug}`)),
  h('figcaption', null, h('a', { href: series.path }, series.label), h('small', null, `${series.stats.warm}% reds and yellows`)))));

/**
 * The warm-to-cool map of every work, with a choice of series: the other series' dots step back.
 * The map redraws itself when the window is resized, so the choice is applied again after every redraw.
 */
export const renderMap = (seriesData, filter) => {
  const all = resolveScope('all');
  const figure = renderWarmthMap(all);
  const seriesOfWork = Object.fromEntries(all.works.map((w) => [w.id, w.series]));
  const apply = () => {
    const { series } = filter.get();
    figure.querySelectorAll('.ca-dot').forEach((dot) => dot.classList.toggle('is-away', Boolean(series) && seriesOfWork[dot.dataset.work] !== series));
  };
  new MutationObserver(apply).observe(figure, { childList: true, subtree: true });
  filter.subscribe(apply);
  const chips = h('div', { class: 'ov-chips', role: 'group', 'aria-label': 'Show one series' }, seriesData.map((series) => {
    const chip = h('button', { type: 'button', class: 'ov-chip', style: { '--accent': series.accent } }, series.label);
    chip.addEventListener('click', () => filter.toggle('series', series.slug));
    filter.subscribe((state) => chip.setAttribute('aria-pressed', String(state.series === series.slug)));
    return chip;
  }));
  return h('div', { class: 'ov-map' }, chips, figure,
    h('p', { class: 'ov-note' }, 'Each dot is one work, ringed in its series color. The further right, the warmer; the higher, the more saturated.'));
};
