import { h } from '../lib/elements.js';
import { initOnceFor } from '../lib/dom.js';
import { seriesList, seriesInfo } from '../color/scope.js';
import { CATALOGUE } from './catalogue.js';
import { pagerLink as link } from './pager-link.js';

/** The series of paintings, in display order (the textiles have their own page). */
export const paintingSeries = () => seriesList().filter((s) => s.slug !== 'textiles');

/** The bar at the bottom of a series page: the previous and next series, going around from the last to the first. */
export const seriesPager = (slug) => {
  const series = paintingSeries();
  const index = series.findIndex((s) => s.slug === slug);
  if (index < 0) return null;
  const previous = series[(index - 1 + series.length) % series.length];
  const next = series[(index + 1) % series.length];
  return h('section', { class: 'item-pagination em-pager' },
    h('nav', { class: 'em-pager-inner', 'aria-label': 'Series' }, link('prev', 'Previous', previous.label, previous.path), link('next', 'Next', next.label, next.path)));
};

/**
 * The bar at the bottom of a painting page. Squarespace fills it from the order of the whole collection; this replaces its content with a
 * link back to the painting's series. Any other page is left as it is.
 */
const render = (bar) => {
  const slug = location.pathname.replace(/\/$/, '').split('/').filter(Boolean).pop();
  const parent = CATALOGUE[slug] && seriesInfo(CATALOGUE[slug].series);
  if (!parent) return;
  bar.classList.add('em-pager');
  bar.replaceChildren(h('nav', { class: 'em-pager-inner', 'aria-label': 'Series of this work' }, link('prev', 'Back to', parent.label, parent.path)));
};

initOnceFor('.item-pagination:not(.em-pager)', 'pager', render);
