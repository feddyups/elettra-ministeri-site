import { h } from '../lib/elements.js';
import { describeWork } from './describe-work.js';
import { CATALOGUE } from './catalogue.js';

const swatches = (work) => h('div', { class: 'wp-swatches' }, h('div', { class: 'wp-swatch-row' }, work.palette.map(([hex, name]) =>
  h('div', { class: 'wp-swatch' }, h('i', { style: { background: hex } }), h('span', null, name), h('small', null, hex)))));

/** The reading of one painting's colors in words, and its colors, named, as plain information. */
export const renderWorkColors = ({ work, series }) => {
  const { sentence, standout } = describeWork(work, series.works, series.label);
  return h('section', { class: 'wp-section wp-colors' },
    h('p', { class: 'ca-label' }, 'The colors of this painting'),
    h('p', { class: 'wp-reading' }, sentence, standout && ` ${standout}`),
    (CATALOGUE[work.slug].colorNote || []).map((paragraph) => h('p', { class: 'wp-reading wp-note' }, paragraph)),
    swatches(work));
};
