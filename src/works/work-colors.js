import { h } from '../lib/elements.js';
import { describeWork } from './describe-work.js';
import { renderWorkNext } from './work-next.js';
import { renderSwatch } from '../color/swatch.js';
import { CATALOGUE } from './catalogue.js';

const swatches = (work, host) => {
  const point = (index) => host.dispatchEvent(new CustomEvent('wp:color', { detail: { index } }));
  return h('div', { class: 'wp-swatches' }, h('div', { class: 'wp-swatch-row' }, work.palette.map(([hex, name, share], index) =>
    renderSwatch({ hex, name, share }, { work: work.slug, series: work.series, className: 'wp-swatch', showHex: true, onEnter: () => point(index), onLeave: () => point(null) }))));
};

/** The reading of one painting's colors in words, its colors (point at one to see where it lives), and where to look next. */
export const renderWorkColors = ({ host, work, scope, series }) => {
  const { sentence, standout } = describeWork(work, series.works, series.label);
  return h('section', { class: 'wp-section wp-colors' },
    h('p', { class: 'ca-label' }, 'The colors of this painting'),
    h('p', { class: 'wp-reading' }, sentence, standout && ` ${standout}`),
    (CATALOGUE[work.slug].colorNote || []).map((paragraph) => h('p', { class: 'wp-reading wp-note' }, paragraph)),
    swatches(work, host),
    renderWorkNext({ work, scope }));
};
