import { h } from '../lib/elements.js';
import { inSeriesOrder, around } from './series-order.js';

const strip = (work, current) => h('a', { class: current ? 'ca-strip is-current' : 'ca-strip', href: work.href, 'aria-label': work.title, 'aria-current': current ? 'page' : false },
  work.palette.map(([hex, name, share]) => h('i', { style: { '--share': share, '--color': hex }, 'data-name': name })));

/** The rest of the series as strips of color, in the order of the series page, with the way to the previous and next painting. */
export const renderWorkSeriesNav = (work, series) => {
  const ordered = inSeriesOrder(series.slug, series.works, (w) => w.slug);
  const { previous, next } = around(ordered, work.slug);
  return h('section', { class: 'wp-section' },
    h('p', { class: 'ca-label' }, `More in ${series.label}`),
    h('div', { class: 'ca-strips' }, ordered.map((w) => strip(w, w.slug === work.slug))),
    ordered.length > 1 && h('nav', { class: 'wp-pager', 'aria-label': `${series.label} paintings` },
      h('a', { href: previous.href }, `‹ ${previous.title}`),
      h('a', { href: series.path }, `All of ${series.label}`),
      h('a', { href: next.href }, `${next.title} ›`)),
    ordered.length > 1 && h('p', { class: 'wp-keys wp-keys--keys' }, 'Use the ← and → keys to move through the series.'),
    ordered.length > 1 && h('p', { class: 'wp-keys wp-keys--swipe' }, 'Swipe left or right to move through the series.'));
};
