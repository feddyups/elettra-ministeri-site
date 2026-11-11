import { h } from '../lib/elements.js';
import { worksOfSeries, pictureAt } from './series-notes.js';
import { seriesGroups } from './series-order.js';
import { workPath } from './work-path.js';
import { markPicks } from './pick-star.js';
import { factsLine } from './facts.js';
import { enquiryTopic, onSale, discountOf } from './price.js';
import { renderPrice } from './price-view.js';
import { offersReady } from './offers.js';
import { placeInSet } from './sets.js';
import { seriesInfo } from '../color/scope.js';

const WIDTHS = [500, 1000, 1500];
const SIZES = '(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw';

/** The line naming a painting's set and its place in it (only the place, when the entry sits in the set's own grid), or nothing for a painting that is in none. */
const setLine = (slug, grouped) => {
  const place = placeInSet(slug);
  return place && h('small', { class: 'th-set' }, grouped ? `${place.number} of ${place.total}` : `Part of ${place.label} · ${place.number} of ${place.total}`);
};

/** One entry of a series page: the picture, its title and facts, and the way to enquire with the price beside it. */
export const renderEntry = (slug, work, grouped = false) => {
  const page = workPath(slug);
  const { width, height } = work.image;
  return h('li', { class: 'th-work', id: slug },
    h('a', { class: 'th-img', href: page },
      h('img', {
        src: pictureAt(work, 1000), srcset: WIDTHS.map((w) => `${pictureAt(work, w)} ${w}w`).join(', '), sizes: SIZES,
        alt: work.alt, width: 1000, height: Math.round(1000 * height / width), loading: 'lazy',
      }),
      onSale(work) && h('span', { class: 'th-sale' }, `${discountOf(work)}% off`)),
    h('div', { class: 'th-cap' },
      h('div', null, h('b', null, h('a', { href: page }, work.title)), h('small', null, factsLine(work)), setLine(slug, grouped)),
      h('div', { class: 'th-act' },
        renderPrice(work, { className: 'th-price' }),
        h('a', { href: `/enquire?SQF_WORK=${encodeURIComponent(enquiryTopic(work.title, work))}` }, 'Enquire'))));
};

/**
 * Fills a series page's grid of works from the catalogue, so adding a work to the catalogue is enough to put it on its series' page:
 * every `<ul class="th-grid">` is filled for the series the page belongs to (the page's `data-series`, or its own `data-series-grid="archive"`). The strips of color and the hover labels are added to each entry afterwards
 * (works/series-strip.js), and a small star marks the artist's picks (works/pick-star.js). The works come in groups (works/series-order.js): each set the artist made
 * together has a grid of its own under its name, and the rest of the series follows in a grid of its own, each in its smooth path through color. A series with no set
 * (or whose works are all one set) is one grid, as it always was. Whatever the page already held in the list stays as it was if the series is unknown. The list stays invisible until
 * it holds its final entries in their final order (`data-ready`, see series-theme.css), so the page's stored entries are never seen reshuffling.
 */
export const initSeriesGrid = async (list) => {
  if (list.hasAttribute('data-picks') || list.hasAttribute('data-print') || list.hasAttribute('data-group')) return;
  try {
    await offersReady();
    const series = list.dataset.seriesGrid || document.documentElement.dataset.series;
    const entries = worksOfSeries(series);
    const ordered = seriesGroups(series)
      .map(({ label, slugs }) => ({ label, entries: slugs.map((slug) => entries.find(([name]) => name === slug)).filter(Boolean) }))
      .filter((group) => group.entries.length);
    const placed = new Set(ordered.flatMap((group) => group.entries.map(([slug]) => slug)));
    const rest = entries.filter(([slug]) => !placed.has(slug));
    if (rest.length) {
      const others = ordered.find((group) => group.label === null);
      if (others) others.entries.push(...rest); else ordered.push({ label: null, entries: rest });
    }
    if (!ordered.length) return;
    const several = ordered.length > 1;
    let after = list;
    ordered.forEach((group, i) => {
      const grid = i === 0 ? list : h('ul', { class: 'th-grid', 'data-group': '', 'data-ready': '' });
      if (several) {
        const title = group.label || `Also in ${(seriesInfo(series) || {}).label || 'this series'}`;
        const note = group.label ? `${group.entries.length} paintings made together` : null;
        const head = h('header', { class: 'th-group-head' }, h('h2', null, title), note && h('p', null, note));
        if (i === 0) list.before(head); else after.after(head, grid);
      }
      grid.replaceChildren(...group.entries.map(([slug, work]) => renderEntry(slug, work, Boolean(group.label))));
      markPicks(grid);
      after = grid;
    });
  } finally {
    list.setAttribute('data-ready', '');
  }
};
