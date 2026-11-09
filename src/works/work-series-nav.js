import { h } from '../lib/elements.js';

const strip = (work, current) => h('a', { class: current ? 'ca-strip is-current' : 'ca-strip', href: work.href, 'aria-label': work.title, 'aria-current': current ? 'page' : false },
  work.palette.map(([hex, name, share]) => h('i', { style: { '--share': share, '--color': hex }, 'data-name': name })));

/** The rest of the series as strips of color, with the way to the previous and next painting. */
export const renderWorkSeriesNav = (work, series) => {
  const index = series.works.findIndex((w) => w.slug === work.slug);
  const previous = series.works[(index - 1 + series.works.length) % series.works.length];
  const next = series.works[(index + 1) % series.works.length];
  return h('section', { class: 'wp-section' },
    h('p', { class: 'ca-label' }, `More in ${series.label}`),
    h('div', { class: 'ca-strips' }, series.works.map((w) => strip(w, w.slug === work.slug))),
    series.works.length > 1 && h('nav', { class: 'wp-pager', 'aria-label': `${series.label} paintings` },
      h('a', { href: previous.href }, `‹ ${previous.title}`),
      h('a', { href: series.path }, `All of ${series.label}`),
      h('a', { href: next.href }, `${next.title} ›`)));
};
