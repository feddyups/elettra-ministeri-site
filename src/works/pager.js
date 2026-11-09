import { h } from '../lib/elements.js';
import { initOnceFor } from '../lib/dom.js';
import { seriesList, seriesInfo } from '../color/scope.js';
import { CATALOGUE } from './catalogue.js';

const PAINTINGS = '/paintings/';

const link = (direction, label, title, href) => h('a', { class: `em-pager-link em-pager-link--${direction}`, href },
  h('small', null, direction === 'prev' ? `‹ ${label}` : `${label} ›`),
  h('b', null, title));

/**
 * The bar at the bottom of a series page and of a painting page. Squarespace fills it from the order of the whole
 * collection, which mixes the series pages with every painting page; this replaces its content:
 * - a series page links to the previous and next series, going around from the last to the first;
 * - a painting page links back to its series.
 * Any other page is left as it is.
 */
const render = (bar) => {
  const slug = location.pathname.replace(/\/$/, '').split('/').filter(Boolean).pop();
  const series = seriesList().filter((s) => s.path.startsWith(PAINTINGS));
  const index = location.pathname.startsWith(PAINTINGS) ? series.findIndex((s) => s.slug === slug) : -1;

  let content;
  if (index > -1) {
    const previous = series[(index - 1 + series.length) % series.length];
    const next = series[(index + 1) % series.length];
    content = [link('prev', 'Previous', previous.label, previous.path), link('next', 'Next', next.label, next.path)];
  } else if (CATALOGUE[slug]) {
    const parent = seriesInfo(CATALOGUE[slug].series);
    if (!parent) return;
    content = [link('prev', 'Back to', parent.label, parent.path)];
  } else return;

  bar.classList.add('em-pager');
  bar.replaceChildren(h('nav', { class: 'em-pager-inner', 'aria-label': index > -1 ? 'Series' : 'Series of this work' }, content));
};

initOnceFor('.item-pagination', 'pager', render);
