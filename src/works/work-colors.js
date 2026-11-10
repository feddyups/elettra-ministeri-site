import { h } from '../lib/elements.js';
import { renderStatRow } from '../color/blocks/stat-row.js';
import { renderWarmthMap } from '../color/blocks/warmth-map.js';
import { describeWork } from './describe-work.js';
import { similarWorks } from './similar-works.js';
import { renderSwatch } from '../color/swatch.js';
import { CATALOGUE } from './catalogue.js';

const swatches = (work, host) => {
  const point = (index) => host.dispatchEvent(new CustomEvent('wp:color', { detail: { index } }));
  return h('div', { class: 'wp-swatches' }, h('div', { class: 'wp-swatch-row' }, work.palette.map(([hex, name, share], index) =>
    renderSwatch({ hex, name, share }, { work: work.slug, series: work.series, className: 'wp-swatch', showHex: true, onEnter: () => point(index), onLeave: () => point(null) }))));
};

/** The colorimetric reading of one painting: its colors (point at one to see where it lives), the numbers, where it sits among all works, and the works closest to it in color. */
export const renderWorkColors = ({ host, work, scope, series }) => {
  const { sentence, standout, build, figures } = describeWork(work, series.works, series.label);
  const similar = similarWorks(work, scope.universe);
  return h('section', { class: 'wp-section wp-colors' },
    h('p', { class: 'ca-label' }, 'The colors of this painting'),
    h('p', { class: 'wp-reading' }, sentence, standout && ` ${standout}`, build && ` ${build}`, figures && ` ${figures}`),
    (CATALOGUE[work.slug].colorNote || []).map((paragraph) => h('p', { class: 'wp-reading wp-note' }, paragraph)),
    swatches(work, host),
    renderStatRow(scope),
    h('div', { class: 'wp-where' },
      h('p', { class: 'ca-label' }, 'Where it sits among all of my work'),
      renderWarmthMap(scope)),
    h('div', { class: 'wp-similar' },
      h('p', { class: 'ca-label' }, 'Close in color'),
      h('div', { class: 'ca-strips' }, similar.map((other) => h('a', { class: 'ca-strip', href: other.href, 'aria-label': other.title },
        other.palette.map(([hex, name, share]) => h('i', { style: { '--share': share, '--color': hex }, 'data-name': name })))))));
};
